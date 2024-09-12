import CookieManager from '@react-native-cookies/cookies';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import i18n from '../../i18n';
import { userAgent } from '../../lib/constants';
import { useAppSelector } from '../../lib/hooks';
import { isIOS } from '../../lib/methods/helpers';
import { getRoomIdFromJitsiCallUrl } from '../../lib/methods/helpers/getRoomIdFromJitsiCall';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { endVideoConfTimer, initVideoConfTimer } from '../../lib/methods/videoConfTimer';
import { getUserSelector } from '../../selectors/login';
import { ChatsStackParamList } from '../../stacks/types';
import JitsiAuthModal from './JitsiAuthModal';
import axios from 'axios';
import { DASHBOARD_URL } from 'views/LoginView/UserForm';

const JitsiMeetView = (): React.ReactElement => {
	const {
		params: { rid, url, videoConf, callId }
	} = useRoute<RouteProp<ChatsStackParamList, 'JitsiMeetView'>>();
	const { goBack } = useNavigation();
	const user = useAppSelector(state => getUserSelector(state));
	const serverUrl = useAppSelector(state => state.server.server);

	const [authModal, setAuthModal] = useState(false);
	const [cookiesSet, setCookiesSet] = useState(false);

	const setCookies = async () => {
		const date = new Date();
		date.setDate(date.getDate() + 1);
		const expires = date.toISOString();
		const domain = serverUrl.replace(/^https?:\/\//, '');
		const ck = { domain, version: '1', expires };

		await CookieManager.set(serverUrl, {
			name: 'rc_uid',
			value: user.id,
			...ck
		});
		await CookieManager.set(serverUrl, {
			name: 'rc_token',
			value: user.token,
			...ck
		});
		setCookiesSet(true);
	};

	const handleJitsiApp = useCallback(async () => {
		const callUrl = url.replace(/^https?:\/\//, '');
		try {
			await Linking.openURL(`org.jitsi.meet://${callUrl}`);
			goBack();
		} catch (error) {
			// As the jitsi app was not opened, disable the backhandler on android
			BackHandler.addEventListener('hardwareBackPress', () => true);
		}
	}, [goBack, url]);

	const onConferenceJoined = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_JOIN : events.JM_CONFERENCE_JOIN);
		if (rid && !videoConf) {
			initVideoConfTimer(rid);
		}
	}, [rid, videoConf]);

	const endCall = async () => {
		try {
			await axios.get(`${DASHBOARD_URL}/api/endcall?callId=${callId}&username=${user.username}`);
			console.log('Call joined successfully');
			goBack();
		} catch (error) {
			console.error('Error joining the call:', error);
		}
	};

	const onNavigationStateChange = useCallback(
		webViewState => {
			const roomId = getRoomIdFromJitsiCallUrl(url);
			console.log('sjei  dk ', url);
			if (webViewState.url.includes('auth-static')) {
				setAuthModal(true);
				return false;
			}
			if ((roomId && !webViewState.url.includes(roomId)) || webViewState.url.includes('close')) {
				if (isIOS) {
					if (webViewState.navigationType) {
						endCall();
						goBack();
					}
				} else {
					goBack();
				}
			}
			return true;
		},
		[goBack, url]
	);

	useEffect(() => {
		handleJitsiApp();
		onConferenceJoined();
		activateKeepAwake();

		return () => {
			logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
			if (!videoConf) endVideoConfTimer();
			deactivateKeepAwake();
		};
	}, [handleJitsiApp, onConferenceJoined, videoConf]);

	useEffect(() => {
		setCookies();
	}, []);

	const callUrl = `${url}${url.includes('#config') ? '&' : '#'}config.disableDeepLinking=true`;

	return (
		<SafeAreaView style={styles.container}>
			{authModal && <JitsiAuthModal setAuthModal={setAuthModal} callUrl={`${callUrl}?language=${i18n.locale}`} />}
			{cookiesSet ? (
				<WebView
					source={{
						uri: callUrl.replace(/"/g, "'"),
						headers: {
							Cookie: `rc_uid=${user.id}; rc_token=${user.token}`
						}
					}}
					onNavigationStateChange={onNavigationStateChange}
					onShouldStartLoadWithRequest={onNavigationStateChange}
					style={styles.webviewContainer}
					userAgent={userAgent}
					javaScriptEnabled
					domStorageEnabled
					allowsInlineMediaPlayback
					mediaCapturePermissionGrantType={'grant'}
					mediaPlaybackRequiresUserAction={isIOS}
					sharedCookiesEnabled
				/>
			) : (
				<View style={[styles.webviewContainer, styles.loading]}>
					<ActivityIndicator />
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	webviewContainer: { flex: 1, backgroundColor: '#d1fae5' },
	loading: { alignItems: 'center', justifyContent: 'center' }
});

export default JitsiMeetView;

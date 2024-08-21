import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { useKeepAwake } from 'expo-keep-awake';
import CookieManager from '@react-native-cookies/cookies';
import { WebViewNavigation } from 'react-native-webview';

import { useAppSelector } from '../../lib/hooks';
import { getRoomIdFromJitsiCallUrl } from '../../lib/methods/helpers/getRoomIdFromJitsiCall';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { endVideoConfTimer, initVideoConfTimer } from '../../lib/methods/videoConfTimer';
import { getUserSelector } from '../../selectors/login';
import { ChatsStackParamList } from '../../stacks/types';
import JitsiAuthModal from './JitsiAuthModal';

const JitsiMeetViewComponent = (): React.ReactElement => {
	useKeepAwake();
	const {
		params: { rid, url, videoConf }
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

	const onNavigationStateChange = useCallback(
		(webViewState: WebViewNavigation) => {
			const roomId = getRoomIdFromJitsiCallUrl(url);
			if (webViewState.url.includes('auth-static')) {
				setAuthModal(true);
				return false;
			}
			if ((roomId && !webViewState.url.includes(roomId)) || webViewState.url.includes('close')) {
				if (isIOS) {
					if (webViewState.navigationType) {
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

	const [isConnected, setIsConnected] = useState(false);

	const startCall = useCallback(() => {
		const roomId = getRoomIdFromJitsiCallUrl(url);

		if (!roomId) {
			return;
		}

		const userInfo = {
			displayName: user.username,
			email: user.email,
			avatar: user.avatar
		};

		const options = {
			room: roomId,
			serverUrl,
			userInfo
		};

		// JitsiMeetView(url, options);
		setIsConnected(true);
	}, [url, user, serverUrl]);

	const onConferenceJoined = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_JOIN : events.JM_CONFERENCE_JOIN);
		if (rid && !videoConf) {
			initVideoConfTimer(rid);
		}
	}, [rid, videoConf]);

	useEffect(() => {
		onConferenceJoined();
		startCall();

		return () => {
			logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
			if (!videoConf) endVideoConfTimer();
		};
	}, [startCall, onConferenceJoined, videoConf]);

	const jitsiMeeting = useRef(null);

	const onReadyToClose = useCallback(() => {
		// @ts-ignore

		// @ts-ignore
		jitsiMeeting.current.close();
	}, []);

	const onEndpointMessageReceived = useCallback(() => {
		console.log('You got a message!');
	}, []);

	const eventListeners = {
		onReadyToClose,
		onEndpointMessageReceived
	};

	return (
		<SafeAreaView style={styles.container}>
			<JitsiMeeting
				config={{
					hideConferenceTimer: true,
					customToolbarButtons: [
						{
							icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
							id: 'btn1',
							text: 'Button one'
						},
						{
							icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
							id: 'btn2',
							text: 'Button two'
						}
					]
				}}
				eventListeners={eventListeners as any}
				flags={{
					'invite.enabled': true,
					'ios.screensharing.enabled': true
				}}
				ref={jitsiMeeting}
				style={{ flex: 1 }}
				room={'room'}
				serverURL={'https://meet.jit.si/'}
			/>
			{!isConnected && (
				<View style={[styles.jitsiMeetView, styles.loading]}>
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
	jitsiMeetView: {
		flex: 1,
		backgroundColor: '#d1fae5'
	},
	loading: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default JitsiMeetViewComponent;

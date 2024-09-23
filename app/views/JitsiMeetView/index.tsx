import CookieManager from '@react-native-cookies/cookies';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import axios from 'axios';
import EventSource from 'react-native-sse';
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
import { DASHBOARD_URL } from '../LoginView/UserForm';
import database from '../../lib/database';
import { Q } from '@nozbe/watermelondb';

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
		console.log('ConferenceJoined');
		if (rid && !videoConf) {
			initVideoConfTimer(rid);
		}
	}, [rid, videoConf]);

	const onConferenceLeft = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
		console.log('ConferenceLeft', events);
		// if (rid && !videoConf) {
		// 	initVideoConfTimer(rid);
		// }
		// goBack();
	}, [videoConf]);

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
						// goBack();
						endCall();
					}
				} else {
					endCall();
					// goBack();
				}
			}
			return true;
		},
		[goBack, url]
	);

	const endCall = async () => {
		await axios.get(`${DASHBOARD_URL}/api/endcall?callId=${callId}`);

		db.get('messages')
			.query(Q.where('blocks', Q.like(`%\"callId\":\"${callId}\"%`)))
			.observe()
			.subscribe(async videoConferences => {
				// Assuming there's an item with id=1 or modify logic as needed
				if (videoConferences.length > 0) {
					const specificItem = videoConferences[0];
					await db.write(async () => {
						await specificItem.update(message => {
							message._raw._status = 'updated'; // Modify as needed
						});
					});
					// console.log('Specific item', specificItem._raw.blocks);
					// console.log('Specific item1', specificItem._raw._status === "updated");
				}
			});

		goBack();
	};

	useEffect(() => {
		handleJitsiApp();
		onConferenceJoined();
		onConferenceLeft();
		activateKeepAwake();
		// endCall();

		return () => {
			logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
			console.log('events::kd: ', events);
			if (!videoConf) {
				endVideoConfTimer();
			}
			deactivateKeepAwake();
		};
	}, [handleJitsiApp, onConferenceJoined, onConferenceLeft, videoConf]);

	useEffect(() => {
		setCookies();
	}, []);

	// useEffect(() => {
	// 	endCall();
	// }, [endCall]);

	const callUrl = `${url}${url.includes('#config') ? '&' : '#'}config.disableDeepLinking=true`;

	console.log('callurllllllllll:::', callUrl);

	const handleConferenceLeft = (event: any) => {
		// Handle the logic when the conference is left
		console.log('Conference left:', event.nativeEvent.data);
		// You can navigate to a different screen or perform any action here
	};

	const [callEnded, setCallEnded] = useState(false);
	// const endCall = useCallback(() => {
	// 	const db = database.active;
	// 	const subscription = db
	// 		.get('rocketchat_video_conference') // 'rocketchat_video_conference' is the table name
	// 		.query(Q.where('_id', callId))
	// 		.observe()
	// 		.subscribe(videoConferences => {
	// 			// Assuming there's an item with id=1 or modify logic as needed
	// 			const specificItem = videoConferences.find(item => item.id === '1');
	// 			if (specificItem) {
	// 				console.log('specificItem: ', specificItem);
	// 			}
	// 		});
	// 	// subscription();

	// 	// Clean up subscription when component unmounts
	// 	return () => subscription.unsubscribe();
	// }, [callId]);

	// const getActiveConferences = useCallback(async () => {
	const db = database.active;
	// const activeConferences =

	// db.get('messages')
	// 	.query(Q.where('blocks', Q.like(`%\"callId\":\"${'66ec1e5a01ec06f348d29901'}\"%`)))
	// 	.observe()
	// 	.subscribe(videoConferences => {
	// 		// Assuming there's an item with id=1 or modify logic as needed
	// 		if (videoConferences.length > 0) {
	// 			const specificItem = videoConferences[0];
	// 			console.log('Specific item', callId); // 66ec1e5a01ec06f348d29901;
	// 			console.log('Specific item1', specificItem._raw);
	// 		}
	// 	});

	// .query(Q.where('_id', '66ea9eb101ec06f348d2959b'))
	// .fetch();

	// console.log('activeConferences1', activeConferences?._j?.[activeConferences?._j?.length - 1]);
	// }, []);

	// useEffect(() => {
	// 	getActiveConferences();
	// 	// const db = database.active;
	// 	// const subscription = db
	// 	// 	.get('rocketchat_video_conference') // 'rocketchat_video_conference' is the table name
	// 	// 	.query(Q.where('_id', callId))
	// 	// 	.observe()
	// 	// 	.subscribe(changes => console.log('Changes: ', changes));
	// 	// return () => subscription?.unsubscribe();
	// }, [getActiveConferences]);

	useEffect(() => {
		// Create a function to perform the query
		const intervalId = setInterval(() => {
			db.get('messages')
				.query(Q.where('blocks', Q.like(`%\"callId\":\"${callId}\"%`)))
				.observe()
				.subscribe(videoConferences => {
					// Assuming there's an item with id=1 or modify logic as needed
					if (videoConferences.length > 0) {
						const specificItem = videoConferences[0];
						console.log('Specific item', callId); // 66ec1e5a01ec06f348d29901;
						console.log('Specific item1', specificItem._raw);
						if (specificItem._raw._status === 'updated') goBack();
					}
				});
		}, 500);

		return () => clearInterval(intervalId);

		// Run the function every 0.5 seconds
		// 	const intervalId = setInterval(() => {
		// 		checkVideoConferences();
		// 	}, 500);

		// 	// Cleanup the interval when the component unmounts
		// 	return () => clearInterval(intervalId);
	}, []);
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
					style={{ flex: 1 }}
					javaScriptEnabled
					domStorageEnabled
					allowsInlineMediaPlayback
					mediaCapturePermissionGrantType={'grant'}
					mediaPlaybackRequiresUserAction={false}
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

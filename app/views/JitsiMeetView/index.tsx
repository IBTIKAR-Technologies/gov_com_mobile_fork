import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { JitsiMeeting, JitsiRefProps } from '@jitsi/react-native-sdk';
import { useKeepAwake } from 'expo-keep-awake';
import CookieManager from '@react-native-cookies/cookies';
import { WebViewNavigation } from 'react-native-webview';

import { DASHBOARD_URL } from '../LoginView/UserForm';
import { useAppSelector } from '../../lib/hooks';
import { getRoomIdFromJitsiCallUrl } from '../../lib/methods/helpers/getRoomIdFromJitsiCall';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { endVideoConfTimer, initVideoConfTimer } from '../../lib/methods/videoConfTimer';
import { getUserSelector } from '../../selectors/login';
import { ChatsStackParamList } from '../../stacks/types';
import JitsiAuthModal from './JitsiAuthModal';
import i18n from '../../i18n';
import axios from 'axios';
import { TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from 'react-native-vector-icons';
import CallScreen from './CallScreen';

const JitsiMeetViewComponent = (): React.ReactElement => {
	// useKeepAwake();
	const {
		params: { rid, url, videoConf, callId }
	} = useRoute<RouteProp<ChatsStackParamList, 'JitsiMeetView'>>();
	const { goBack } = useNavigation();
	const user = useAppSelector(state => getUserSelector(state));
	const serverUrl = useAppSelector(state => state.server.server);

	const [authModal, setAuthModal] = useState(false);
	const [cookiesSet, setCookiesSet] = useState(false);
	const [call, setCall] = useState(true);

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

	const onConferenceJoined = async () => {
		try {
			await axios.get(`${DASHBOARD_URL}/api/endcall?callId=${callId}&username=${user.username}`);
			console.log('Call joined successfully');
			goBack();
		} catch (error) {
			console.error('Error joining the call:', error);
		}
	};

	// useEffect(() => {
	// 	// onConferenceJoined();
	// 	startCall();

	// 	return () => {
	// 		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
	// 		if (!videoConf) endVideoConfTimer();
	// 	};
	// }, [startCall, videoConf]);

	const jitsiMeeting = useRef<JitsiRefProps>(null);

	const onReadyToClose = () => {
		// @ts-ignore
		console.log('Ready to close');
		// navigation.navigate("Home");
		// @ts-ignore
		jitsiMeeting.current.close();
	};

	const onEndpointMessageReceived = useCallback(() => {
		console.log('You got a message!');
	}, []);

	const eventListeners = {
		onReadyToClose,
		onEndpointMessageReceived
	};

	const endCall = async () => {
		try {
			// onReadyToClose();
			jitsiMeeting.current?.close(callId);
			console.log('Call ended successfully');
			await axios.get(`${DASHBOARD_URL}/api/endcall?callId=${callId}`);
			console.log('Call ended successfully');
			// setCall(false);
			goBack();
		} catch (error) {
			console.error('Error ending the call:', error);
		}
	};

	const callUrl = `${url}${url.includes('#config') ? '&' : '#'}config.disableDeepLinking=true`;

	// useEffect(() => {
	// 	// Set the audio output to the earpiece (speaker off)
	// 	if (jitsiMeeting.current) {
	// 		jitsiMeeting.current?.setAudioOnly(true);
	// 	}
	// }, []);

	return (
		<SafeAreaView style={styles.container}>
			{jitsiMeeting.current ? (
				<CallScreen
					rid={rid}
					callId={callId}
					setMic={jitsiMeeting?.current?.setAudio as any}
					mic={'EARPIECE'}
					audio={false}
					setAudio={jitsiMeeting?.current?.setAudioMuted as any}
					avatar={''}
					endCall={endCall}
				/>
			) : (
				<Text>Loading...</Text>
			)}
			{/* {call && ( */}
			<View style={{ display: 'none' }}>
				<JitsiMeeting
					userInfo={{
						displayName: user.username,
						email: user?.emails?.[0]?.address as string,
						avatarURL: user.avatarOrigin as string
					}}
					config={{
						// hideConferenceTimer: false,
						startAudioOnly: true,
						// 'p2p.enabled': true,
						'prejoinConfig.enabled': false
					}}
					eventListeners={{
						onConferenceBlurred: () => console.log('Conference blured'),
						onConferenceFocused: () => console.log('Conference focused'),
						onConferenceLeft: () => {
							console.log('Conference left');
							// endCall();
						},
						onReadyToClose,
						onConferenceJoined: () => {
							console.log('Conference join');
						},
						onConferenceWillJoin: () => console.log('Conference will join'),
						onParticipantJoined: () => console.log('Participant joined'),
						onParticipantLeft: participant => {
							console.log('Participant left');
							// endCall();
						}
					}}
					flags={{
						'invite.enabled': false,
						// 'ios.screensharing.enabled': true,
						'audio-only.enabled': true,
						'breakout-rooms.enabled': true,
						'speakerstats.enabled': false,
						'fullscreen.enabled': false,
						'chat.enabled': false,
						'meeting-name.enabled': false,
						'video-mute.enabled': false,
						'video-share.enabled': false,
						'android.screensharing.enabled': false,
						'ios.screensharing.enabled': false,
						'add-people.enabled': false,
						'calendar.enabled': false,
						'close-captions.enabled': false,
						'filmstrip.enabled': false,
						'overflow-menu.enabled': false,
						'security-options.enabled': false,
						'settings.enabled': false
					}}
					ref={jitsiMeeting}
					style={{ flex: 1 }}
					room={getRoomIdFromJitsiCallUrl(url) as string}
					serverURL={`${callUrl}?language=${i18n.locale}`}
				/>
				<Button title='Disconnect' onPress={endCall} />
			</View>
			{/* )} */}
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

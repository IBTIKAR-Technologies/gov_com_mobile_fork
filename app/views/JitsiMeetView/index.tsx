import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import JitsiMeet, { JitsiMeeting as JitsiMeetView } from '@jitsi/react-native-sdk';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppSelector } from '../../lib/hooks';
import { getRoomIdFromJitsiCallUrl } from '../../lib/methods/helpers/getRoomIdFromJitsiCall';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { endVideoConfTimer, initVideoConfTimer } from '../../lib/methods/videoConfTimer';
import { getUserSelector } from '../../selectors/login';
import { ChatsStackParamList } from '../../stacks/types';
import JitsiAuthModal from './JitsiAuthModal';

const JitsiMeetViewComponent = (): React.ReactElement => {
	const {
		params: { rid, url, videoConf }
	} = useRoute<RouteProp<ChatsStackParamList, 'JitsiMeetView'>>();
	const { goBack } = useNavigation();
	const user = useAppSelector(state => getUserSelector(state));
	const serverUrl = useAppSelector(state => state.server.server);

	const [authModal, setAuthModal] = useState(false);
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
			serverUrl: serverUrl,
			userInfo: userInfo
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

	const onConferenceTerminated = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
		if (!videoConf) endVideoConfTimer();
		deactivateKeepAwake();
		goBack();
	}, [goBack, videoConf]);

	useEffect(() => {
		activateKeepAwake();
		startCall();

		const handleOrientationChange = () => {
			// Handle orientation change if needed
		};

		const dimensionListener = Dimensions.addEventListener('change', handleOrientationChange);

		return () => {
			if (isConnected) {
				// JitsiMeetView.endCall();
			}
			if (dimensionListener) {
				dimensionListener.remove();
			}
		};
	}, [startCall, isConnected]);

	return (
		<SafeAreaView style={styles.container}>
			{authModal ? (
				<JitsiAuthModal setAuthModal={setAuthModal} callUrl={url} />
			) : (
				<JitsiMeetView
					config={{}}
					room='TEst'
					onConferenceJoined={onConferenceJoined}
					onConferenceTerminated={onConferenceTerminated}
					style={styles.jitsiMeetView}
				/>
			)}
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

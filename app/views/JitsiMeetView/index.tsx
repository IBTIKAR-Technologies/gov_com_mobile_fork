import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, SafeAreaView, StyleSheet, View } from 'react-native';
import { JitsiMeeting, JitsiRefProps } from '@jitsi/react-native-sdk';

import i18n from '../../i18n';
import { useAppSelector } from '../../lib/hooks';
import { isIOS } from '../../lib/methods/helpers';
import { getRoomIdFromJitsiCallUrl } from '../../lib/methods/helpers/getRoomIdFromJitsiCall';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { endVideoConfTimer, initVideoConfTimer } from '../../lib/methods/videoConfTimer';
import { getUserSelector } from '../../selectors/login';
import { ChatsStackParamList } from '../../stacks/types';
import JitsiAuthModal from './JitsiAuthModal';

const JitsiMeetViewScreen = (): React.ReactElement => {
	const {
		params: { rid, url, videoConf }
	} = useRoute<RouteProp<ChatsStackParamList, 'JitsiMeeting'>>();
	const { goBack } = useNavigation();
	const user = useAppSelector(state => getUserSelector(state));
	const serverUrl = useAppSelector(state => state.server.server);

	const [authModal, setAuthModal] = useState(false);
	const [loading, setLoading] = useState(true);

	const onConferenceJoined = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_JOIN : events.JM_CONFERENCE_JOIN);
		if (rid && !videoConf) {
			initVideoConfTimer(rid);
		}
	}, [rid, videoConf]);

	const onConferenceTerminated = useCallback(() => {
		logEvent(videoConf ? events.LIVECHAT_VIDEOCONF_TERMINATE : events.JM_CONFERENCE_TERMINATE);
		if (!videoConf) endVideoConfTimer();
		goBack();
	}, [goBack, videoConf]);

	const onConferenceWillJoin = useCallback(() => {
		setLoading(false);
	}, []);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => true);
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', () => true);
		};
	}, []);

	useEffect(() => {
		onConferenceJoined();
		return () => {
			onConferenceTerminated();
		};
	}, [onConferenceJoined, onConferenceTerminated]);

	const jitsiMeetProps: JitsiRefProps = {
		onConferenceJoined,
		onConferenceTerminated,
		onConferenceWillJoin,
		style: styles.jitsiMeet,
		// Customize JitsiMeet with options like room, token, etc.
		room: getRoomIdFromJitsiCallUrl(url),
		userInfo: {
			displayName: user.name,
			email: user.email,
			avatar: user.avatar
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{authModal && <JitsiAuthModal setAuthModal={setAuthModal} callUrl={`${url}?language=${i18n.locale}`} />}
			{loading ? (
				<View style={[styles.jitsiMeet, styles.loading]}>
					<ActivityIndicator />
				</View>
			) : (
				<JitsiMeeting {...jitsiMeetProps} />
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	jitsiMeet: {
		flex: 1,
		backgroundColor: '#d1fae5'
	},
	loading: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default JitsiMeetViewScreen;

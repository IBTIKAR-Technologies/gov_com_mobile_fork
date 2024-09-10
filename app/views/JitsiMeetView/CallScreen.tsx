import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNCallKeep from 'react-native-callkeep';

import { useAppSelector } from '../../lib/hooks';
import { CustomIcon } from '../../containers/CustomIcon';
import { colors } from '../../lib/constants';
import useUserData from '../../lib/hooks/useUserData';
import FastImage from 'react-native-fast-image';

const devices = [
	{
		earpiece: 'EARPIECE',
		speaker: 'SPEAKER'
	}
];

const CallScreen = ({
	callId,
	setMic,
	mic,
	audio,
	setAudio,
	avatar,
	rid,
	endCall
}: {
	callId: string;
	setMic: (p: 'SPEAKER' | 'EARPIECE') => void;
	mic: 'SPEAKER' | 'EARPIECE';
	audio: boolean;
	setAudio: (p: boolean) => void;
	avatar: string;
	rid: string;
	endCall: () => void;
}) => {
	const calling = useAppSelector(state => state.videoConf.calling);
	const [device, setDevice] = useState<'SPEAKER' | 'EARPIECE'>(mic as 'EARPIECE');
	const [muted, setMuted] = useState(false);

	const handleSelectDevice = () => {
		if (setMic) {
			console.log('setMic: ', setMic);
			const d = device === 'SPEAKER' ? 'EARPIECE' : 'SPEAKER';
			setDevice(d);
			setMic(d);
		}
	};
	const handletAudioMuted = () => {
		if (setAudio) {
			const d = !muted;
			setMuted(d);
			setAudio(d);
		}
	};

	const user = useUserData(rid);

	console.log('User: ', user);

	// const endCall = () => {
	// 	if (callId) {
	// 		RNCallKeep.endCall(callId);
	// 		console.log(`Call with UUID ${callId} has ended`);
	// 	} else {
	// 		console.log('No active call to end');
	// 	}
	// };

	return (
		<View style={styles.container}>
			<View style={styles.callerNameContainer}>
				<Text style={styles.callerName}>{user.username}</Text>
			</View>
			<View style={styles.body}>
				<View style={styles.buttonContainer}>
					<View style={{ height: '75%' }}>
						<View
							style={{
								width: 200,
								height: 200,
								backgroundColor: 'white',
								borderRadius: 600,
								marginBottom: 70
							}}>
							<FastImage source={''} />
						</View>
					</View>
					<View style={styles.footer}>
						<TouchableRipple
							style={{
								backgroundColor: muted ? 'white' : 'black',
								padding: 10,
								height: 65,
								width: 65,
								borderRadius: 40,
								justifyContent: 'center',
								alignItems: 'center',
								borderColor: 'white',
								borderWidth: 1
							}}
							onPress={handletAudioMuted}>
							<CustomIcon name={muted ? 'microphone-disabled' : 'microphone'} size={30} color={muted ? 'black' : 'white'} />
						</TouchableRipple>
						<TouchableRipple
							onPress={handleSelectDevice}
							style={{
								backgroundColor: device === 'EARPIECE' ? 'black' : 'white',
								padding: 10,
								height: 65,
								width: 65,
								borderRadius: 40,
								justifyContent: 'center',
								alignItems: 'center',
								borderColor: 'white',
								borderWidth: 1
							}}>
							<CustomIcon name={'audio'} size={30} color={device === 'EARPIECE' ? 'white' : 'black'} />
						</TouchableRipple>
					</View>
					<TouchableOpacity onPress={endCall} style={styles.declineButton}>
						<CustomIcon name='phone' size={30} color='#fff' />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#166534'
	},
	callerNameContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '13%'
	},
	callerName: {
		fontSize: 24,
		marginBottom: 20,
		color: '#fff'
	},
	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '90%',
		backgroundColor: 'black',
		padding: 20,
		marginBottom: 5
	},
	body: {
		height: '81%',
		width: '100%',
		backgroundColor: 'black',
		justifyContent: 'flex-end'
	},
	declineButton: {
		backgroundColor: 'red',
		borderRadius: 50,
		width: 70,
		height: 70,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	footer: {
		width: '100%',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 10,
		flex: 1,
		flexDirection: 'row',
		gap: 1,
		marginBottom: 20
	}
});

export default CallScreen;

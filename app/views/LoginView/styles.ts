import { Dimensions, StyleSheet } from 'react-native';

import sharedStyles from '../Styles';

export default StyleSheet.create({
	registerDisabled: {
		...sharedStyles.textRegular,
		...sharedStyles.textAlignCenter,
		fontSize: 16
	},
	title: {
		color: '#005D0D',
		fontWeight: '800',
		fontSize: 36,
		lineHeight: 40,
		textAlign: 'center'
	},
	countdown: {
		fontSize: 20,
		alignSelf: 'center',
		color: '#005D0D',
		textAlign: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		marginTop: 15
	},
	resendLink: {
		fontSize: 14,
		color: '#696969',
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 15
	},
	description: {
		color: '#000000',
		fontSize: 14,
		fontWeight: '300',
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 15,
		paddingHorizontal: 15
	},
	description2: {
		color: '#000000',
		fontSize: 14,
		fontWeight: '300',
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 18,
		paddingHorizontal: 15
	},
	inputContainer: {
		marginVertical: 16
	},
	bottomContainer: {
		flexDirection: 'column',
		alignItems: 'center'
	},
	bottomContainerText: {
		...sharedStyles.textRegular,
		fontSize: 13
	},
	bottomContainerTextBold: {
		...sharedStyles.textSemibold,
		fontSize: 13
	},
	loginButton: {
		marginTop: 16,
		borderRadius: 10
	},
	ugcContainer: {
		marginTop: 32
	},
	onboardingImage: {
		marginBottom: 35,
		marginTop: 35,
		width: 193,
		height: 239,
		alignSelf: 'center',
		resizeMode: 'cover'
	},
	container: {
		backgroundColor: '#005D0D',
		flex: 1,
		marginHorizontal: 0
	},
	contentBox: {
		height: '98%',
		backgroundColor: '#ffffff',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		padding: 25,
		width: Dimensions.get('screen').width
	}
});

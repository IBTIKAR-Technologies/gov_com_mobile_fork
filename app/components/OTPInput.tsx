import React, { useRef } from 'react';
import { I18nManager, View, StyleSheet } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { Controller } from 'react-hook-form';

const OTPInput = ({ name, control }: { name: string; control: any }): React.ReactElement => (
	<Controller
		name={name}
		defaultValue=''
		control={control}
		render={({ field: { onChange, value } }) => (
			<View style={styles.container}>
				<OtpInputs
					inputContainerStyles={styles.inputContainer}
					style={styles.inputs}
					inputStyles={styles.input}
					numberOfInputs={6}
					handleChange={code => {
						onChange(code);
					}}
					autofillFromClipboard={true}
				/>
			</View>
		)}
	/>
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	inputContainer: {
		borderColor: '#C5C5C5',
		borderWidth: 1,
		borderRadius: 10,
		width: 50,
		height: 70,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5F5F5'
	},
	inputs: {
		flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
	},
	input: {
		color: '#000',
		textAlign: 'center'
	}
});

export default OTPInput;

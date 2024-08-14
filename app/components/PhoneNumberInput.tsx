import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, View, Text, StyleSheet, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import { getAllCountries } from '../lib/constants/getAllCountries';

const PhoneNumberInput = ({ methods, name, placeholder, returnKeyType, initialValue }) => {
	const initialCountry = useMemo(() => getAllCountries().find(c => c.code === 'MR'), [initialValue]);
	const country = useMemo(() => initialCountry, [initialCountry]);

	return (
		<Controller
			control={methods.control}
			name={name}
			render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
				<View style={{ width: '100%', marginTop: 10, marginBottom: 22 }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 7
						}}
					>
						<View style={styles.view3}>
							<Text style={styles.text1}>{country?.dialCode} </Text>
						</View>
						<TextInput
							onBlur={onBlur}
							value={value}
							onChangeText={onChange}
							style={[styles.inputContainer, { borderBottomColor: error ? 'red' : '#ccc' }]}
							keyboardType='phone-pad'
							placeholder={placeholder}
							ref={ref}
							returnKeyType={returnKeyType}
						/>
					</View>
				</View>
			)}
		/>
	);
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
	text1: {
		fontSize: 16,
		color: '#0d0e12'
	},
	view3: {
		minWidth: 50,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		height: 40
	},
	inputContainer: {
		borderBottomWidth: 1,
		paddingBottom: 5,
		height: 40,
		justifyContent: 'center',
		marginLeft: 20,
		flex: 1,
		fontSize: 15
	}
});

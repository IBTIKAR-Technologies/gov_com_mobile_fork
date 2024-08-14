import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
	Keyboard,
	Text,
	View,
	Alert,
	Image,
	StatusBar,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Dimensions
} from 'react-native';
import { useDispatch } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import axios from 'axios';

import { loginRequest } from '../../actions/login';
import Button from '../../containers/Button';
import I18n from '../../i18n';
import { OutsideParamList } from '../../stacks/types';
import sharedStyles from '../Styles';
import { useAppSelector } from '../../lib/hooks';
import styles from './styles';
import { handleLoginErrors } from './handleLoginErrors';
import OTPInput from '../../components/OTPInput';
import PhoneNumberInput from '../../components/PhoneNumberInput';

export const DASHBOARD_URL = 'https://com-cov-dashboard.vercel.app';

interface ISubmit {
	phone: string;
	otp: string;
}
const schema = yup.object().shape({
	phone: yup
		.string()
		.required()
		.test('phone', value => {
			const phoneNumber = parsePhoneNumberFromString(value, 'MR');
			return phoneNumber && phoneNumber.isValid();
		})
});

const UserForm = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation<StackNavigationProp<OutsideParamList, 'LoginView'>>();
	const [otpSent, setOtpSent] = useState(false);
	const [verifToken, setVerifToken] = useState('');
	const [otpExpiresIn, setOtpExpiresIn] = useState(300);
	const [otpExpired, setOtpExpired] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [isOtpComplete, setOtpComplete] = useState(false);
	const [imageMarginTop, setImageMarginTop] = useState(35);
	const [imageMarginBottom, setImageMarginBottom] = useState(35);
	const [imageWidth, setImageWidth] = useState(193);
	const [imageHeight, setImageHeight] = useState(239);
	const [otp, setOtp] = useState('');

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false
		});
	}, [navigation]);
	const handleSendOtp = async data => {
		console.log('Sss', data.phone);
		setPhoneNumber(data.phone);
		setIsLoading(true);

		try {
			const response = await axios.post(`${DASHBOARD_URL}/api/sendotp`, {
				...data,
				phone: `${data.phone}`,
				lang: I18n.locale
			});
			setVerifToken(response.data.verifToken);
			setTimeout(() => {
				setOtpSent(true);
			}, 500);
		} catch (error) {
			console.log('jjj', error);
			Alert.alert(I18n.t('Oops'), I18n.t('Login_error'));
		}
		setIsLoading(false);
	};

	const {
		params: { username }
	} = useRoute<RouteProp<OutsideParamList, 'LoginView'>>();

	const methods = useForm<ISubmit>({
		mode: 'onChange',
		resolver: yupResolver(schema),
		defaultValues: { user: username || '' }
	});

	const {
		control,
		handleSubmit,
		formState: { isValid },
		getValues
	} = methods;

	const { isFetching, error, failure } = useAppSelector(state => ({
		Accounts_RegistrationForm: state.settings.Accounts_RegistrationForm as string,
		Accounts_RegistrationForm_LinkReplacementText: state.settings.Accounts_RegistrationForm_LinkReplacementText as string,
		isFetching: state.login.isFetching,
		Accounts_EmailOrUsernamePlaceholder: state.settings.Accounts_EmailOrUsernamePlaceholder as string,
		Accounts_PasswordPlaceholder: state.settings.Accounts_PasswordPlaceholder as string,
		Accounts_PasswordReset: state.settings.Accounts_PasswordReset as boolean,
		Site_Name: state.settings.Site_Name as string,
		inviteLinkToken: state.inviteLinks.token,
		failure: state.login.failure,
		error: state.login.error && state.login.error.data
	}));

	console.log('errorerror', error);

	useEffect(() => {
		if (failure) {
			if (error?.error === 'error-invalid-email') {
				const user = getValues('user');
				navigation.navigate('SendEmailConfirmationView', { user });
			} else {
				Alert.alert(I18n.t('Oops'), handleLoginErrors(error?.error));
			}
		}
	}, [error?.error, failure, getValues, navigation]);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setImageMarginTop(0);
			setImageMarginBottom(10);
			setImageHeight(200);
			setImageWidth(154);
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setImageMarginTop(35);
			setImageMarginBottom(35);
			setImageHeight(239);
			setImageWidth(193);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const submit = ({ phone, otp }: ISubmit) => {
		if (!isValid) {
			return;
		}

		if (!otpSent) {
			handleSendOtp({ phone });
			return;
		}
		Keyboard.dismiss();
		dispatch(
			loginRequest({
				phone,
				otp,
				verifToken
			})
		);
	};

	useEffect(() => {
		let timer: any;
		if (otpSent && !otpExpired) {
			timer = setInterval(() => {
				setOtpExpiresIn(prev => {
					if (prev <= 1) {
						clearInterval(timer);
						setOtpExpired(true);
						return 0;
					}

					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [otpSent, otpExpired]);

	const resendOtp = async () => {
		try {
			const response = await axios.post(`${DASHBOARD_URL}/api/sendotp`, {
				phone: phoneNumber,
				lang: I18n.locale
			});
			setVerifToken(response.data.verifToken);
			setOtpExpiresIn(300);
			setOtpExpired(false);
		} catch (error) {
			console.log('opoo', error);
		}
	};
	const formatTime = seconds => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	useEffect(() => {
		if (isOtpComplete) {
			Keyboard.dismiss();
		}
	}, [isOtpComplete]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{
				flex: 1,
				backgroundColor: 'transparent',
				maxWidth: Dimensions.get('screen').width,
				maxHeight: Dimensions.get('screen').height
			}}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
		>
			<View style={styles.container}>
				<StatusBar backgroundColor='#005D0D' barStyle='light-content' />

				<View style={styles.contentBox}>
					{otpSent ? (
						<>
							<Image
								style={[
									{
										marginBottom: imageMarginBottom,
										marginTop: imageMarginTop,
										width: imageWidth,
										height: imageHeight,
										alignSelf: 'center',
										resizeMode: 'cover'
									}
								]}
								source={require('../../static/images/illustrationOtp.png')}
								fadeDuration={0}
							/>

							{otpExpired ? (
								<>
									<Text style={[styles.title, sharedStyles.textBold]}>OTP Expired</Text>
									<Text style={[styles.description2]}>Please click on resend OTP to receive a new one</Text>
									<TouchableOpacity onPress={resendOtp}>
										<Text
											style={[
												styles.resendLink,
												{ fontSize: 18, color: '#005D0D', marginTop: 20, borderBottomColor: '#005D0D', borderBottomWidth: 1 }
											]}
										>
											Resend OTP
										</Text>
									</TouchableOpacity>
								</>
							) : (
								<>
									<Text
										style={[
											styles.title,
											sharedStyles.textBold,
											{
												textAlign: 'center'
											}
										]}
									>
										{I18n.t('otp_code')}
									</Text>
									<Text style={[styles.description2]}>
										{I18n.t('entre_otp', {
											phone: methods.getValues('phone')
										})}
									</Text>
									<Text style={[styles.countdown]}> {formatTime(otpExpiresIn)}</Text>
									<OTPInput name='otp' control={control} />
									<Button
										title={I18n.t('Verify')}
										onPress={handleSubmit(submit)}
										testID='login-view-submit'
										disabled={!isValid || !methods.getValues('otp')}
										loading={isFetching || isLoading}
										style={styles.loginButton}
									/>

									<TouchableOpacity onPress={resendOtp}>
										<Text style={[styles.resendLink]}>{I18n.t('resend_code')}</Text>
									</TouchableOpacity>
								</>
							)}
						</>
					) : (
						<>
							<Image
								style={[
									{
										marginBottom: imageMarginBottom,
										marginTop: imageMarginTop,
										width: 193,
										height: 239,
										alignSelf: 'center',
										resizeMode: 'cover'
									}
								]}
								source={require('../../static/images/illustrationLogin.png')}
								fadeDuration={0}
							/>
							<Text style={[styles.title, sharedStyles.textBold, { textAlign: 'center' }]}>{I18n.t('login')}</Text>
							<Text style={[styles.description]}>{I18n.t('phone_desc')}</Text>
							<PhoneNumberInput
								methods={methods}
								name='phone'
								placeholder='Enter your phone number'
								returnKeyType={undefined}
								initialValue={undefined}
							/>

							<Button
								title={I18n.t('Next')}
								onPress={handleSubmit(submit)}
								testID='login-view-submit'
								disabled={!isValid || (otpSent && !methods.getValues('otp'))}
								loading={isFetching || isLoading}
								style={styles.loginButton}
							/>
						</>
					)}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default UserForm;

import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RNRestart from 'react-native-restart';
import RNPickerSelect from 'react-native-picker-select';

import { isIOS } from '../lib/methods/helpers';
import { RootEnum } from '../definitions';
import I18n, { LANGUAGES, isRTL, setLanguage } from '../i18n';
import { useAppSelector } from '../lib/hooks';
import { getUserSelector } from '../selectors/login';
import { appStart } from '../actions/app';
import { useTheme } from '../theme';
import { themes } from '../lib/constants';
import sharedStyles from '../views/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const styles = StyleSheet.create({
	iosPadding: {
		height: 48,
		justifyContent: 'center'
	},
	viewContainer: {
		marginBottom: 16,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderRadius: 4,
		justifyContent: 'center'
	},
	pickerText: {
		...sharedStyles.textRegular,
		fontSize: 16
	}
});

const LanguageSelect = ({
	outside
}: {
	outside: boolean
}) => {
	const { languageDefault } = useAppSelector(state => ({
		languageDefault: getUserSelector(state).language,
		id: getUserSelector(state).id
	}));
	const { theme } = useTheme();
	const pickerStyle = {
		...styles.viewContainer,
		...(isIOS ? styles.iosPadding : {}),
		// borderColor: themes[theme].separatorColor,
		// backgroundColor: themes[theme].backgroundColor, 
		borderColor: themes[theme].tintColor, 
        borderWidth: 1, 
        borderRadius: 6,
        backgroundColor: themes[theme].backgroundColor,
	};
	
	const dispatch = useDispatch();

	const submit = async (language: string) => {
		if (I18n.locale === language) {
			return;
		}
		

		const shouldRestart = isRTL(language) || isRTL(languageDefault);
		if(outside) {
			if (shouldRestart) {
				setLanguage(language);
				await AsyncStorage.setItem('selectedLanguage', language);
	
				await RNRestart.Restart();
			} else {
				setLanguage(language);
			}
			return
		}
		dispatch(appStart({ root: RootEnum.ROOT_LOADING, text: I18n.t('Change_language_loading') }));

		
		if (shouldRestart) {
			setLanguage(language);
			await AsyncStorage.setItem('selectedLanguage', language);

			await RNRestart.Restart();
		} else {
			dispatch(appStart({ root: RootEnum.ROOT_INSIDE }));
		}
	};

	console.log('LanguageSelect', LANGUAGES);
	console.log('I18n.locale', I18n.locale);

	return (
		<View>
			{/* <Text>Language</Text> */}
			<RNPickerSelect
				items={LANGUAGES.filter(item => item.label !== 'Sélectionnez une langue')}
				placeholder={{ label: 'Sélectionnez une langue', value: null }}
				useNativeAndroidPickerStyle={false}
				value={I18n.locale}
				onValueChange={value => {
					submit(value);
				}}
				style={{
					viewContainer: pickerStyle,
					inputAndroidContainer: pickerStyle
				}}
				textInputProps={{
					// style property was Omitted in lib, but can be used normally
					// @ts-ignore
					style: { 
                        ...styles.pickerText, 
                        color: themes[theme].tintColor,
                        fontWeight: 'bold', 
						
                    }
				}}
			/>
		</View>
	);
};

export default LanguageSelect;

import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';

import { themes } from '../lib/constants';
import sharedStyles from '../views/Styles';
import scrollPersistTaps from '../lib/methods/helpers/scrollPersistTaps';
import KeyboardView from './KeyboardView';
import { useTheme } from '../theme';
import StatusBar from './StatusBar';
import { isTablet } from '../lib/methods/helpers';
import SafeAreaView from './SafeAreaView';

interface IFormContainer extends ScrollViewProps {
	testID: string;
	children: React.ReactElement | React.ReactElement[] | null;
}

const styles = StyleSheet.create({
	scrollView: {
		minHeight: '100%'
	}
});

export const FormContainerInner = ({ children, style }: { style: any; children: (React.ReactElement | null)[] }) => (
	<View style={[sharedStyles.container, isTablet && sharedStyles.tabletScreenContent, style || {}]}>{children}</View>
);

const FormContainer = ({ children, testID, scrollViewStyle, transparent, ...props }: IFormContainer) => {
	const { theme } = useTheme();

	return (
		<KeyboardView
			style={{ backgroundColor: transparent ? 'transparent' : themes[theme].surfaceRoom }}
			contentContainerStyle={sharedStyles.container}
			keyboardVerticalOffset={128}
		>
			<StatusBar />
			<ScrollView
				style={[sharedStyles.container, transparent ? { backgroundColor: 'transparent}' } : {}]}
				contentContainerStyle={
					scrollViewStyle
						? [
								sharedStyles.containerScrollView,
								styles.scrollView,
								scrollViewStyle,
								transparent ? { backgroundColor: 'transparent' } : {}
						  ]
						: [sharedStyles.containerScrollView, styles.scrollView, transparent ? { backgroundColor: 'transparent}' } : {}]
				}
				{...scrollPersistTaps}
				{...props}
			>
				<SafeAreaView testID={testID} style={{ backgroundColor: transparent ? 'transparent' : themes[theme].surfaceRoom }}>
					{children}
					{/* <AppVersion theme={theme} /> */}
				</SafeAreaView>
			</ScrollView>
		</KeyboardView>
	);
};

export default FormContainer;

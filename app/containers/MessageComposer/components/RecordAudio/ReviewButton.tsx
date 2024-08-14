import { StyleSheet, View } from 'react-native';
import React, { ReactElement } from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';

import { useTheme } from '../../../../theme';
import { hitSlop } from '../Buttons';
import SendArrowIcon from '../../../../svgs/SendArrowIcon';

export const ReviewButton = ({ onPress }: { onPress: Function }): ReactElement => {
	const { colors } = useTheme();
	return (
		<BorderlessButton
			style={[
				styles.button,
				{
					backgroundColor: colors.buttonBackgroundPrimaryDefault
				}
			]}
			onPress={() => onPress()}
			hitSlop={hitSlop}
		>
			<View accessible accessibilityLabel={'Cancel_recording'} accessibilityRole='button'>
				<SendArrowIcon />
			</View>
		</BorderlessButton>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 32,
		height: 32,
		borderRadius: 16
	}
});

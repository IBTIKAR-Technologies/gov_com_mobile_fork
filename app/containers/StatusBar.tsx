import React from 'react';
import { StatusBar as StatusBarRN } from 'react-native';

import { useTheme } from '../theme';

const supportedStyles = {
	'light-content': 'light-content',
	'dark-content': 'dark-content'
};

interface IStatusBar {
	barStyle?: keyof typeof supportedStyles;
	backgroundColor?: string;
}

const StatusBar = ({ barStyle, backgroundColor }: IStatusBar) => {
	const { theme } = useTheme();
	if (!barStyle) {
		barStyle = 'light-content';
		if (theme === 'light') {
			barStyle = 'dark-content';
		}
	}
	return <StatusBarRN backgroundColor={backgroundColor ?? '#005D0D'} barStyle={barStyle} animated />;
};

export default StatusBar;

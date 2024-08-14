import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import sharedStyles from '../../views/Styles';
import { getUnreadStyle } from './getUnreadStyle';
import { useTheme } from '../../theme';

const styles = StyleSheet.create({
	unreadNumberContainerNormal: {
		height: 21,
		paddingVertical: 3,
		paddingHorizontal: 5,
		borderRadius: 10.5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10
	},
	unreadNumberContainerSmall: {
		borderRadius: 10.5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	unreadText: {
		fontSize: 13,
		...sharedStyles.textSemibold
	},
	textSmall: {
		fontSize: 10
	}
});

export interface IUnreadBadge {
	unread?: number;
	userMentions?: number;
	groupMentions?: number;
	style?: StyleProp<ViewStyle>;
	tunread?: any[];
	tunreadUser?: any[];
	tunreadGroup?: any[];
	small?: boolean;
	hideUnreadStatus?: boolean;
	hideMentionStatus?: boolean;
}

const UnreadBadge = React.memo(
	({
		alert,
		unread,
		userMentions,
		groupMentions,
		style,
		tunread,
		tunreadUser,
		tunreadGroup,
		small,
		hideMentionStatus,
		hideUnreadStatus
	}: IUnreadBadge) => {
		const { theme, colors } = useTheme();

		if ((!unread || unread <= 0) && !tunread?.length && !alert) {
			return null;
		}

		if (hideUnreadStatus && hideMentionStatus && !alert) {
			return null;
		}

		// Return null when hideUnreadStatus is true and isn't a direct mention
		if (hideUnreadStatus && !((userMentions && userMentions > 0) || tunreadUser?.length) && !alert) {
			return null;
		}

		const { backgroundColor, color } = getUnreadStyle({
			theme,
			unread,
			userMentions,
			groupMentions,
			tunread,
			tunreadUser,
			tunreadGroup
		});

		// if (!backgroundColor) {
		// 	return null;
		// }
		let text: any = unread || tunread?.length;
		if (small && text >= 100) {
			text = '+99';
		}
		if (!small && text >= 1000) {
			text = '+999';
		}
		text = text?.toString();

		let minWidth = 21;
		if (small) {
			minWidth = 11 + text.length * 5;
		}

		return (
			<View
				style={[
					small ? styles.unreadNumberContainerSmall : styles.unreadNumberContainerNormal,
					{ backgroundColor: colors.surfaceRoom, minWidth },
					style
				]}
			>
				<Text
					style={[styles.unreadText, small && styles.textSmall, { color: text === '0' ? colors.surfaceRoom : color }]}
					numberOfLines={1}
				>
					{text}
				</Text>
			</View>
		);
	}
);

export default UnreadBadge;

import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import i18n from '../../../../i18n';
import Lock from '../../../../svgs/Lock';

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
		position: 'absolute'
	}
});

export const EmptyRoom = React.memo(({ length, rid }: { length: number; rid: string }) => {
	if (length === 0 || !rid) {
		return (
			<>
				<ImageBackground source={require('../../../../static/images/message_empty_light.png')} style={styles.image} />
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<View
						style={{
							marginTop: 40,
							backgroundColor: '#dcfce7',
							paddingHorizontal: 20,
							paddingVertical: 10,
							borderRadius: 20,
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Lock fill='#dcfce7' stroke='#16a34a' />
						<Text
							style={{
								textAlign: 'center',
								paddingHorizontal: 5,
								color: '#16a34a'
							}}
						>
							{i18n.t('End_to_end')}
						</Text>
					</View>
				</View>
			</>
		);
	}
	return null;
});

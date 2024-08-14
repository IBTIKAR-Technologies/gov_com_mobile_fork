import React from 'react';

import * as HeaderButton from '../../../containers/HeaderButton';
import { useVideoConf } from '../../../lib/hooks/useVideoConf';

export default function HeaderCallButton({ rid }: { rid: string }): React.ReactElement | null {
	const { startCallImmediately, callEnabled, disabledTooltip } = useVideoConf(rid);

	if (callEnabled)
		return (
			<HeaderButton.Item
				disabled={disabledTooltip}
				iconName='phone'
				onPress={startCallImmediately}
				testID='room-view-header-call'
			/>
		);
	return null;
}

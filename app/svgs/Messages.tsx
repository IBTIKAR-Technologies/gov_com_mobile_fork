import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Messages(props) {
	return (
		<Svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			fill='none'
			stroke={props.color}
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-messages-square'
			{...props}
		>
			<Path d='M14 9a2 2 0 01-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 012 2zM18 9h2a2 2 0 012 2v11l-4-4h-6a2 2 0 01-2-2v-1' />
		</Svg>
	);
}

export default Messages;

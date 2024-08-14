import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function Lock(props) {
	return (
		<Svg
			xmlns='http://www.w3.org/2000/svg'
			width={20}
			height={20}
			viewBox='0 0 24 24'
			fill='white'
			stroke='#22c55e'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-lock'
			{...props}
		>
			<Rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
			<Path d='M7 11V7a5 5 0 0110 0v4' />
		</Svg>
	);
}

export default Lock;

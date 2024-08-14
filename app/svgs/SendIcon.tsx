import * as React from 'react';
import Svg, { G, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SendIcon(props) {
	return (
		<Svg width={50} height={50} viewBox='0 0 68 68' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
			<G filter='url(#filter0_d_84_1305)'>
				<Circle cx={34} cy={34} r={25} fill='url(#paint0_linear_84_1305)' />
			</G>
			<G filter='url(#filter1_d_84_1305)'>
				<Path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M25.291 25.309a.75.75 0 00-.976.996l3.093 6.945H35a.75.75 0 010 1.5h-7.592l-3.093 6.945a.75.75 0 00.976.996l19-8a.75.75 0 000-1.382l-19-8z'
					fill='#fff'
				/>
			</G>
			<Defs>
				<LinearGradient id='paint0_linear_84_1305' x1={34} y1={9} x2={34} y2={59} gradientUnits='userSpaceOnUse'>
					<Stop stopColor='#00C31B' />
					<Stop offset={1} stopColor='#005D0D' />
				</LinearGradient>
			</Defs>
		</Svg>
	);
}

export default SendIcon;

import * as React from 'react';
import Svg, { G, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function RecordIcon(props) {
	return (
		<Svg width={50} height={50} viewBox='0 0 68 68' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
			<G filter='url(#filter0_d_84_1214)'>
				<Circle cx={34} cy={34} r={25} fill='url(#paint0_linear_84_1214)' />
			</G>
			<G filter='url(#filter1_d_84_1214)'>
				<Path
					d='M33.737 36.263a3.302 3.302 0 01-3.305-3.316l-.011-6.631A3.311 3.311 0 0133.737 23a3.311 3.311 0 013.316 3.316v6.631a3.311 3.311 0 01-3.316 3.316zm-5.858-3.316c0 3.316 2.807 5.637 5.858 5.637 3.05 0 5.858-2.32 5.858-5.637h1.879c0 3.78-3.007 6.886-6.632 7.428V44h-2.21v-3.625C29.006 39.845 26 36.727 26 32.947h1.879z'
					fill='#fff'
				/>
			</G>
			<Defs>
				<LinearGradient id='paint0_linear_84_1214' x1={34} y1={9} x2={34} y2={59} gradientUnits='userSpaceOnUse'>
					<Stop offset={0.105} stopColor='#00C31B' />
					<Stop offset={1} stopColor='#005D0D' />
				</LinearGradient>
			</Defs>
		</Svg>
	);
}

export default RecordIcon;

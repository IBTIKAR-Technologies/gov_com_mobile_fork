import * as React from 'react';
import Svg, { G, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SendArrowIcon(props) {
	return (
		<Svg width={50} height={50} viewBox='0 0 68 68' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
			<G filter='url(#filter0_d_426_321)'>
				<Circle cx={34} cy={34} r={25} fill='url(#paint0_linear_426_321)' />
			</G>
			<G filter='url(#filter1_d_426_321)'>
				<Path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M39.523 35.666L30.304 45 28 42.667l8.066-8.167L28 26.333 30.304 24l9.219 9.334a1.66 1.66 0 010 2.332z'
					fill='#fff'
				/>
			</G>
			<Defs>
				<LinearGradient id='paint0_linear_426_321' x1={34} y1={9} x2={34} y2={59} gradientUnits='userSpaceOnUse'>
					<Stop offset={0.105} stopColor='#00C31B' />
					<Stop offset={1} stopColor='#005D0D' />
				</LinearGradient>
			</Defs>
		</Svg>
	);
}

export default SendArrowIcon;

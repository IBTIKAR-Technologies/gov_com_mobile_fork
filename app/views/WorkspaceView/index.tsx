import React, { useLayoutEffect, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ImageBackground, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/core';
import PagerView from 'react-native-pager-view';

import LanguageSelect from '../../components/LanguageSelect';
import StatusBar from '../../containers/StatusBar';
import { OutsideModalParamList, OutsideParamList } from '../../stacks/types';
import I18n from '../../i18n';
import { useTheme } from '../../theme';
import FormContainer from '../../containers/FormContainer';
import { IAssetsFavicon512 } from '../../definitions/IAssetsFavicon512';
import { getShowLoginButton } from '../../selectors/login';
import styles from './styles';
import { useAppSelector } from '../../lib/hooks';
import { CustomIcon } from '../../containers/CustomIcon';

type TNavigation = CompositeNavigationProp<
	StackNavigationProp<OutsideParamList, 'WorkspaceView'>,
	StackNavigationProp<OutsideModalParamList>
>;

const useWorkspaceViewSelector = () =>
	useAppSelector(state => ({
		server: state.server.server,
		Site_Name: state.settings.Site_Name as string,
		Site_Url: state.settings.Site_Url as string,
		Assets_favicon_512: state.settings.Assets_favicon_512 as IAssetsFavicon512,
		registrationForm: state.settings.Accounts_RegistrationForm as string,
		Accounts_iframe_enabled: state.settings.Accounts_iframe_enabled as boolean,
		showLoginButton: getShowLoginButton(state),
		inviteLinkToken: state.inviteLinks.token
	}));

const RenderItem = ({ item, index }) => {
	const slideAnim = new Animated.Value(0); // For slide animation
	const fadeAnim = new Animated.Value(0);

	// For fade animation

	const combinedStyle = {
		opacity: fadeAnim,
		transform: [
			{
				translateX: slideAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [200, 0]
				})
			}
		]
	};

	useEffect(() => {
		// Start the slide up animation
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true
			})
		]).start();
	}, [fadeAnim, slideAnim]);

	const marginTop = -item.height * 0.1;
	return (
		<Animated.View style={[localStyles.slide, combinedStyle]} key={index}>
			<View style={localStyles.contentContainer}>
				<Image source={item.image} style={[localStyles.image, { width: item.width, height: item.height }]} />
				<Text style={[localStyles.title, { marginTop }]}>{item.title}</Text>
				<Text style={localStyles.description}>{item.description}</Text>
				{item.sub1 ? <Text style={localStyles.sub1}>{item.sub1}</Text> : null}
				{item.sub2 ? (
					<Text style={localStyles.sub2}>
						{item.sub2.split(' ').map((word, index) => (
							<Text key={index} style={word === 'MTNIMA' ? localStyles.bold : null}>
								{word}{' '}
							</Text>
						))}
					</Text>
				) : null}
			</View>
		</Animated.View>
	);
};

const Memoized = React.memo(RenderItem);

const WorkspaceView = () => {
	const navigation = useNavigation<TNavigation>();
	const [currentPage, setCurrentPage] = useState(0);
	const ref = useRef<PagerView | null>(null);

	const { Accounts_iframe_enabled, Site_Name, inviteLinkToken, registrationForm, server } = useWorkspaceViewSelector();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: I18n.t('Your_workspace'),
			headerShown: false
		});
	}, [navigation]);

	const login = () => {
		if (Accounts_iframe_enabled) {
			navigation.navigate('AuthenticationWebView', { url: server, authType: 'iframe' });
			return;
		}
		navigation.navigate('LoginView', { title: Site_Name });
	};

	const splashScreens = useMemo(
		() => [
			{
				image: require('../../static/images/logo.png'),
				title: 'GovCom',
				description: I18n.t('bienvenu'),
				sub1: I18n.t('bienvnue_p1'),
				sub2: I18n.t('bienvnue_p2'),
				width: Dimensions.get('window').width * 0.5,
				height: Dimensions.get('window').height * 0.6
			},
			{
				image: require('../../static/images/Illustration2.png'),
				title: I18n.t('communication_sec'),
				description: I18n.t('communication_sec_p1'),
				sub1: '',
				sub2: '',
				width: Dimensions.get('window').width * 0.8,
				height: Dimensions.get('window').height * 0.6
			},
			{
				image: require('../../static/images/Illustration3.png'),
				title: I18n.t('souvernet'),
				description: I18n.t('souvernet_p1'),
				sub1: '',
				sub2: '',
				width: Dimensions.get('window').width * 0.8,
				height: Dimensions.get('window').height * 0.6
			}
		],
		[I18n.t]
	);

	const renderPagination = () => (
		<ScrollView contentContainerStyle={localStyles.pagination}>
			{splashScreens.map((_, index) => (
				<TouchableOpacity
					onPress={() => setCurrentPage(index)}
					key={index}
					style={[
						{ paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginHorizontal: 5 },
						{ backgroundColor: currentPage === index ? 'white' : 'transparent' }
					]}>
					<Text style={currentPage === index ? localStyles.activeDot : localStyles.dot}>{index + 1}</Text>
				</TouchableOpacity>
			))}

			<TouchableOpacity onPress={navigateToNextPage}>
				<CustomIcon name='arrow-right' size={35} color='#ffffff' />
			</TouchableOpacity>
		</ScrollView>
	);

	const navigateToNextPage = () => {
		const nextPage = currentPage + 1;
		console.log('Next Page: ', nextPage);

		if (nextPage === splashScreens.length) {
			login();
			return;
		}

		if (ref.current) {
			ref.current.setPage(nextPage);
		}

		setCurrentPage(nextPage);
	};

	return (
		<ScrollView contentContainerStyle={localStyles.container}>
			<ImageBackground source={require('../../static/images/splashBg.png')} style={localStyles.backgroundImage}>
				<PagerView ref={ref} style={localStyles.viewPager} initialPage={0} useNext={false}>
					<Memoized item={splashScreens[currentPage]} index={currentPage} />
				</PagerView>

				{renderPagination()}
				{/* <LanguageSelect outside={true} /> */}
			</ImageBackground>
		</ScrollView>
	);
};

const localStyles = StyleSheet.create({
	container: {
		flex: 1
	},
	viewPager: {
		flex: 1
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover'
	},
	slide: {
		width: '100%',
		height: '100%'
	},
	contentContainer: {
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	image: {
		resizeMode: 'contain'
	},
	title: {
		color: '#005D0D',
		fontWeight: '800',
		fontSize: 36,
		lineHeight: 40,
		textAlign: 'center'
	},
	description: {
		color: '#000000',
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 27,
		textAlign: 'center',
		width: 352,
		marginTop: 17
	},
	sub1: {
		color: '#000000',
		width: 338,
		fontSize: 26,
		fontWeight: '800',
		lineHeight: 35,
		textAlign: 'center',
		marginTop: 10
	},
	sub2: {
		color: '#000000',
		width: 336,
		fontSize: 16,
		fontWeight: '300',
		lineHeight: 38,
		textAlign: 'center',
		marginTop: 7
	},
	bold: {
		fontWeight: '800'
	},
	pagination: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		paddingBottom: 20,
		position: 'absolute',
		bottom: 0,
		right: 0
	},
	dot: {
		color: '#C4C4C4',
		fontSize: 18
	},
	activeDot: {
		color: '#005D0D',
		fontSize: 18
	}
});

export default WorkspaceView;

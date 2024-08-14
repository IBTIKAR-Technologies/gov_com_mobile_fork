import { Q } from '@nozbe/watermelondb';
import { Base64 } from 'js-base64';
import React from 'react';
import { BackHandler, Image, Keyboard, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import parse from 'url-parse';

import StatusBar from '../../containers/StatusBar';
import { inviteLinksClear } from '../../actions/inviteLinks';
import { selectServerRequest, serverFinishAdd, serverRequest } from '../../actions/server';
import { CERTIFICATE_KEY } from '../../lib/constants';
import * as HeaderButton from '../../containers/HeaderButton';
import { IApplicationState, IBaseScreen, TServerHistoryModel } from '../../definitions';
import { withDimensions } from '../../dimensions';
import I18n from '../../i18n';
import database from '../../lib/database';
import { sanitizeLikeString } from '../../lib/database/utils';
import UserPreferences from '../../lib/methods/userPreferences';
import { OutsideParamList } from '../../stacks/types';
import { withTheme } from '../../theme';
import EventEmitter from '../../lib/methods/helpers/events';
import { BASIC_AUTH_KEY, setBasicAuth } from '../../lib/methods/helpers/fetch';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { verticalScale } from './scaling';
import { serializeAsciiUrl } from '../../lib/methods';

export const serverURL = 'https://govcomapi.mtnima.gov.mr/';

const styles = StyleSheet.create({
	onboardingImage: {
		alignSelf: 'center',
		resizeMode: 'contain'
	}
});

interface INewServerViewProps extends IBaseScreen<OutsideParamList, 'NewServerView'> {
	connecting: boolean;
	previousServer: string | null;
	width: number;
	height: number;
}

interface INewServerViewState {
	text: string;
	connectingOpen: boolean;
	certificate: string | null;
	serversHistory: TServerHistoryModel[];
}

interface ISubmitParams {
	fromServerHistory?: boolean;
	username?: string;
}

class NewServerView extends React.Component<INewServerViewProps, INewServerViewState> {
	constructor(props: INewServerViewProps) {
		super(props);
		this.setHeader();

		this.state = {
			text: serverURL,
			connectingOpen: false,
			certificate: null,
			serversHistory: []
		};
		EventEmitter.addEventListener('NewServer', this.handleNewServerEvent);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentDidMount() {
		this.queryServerHistory();
		this.submit();
	}

	componentWillUnmount() {
		EventEmitter.removeListener('NewServer', this.handleNewServerEvent);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		const { previousServer, dispatch } = this.props;
		if (previousServer) {
			dispatch(serverFinishAdd());
		}
	}

	componentDidUpdate(prevProps: Readonly<INewServerViewProps>) {
		if (prevProps.connecting !== this.props.connecting) {
			this.setHeader();
		}
	}

	setHeader = () => {
		const { previousServer, navigation, connecting } = this.props;
		if (previousServer) {
			return navigation.setOptions({
				headerTitle: I18n.t('Workspaces'),
				headerLeft: () =>
					!connecting ? (
						<HeaderButton.CloseModal navigation={navigation} onPress={this.close} testID='new-server-view-close' />
					) : null
			});
		}

		return navigation.setOptions({
			headerShown: false
		});
	};

	handleBackPress = () => {
		const { navigation, previousServer } = this.props;
		if (navigation.isFocused() && previousServer) {
			this.close();
			return true;
		}
		return false;
	};

	onChangeText = (text: string) => {
		this.setState({ text });
		this.queryServerHistory(text);
	};

	queryServerHistory = async (text?: string) => {
		const db = database.servers;
		try {
			const serversHistoryCollection = db.get('servers_history');
			let whereClause = [Q.where('username', Q.notEq(null)), Q.sortBy('updated_at', Q.desc), Q.take(3)];
			if (text) {
				const likeString = sanitizeLikeString(text);
				whereClause = [...whereClause, Q.where('url', Q.like(`%${likeString}%`))];
			}
			const serversHistory = await serversHistoryCollection.query(...whereClause).fetch();
			this.setState({ serversHistory });
		} catch {
			// Do nothing
		}
	};

	close = () => {
		const { dispatch, previousServer } = this.props;

		dispatch(inviteLinksClear());
		if (previousServer) {
			dispatch(selectServerRequest(previousServer));
		}
	};

	handleNewServerEvent = (event: { server: string }) => {
		let { server } = event;
		if (!server) {
			return;
		}
		const { dispatch } = this.props;
		this.setState({ text: server });
		server = this.completeUrl(server);
		dispatch(serverRequest(server));
	};

	onPressServerHistory = (serverHistory: TServerHistoryModel) => {
		this.setState({ text: serverHistory.url }, () => this.submit({ fromServerHistory: true, username: serverHistory?.username }));
	};

	submit = ({ fromServerHistory = false, username }: ISubmitParams = {}) => {
		logEvent(events.NS_CONNECT_TO_WORKSPACE);
		const { text, certificate } = this.state;
		const { dispatch } = this.props;

		this.setState({ connectingOpen: false });

		if (text) {
			Keyboard.dismiss();
			const server = this.completeUrl(text);

			// Save info - SSL Pinning
			if (certificate) {
				UserPreferences.setString(`${CERTIFICATE_KEY}-${server}`, certificate);
			}

			// Save info - HTTP Basic Authentication
			this.basicAuth(server, text);

			if (fromServerHistory) {
				dispatch(serverRequest(server, username, true));
			} else {
				dispatch(serverRequest(server));
			}
		}
	};

	basicAuth = (server: string, text: string) => {
		try {
			const parsedUrl = parse(text, true);
			if (parsedUrl.auth.length) {
				const credentials = Base64.encode(parsedUrl.auth);
				UserPreferences.setString(`${BASIC_AUTH_KEY}-${server}`, credentials);
				setBasicAuth(credentials);
			}
		} catch {
			// do nothing
		}
	};

	completeUrl = (url: string) => {
		const parsedUrl = parse(url, true);
		if (parsedUrl.auth.length) {
			url = parsedUrl.origin;
		}

		url = url && url.replace(/\s/g, '');

		if (/^(\w|[0-9-_]){3,}$/.test(url) && /^(htt(ps?)?)|(loca((l)?|(lh)?|(lho)?|(lhos)?|(lhost:?\d*)?)$)/.test(url) === false) {
			url = `${url}.rocket.chat`;
		}

		if (/^(https?:\/\/)?(((\w|[0-9-_])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
			if (/^localhost(:\d+)?/.test(url)) {
				url = `http://${url}`;
			} else if (/^https?:\/\//.test(url) === false) {
				url = `https://${url}`;
			}
		}
		return serializeAsciiUrl(url.replace(/\/+$/, '').replace(/\\/g, '/'));
	};

	render() {
		const { height } = this.props;

		return (
			<>
				<Image
					source={require('../../static/images/splash_1.png')}
					style={{
						position: 'absolute',
						top: 0,
						width: '100%',
						height: '100%'
					}}
					resizeMode='cover'
				/>
				<StatusBar backgroundColor='#002E06' />
				<Image
					style={[
						styles.onboardingImage,
						{
							marginBottom: verticalScale({ size: 10, height }),
							marginTop: verticalScale({ size: 40, height }),
							width: verticalScale({ size: 300, height: Dimensions.get('window').width }),
							height: verticalScale({ size: 300, height: Dimensions.get('window').width })
						}
					]}
					source={require('../../static/images/logo.png')}
					fadeDuration={0}
				/>
			</>
		);
	}
}

const mapStateToProps = (state: IApplicationState) => ({
	connecting: state.server.connecting,
	previousServer: state.server.previousServer
});

export default connect(mapStateToProps)(withDimensions(withTheme(NewServerView)));

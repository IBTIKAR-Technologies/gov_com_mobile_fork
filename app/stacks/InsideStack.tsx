import React from 'react';
import { I18nManager, TouchableOpacity } from 'react-native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';

import Messages from '../svgs/Messages';
import { ThemeContext } from '../theme';
import { ModalAnimation, StackAnimation, defaultHeader, themedHeader } from '../lib/methods/helpers/navigation';
import { CustomIcon } from '../containers/CustomIcon';
import { themes } from '../lib/constants';

// Import necessary components and views
import RoomView from '../views/RoomView';
import RoomsListView from '../views/RoomsListView';
import RoomActionsView from '../views/RoomActionsView';
import RoomInfoView from '../views/RoomInfoView';
import ReportUserView from '../views/ReportUserView';
import RoomInfoEditView from '../views/RoomInfoEditView';
import RoomMembersView from '../views/RoomMembersView';
import SearchMessagesView from '../views/SearchMessagesView';
import SelectedUsersView from '../views/SelectedUsersView';
import InviteUsersView from '../views/InviteUsersView';
import InviteUsersEditView from '../views/InviteUsersEditView';
import MessagesView from '../views/MessagesView';
import AutoTranslateView from '../views/AutoTranslateView';
import DirectoryView from '../views/DirectoryView';
import NotificationPrefView from '../views/NotificationPreferencesView';
import ForwardLivechatView from '../views/ForwardLivechatView';
import CloseLivechatView from '../views/CloseLivechatView';
import LivechatEditView from '../views/LivechatEditView';
import PickerView from '../views/PickerView';
import ThreadMessagesView from '../views/ThreadMessagesView';
import TeamChannelsView from '../views/TeamChannelsView';
import MarkdownTableView from '../views/MarkdownTableView';
import ReadReceiptsView from '../views/ReadReceiptView';
import CannedResponsesListView from '../views/CannedResponsesListView';
import CannedResponseDetail from '../views/CannedResponseDetail';
import ProfileView from '../views/ProfileView';
import UserPreferencesView from '../views/UserPreferencesView';
import UserNotificationPrefView from '../views/UserNotificationPreferencesView';
import DisplayPrefsView from '../views/DisplayPrefsView';
import SettingsView from '../views/SettingsView';
import SecurityPrivacyView from '../views/SecurityPrivacyView';
import PushTroubleshootView from '../views/PushTroubleshootView';
import E2EEncryptionSecurityView from '../views/E2EEncryptionSecurityView';
import LanguageView from '../views/LanguageView';
import ThemeView from '../views/ThemeView';
import DefaultBrowserView from '../views/DefaultBrowserView';
import ScreenLockConfigView from '../views/ScreenLockConfigView';
import MediaAutoDownloadView from '../views/MediaAutoDownloadView';
import AdminPanelView from '../views/AdminPanelView';
import NewMessageView from '../views/NewMessageView';
import CreateChannelView from '../views/CreateChannelView';
import E2ESaveYourPasswordView from '../views/E2ESaveYourPasswordView';
import E2EHowItWorksView from '../views/E2EHowItWorksView';
import E2EEnterYourPasswordView from '../views/E2EEnterYourPasswordView';
import AttachmentView from '../views/AttachmentView';
import ModalBlockView from '../views/ModalBlockView';
import JitsiMeetView from '../views/JitsiMeetView';
import StatusView from '../views/StatusView';
import ShareView from '../views/ShareView';
import CreateDiscussionView from '../views/CreateDiscussionView';
import ForwardMessageView from '../views/ForwardMessageView';
import QueueListView from '../ee/omnichannel/views/QueueListView';
import AddChannelTeamView from '../views/AddChannelTeamView';
import AddExistingChannelView from '../views/AddExistingChannelView';
import SelectListView from '../views/SelectListView';
import DiscussionsView from '../views/DiscussionsView';
import ChangeAvatarView from '../views/ChangeAvatarView';
import {
	AdminPanelStackParamList,
	ChatsStackParamList,
	DisplayPrefStackParamList,
	DrawerParamList,
	E2EEnterYourPasswordStackParamList,
	E2ESaveYourPasswordStackParamList,
	InsideStackParamList,
	NewMessageStackParamList,
	ProfileStackParamList,
	SettingsStackParamList
} from './types';
import { isIOS } from '../lib/methods/helpers';
import { TNavigation } from './stackType';
import UserInfo from '../views/ReportUserView/UserInfo';
import i18n from '../i18n';

import { BottomTabBar } from '@react-navigation/bottom-tabs';

// ChatsStackNavigator
const ChatsStack = createStackNavigator<ChatsStackParamList & TNavigation>();
const ChatsStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<ChatsStack.Navigator screenOptions={{ ...StackAnimation } as StackNavigationOptions}>
			<ChatsStack.Screen name='RoomsListView' component={RoomsListView} />
			<ChatsStack.Screen name='RoomView' component={RoomView} />
			<ChatsStack.Screen name='RoomActionsView' component={RoomActionsView} options={RoomActionsView.navigationOptions} />
			<ChatsStack.Screen name='SelectListView' component={SelectListView} options={SelectListView.navigationOptions} />
			<ChatsStack.Screen name='RoomInfoView' component={RoomInfoView} />
			<ChatsStack.Screen name='ReportUserView' component={ReportUserView} />
			{/* @ts-ignore */}
			<ChatsStack.Screen name='RoomInfoEditView' component={RoomInfoEditView} options={RoomInfoEditView.navigationOptions} />
			<ChatsStack.Screen name='ChangeAvatarView' component={ChangeAvatarView} />
			<ChatsStack.Screen name='RoomMembersView' component={RoomMembersView} />
			<ChatsStack.Screen name='DiscussionsView' component={DiscussionsView} />
			<ChatsStack.Screen
				name='SearchMessagesView'
				component={SearchMessagesView}
				options={SearchMessagesView.navigationOptions}
			/>
			<ChatsStack.Screen name='SelectedUsersView' component={SelectedUsersView} />
			<ChatsStack.Screen name='InviteUsersView' component={InviteUsersView} />
			<ChatsStack.Screen name='InviteUsersEditView' component={InviteUsersEditView} />
			<ChatsStack.Screen name='MessagesView' component={MessagesView} />
			<ChatsStack.Screen name='AutoTranslateView' component={AutoTranslateView} />
			<ChatsStack.Screen name='DirectoryView' component={DirectoryView} options={DirectoryView.navigationOptions} />
			<ChatsStack.Screen name='NotificationPrefView' component={NotificationPrefView} />
			<ChatsStack.Screen name='PushTroubleshootView' component={PushTroubleshootView} />
			<ChatsStack.Screen name='ForwardLivechatView' component={ForwardLivechatView} />
			<ChatsStack.Screen name='CloseLivechatView' component={CloseLivechatView} />
			<ChatsStack.Screen name='LivechatEditView' component={LivechatEditView} options={LivechatEditView.navigationOptions} />
			<ChatsStack.Screen name='PickerView' component={PickerView} />
			{/* @ts-ignore */}
			<ChatsStack.Screen name='ThreadMessagesView' component={ThreadMessagesView} />
			<ChatsStack.Screen name='TeamChannelsView' component={TeamChannelsView} />
			<ChatsStack.Screen name='CreateChannelView' component={CreateChannelView} />
			<ChatsStack.Screen name='AddChannelTeamView' component={AddChannelTeamView} />
			<ChatsStack.Screen name='AddExistingChannelView' component={AddExistingChannelView} />
			{/* @ts-ignore */}
			<ChatsStack.Screen name='MarkdownTableView' component={MarkdownTableView} />
			<ChatsStack.Screen name='ReadReceiptsView' component={ReadReceiptsView} options={ReadReceiptsView.navigationOptions} />
			<ChatsStack.Screen name='QueueListView' component={QueueListView} />
			<ChatsStack.Screen name='CannedResponsesListView' component={CannedResponsesListView} />
			<ChatsStack.Screen name='CannedResponseDetail' component={CannedResponseDetail} />
			<ChatsStack.Screen
				name='JitsiMeetView'
				component={JitsiMeetView}
				options={{ headerShown: false, animationEnabled: isIOS }}
			/>
		</ChatsStack.Navigator>
	);
};

// ProfileStackNavigator
// const ProfileStack = createStackNavigator<ProfileStackParamList & TNavigation>();
// const ProfileStackNavigator = () => {
// 	const { theme } = React.useContext(ThemeContext);
// 	return (
// 		<ProfileStack.Navigator
// 			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}
// 		>
// 			<ProfileStack.Screen name='ProfileView' component={ProfileView} options={ProfileView.navigationOptions} />
// 			<ProfileStack.Screen name='UserPreferencesView' component={UserPreferencesView} />
// 			<ProfileStack.Screen name='ChangeAvatarView' component={ChangeAvatarView} />
// 			<ProfileStack.Screen name='UserNotificationPrefView' component={UserNotificationPrefView} />
// 			<ProfileStack.Screen name='PushTroubleshootView' component={PushTroubleshootView} />
// 			<ProfileStack.Screen name='PickerView' component={PickerView} />
// 		</ProfileStack.Navigator>
// 	);
// };

// SettingsStackNavigator
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<SettingsStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<SettingsStack.Screen
				options={{
					title: i18n.t('SettingsView'),
					headerStyle: {
						backgroundColor: '#005D0D'
					},
					headerTitleStyle: {
						color: 'white',
						textAlign: 'center'
					}
				}}
				name='SettingsView'
				component={SettingsView}
			/>
			<SettingsStack.Screen name='UserInfo' component={UserInfo} />
			{/* <SettingsStack.Screen name='Profile' component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} /> */}
			<SettingsStack.Screen name='SecurityPrivacyView' component={SecurityPrivacyView} />
			<SettingsStack.Screen name='PushTroubleshootView' component={PushTroubleshootView} />
			<SettingsStack.Screen name='E2EEncryptionSecurityView' component={E2EEncryptionSecurityView} />
			<SettingsStack.Screen name='LanguageView' component={LanguageView} />
			<SettingsStack.Screen name='ThemeView' component={ThemeView} />
			<SettingsStack.Screen name='DefaultBrowserView' component={DefaultBrowserView} />
			<SettingsStack.Screen name='MediaAutoDownloadView' component={MediaAutoDownloadView} />
			<SettingsStack.Screen
				name='ScreenLockConfigView'
				component={ScreenLockConfigView}
				options={ScreenLockConfigView.navigationOptions}
			/>
		</SettingsStack.Navigator>
	);
};

// AdminPanelStackNavigator
const AdminPanelStack = createStackNavigator<AdminPanelStackParamList>();
const AdminPanelStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<AdminPanelStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<AdminPanelStack.Screen name='AdminPanelView' component={AdminPanelView} />
		</AdminPanelStack.Navigator>
	);
};

// DisplayPreferenceNavigator
const DisplayPrefStack = createStackNavigator<DisplayPrefStackParamList>();
const DisplayPrefStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<DisplayPrefStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<DisplayPrefStack.Screen name='DisplayPrefsView' component={DisplayPrefsView} />
		</DisplayPrefStack.Navigator>
	);
};
// NewMessageStackNavigator
const NewMessageStack = createStackNavigator<NewMessageStackParamList>();
const NewMessageStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<NewMessageStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<NewMessageStack.Screen name='NewMessageView' component={NewMessageView} />
			<NewMessageStack.Screen name='SelectedUsersViewCreateChannel' component={SelectedUsersView} />
			<NewMessageStack.Screen name='CreateChannelView' component={CreateChannelView} />
			<NewMessageStack.Screen name='CreateDiscussionView' component={CreateDiscussionView} />
			<NewMessageStack.Screen name='ForwardMessageView' component={ForwardMessageView} />
		</NewMessageStack.Navigator>
	);
};

// E2ESaveYourPasswordStackNavigator
const E2ESaveYourPasswordStack = createStackNavigator<E2ESaveYourPasswordStackParamList>();
const E2ESaveYourPasswordStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<E2ESaveYourPasswordStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<E2ESaveYourPasswordStack.Screen name='E2ESaveYourPasswordView' component={E2ESaveYourPasswordView} />
			<E2ESaveYourPasswordStack.Screen name='E2EHowItWorksView' component={E2EHowItWorksView} />
		</E2ESaveYourPasswordStack.Navigator>
	);
};

// E2EEnterYourPasswordStackNavigator
const E2EEnterYourPasswordStack = createStackNavigator<E2EEnterYourPasswordStackParamList>();
const E2EEnterYourPasswordStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<E2EEnterYourPasswordStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<E2EEnterYourPasswordStack.Screen name='E2EEnterYourPasswordView' component={E2EEnterYourPasswordView} />
		</E2EEnterYourPasswordStack.Navigator>
	);
};

const CustomTabBar = props => {
	const state = useNavigationState(state => state);
	const findCurrentRouteName = state => {
		if (!state || !state.routes || state.routes.length === 0) {
			return null;
		}
		const route = state.routes[state.index];
		if (route.state) {
			return findCurrentRouteName(route.state);
		}
		return route.name;
	};

	const currentRouteName = findCurrentRouteName(state);
	console.log('Current Route NAme : ', currentRouteName);
	if (currentRouteName !== 'RoomsListView' && currentRouteName !== 'Settings' && currentRouteName !== 'BottomTabNavigator') {
		return null;
	}

	return <BottomTabBar {...props} />;
};

const Tab = createBottomTabNavigator<DrawerParamList>();

const BottomTabNavigator = ({ isMasterDetail }) => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Tab.Navigator
			tabBar={props => <CustomTabBar {...props} />}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName;
					if (route.name === 'Messages') {
						return <Messages color={color} />;
					}
					if (route.name === 'Profile') {
						iconName = 'user';
					} else if (route.name === 'Settings') {
						iconName = 'administration';
					} else if (route.name === 'Display') {
						iconName = 'sort';
					} else if (route.name === 'Admin') {
						iconName = 'settings';
					}
					return <CustomIcon name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: themes[theme].surfaceRoom,
				tabBarInactiveTintColor: themes[theme].auxiliaryText,
				tabBarLabel: route.name,
				headerShown: false
			})}>
			<Tab.Screen name='Messages' component={ChatsStackNavigator} options={{ tabBarLabel: i18n.t('Messages') }} />
			<Tab.Screen name='Settings' component={SettingsStackNavigator} options={{ tabBarLabel: i18n.t('Settings') }} />
			{isMasterDetail && <Tab.Screen name='Admin' component={AdminPanelStackNavigator} options={{ tabBarLabel: 'Admin' }} />}
		</Tab.Navigator>
	);
};
const InsideStack = createStackNavigator<InsideStackParamList & TNavigation>();
const InsideStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<InsideStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...ModalAnimation, presentation: 'transparentModal' }}>
			<InsideStack.Screen name='BottomTabNavigator' component={BottomTabNavigator} options={{ headerShown: false }} />
			<InsideStack.Screen name='NewMessageStackNavigator' component={NewMessageStackNavigator} options={{ headerShown: false }} />
			<InsideStack.Screen
				name='E2ESaveYourPasswordStackNavigator'
				component={E2ESaveYourPasswordStackNavigator}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='E2EEnterYourPasswordStackNavigator'
				component={E2EEnterYourPasswordStackNavigator}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen name='AttachmentView' component={AttachmentView} />
			<InsideStack.Screen name='StatusView' component={StatusView} />
			<InsideStack.Screen name='ShareView' component={ShareView} />
			<InsideStack.Screen name='ModalBlockView' component={ModalBlockView} options={ModalBlockView.navigationOptions} />
			<InsideStack.Screen name='ProfileView' component={ProfileView} />
		</InsideStack.Navigator>
	);
};

export default InsideStackNavigator;

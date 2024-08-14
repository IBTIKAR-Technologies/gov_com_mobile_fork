import 'react-native-gesture-handler';
import 'react-native-console-time-polyfill';
import { AppRegistry, PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';

import { name as appName, share as shareName } from './app.json';
import { isFDroidBuild } from './app/lib/constants';
import { isAndroid } from './app/lib/methods/helpers';

global.sysAdminId = 'g48FFNEbiYmnHuEvq';

const options = {
	ios: {
		appName: 'GovCom'
	},
	android: {
		alertTitle: 'Permissions required',
		alertDescription: 'This application needs to access your phone accounts',
		cancelButton: 'Cancel',
		okButton: 'ok',
		additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE],
		foregroundService: {
			channelId: 'mr.gov.mtnima.govcom',
			channelName: 'Foreground service for my app',
			notificationTitle: 'My app is running on background',
			notificationIcon: 'Path to the resource icon of the notification'
		}
	}
};

RNCallKeep.setup(options).then(accepted => {
	// Your setup code
	console.log('RNCallKeep setup', accepted);
});

if (__DEV__) {
	require('./app/ReactotronConfig');
} else {
	console.log = () => {};
	console.time = () => {};
	console.timeLog = () => {};
	console.timeEnd = () => {};
	console.warn = () => {};
	console.count = () => {};
	console.countReset = () => {};
	console.error = () => {};
	console.info = () => {};
}

if (!isFDroidBuild && isAndroid) {
	require('./app/lib/notifications/videoConf/backgroundNotificationHandler');
}

AppRegistry.registerComponent(appName, () => require('./app/index').default);
AppRegistry.registerComponent(shareName, () => require('./app/share').default);

// For storybook, comment everything above and uncomment below
// import 'react-native-gesture-handler';
// import 'react-native-console-time-polyfill';
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';

// require('./app/ReactotronConfig');

// AppRegistry.registerComponent(appName, () => require('./.storybook/index').default);

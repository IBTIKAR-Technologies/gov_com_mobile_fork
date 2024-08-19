const path = require('path');
const { generate } = require('@storybook/react-native/scripts/generate');
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

generate({
	configPath: path.resolve(__dirname, './.storybook')
});

const sourceExts = [...defaultSourceExts, 'mjs'];

const config = {
	transformer: {
		unstable_allowRequireContext: true
	},
	resolver: {
		sourceExts: process.env.RUNNING_E2E_TESTS ? ['mock.ts', ...sourceExts] : sourceExts
	}
};

module.exports = (async () => {
	const {
		resolver: { sourceExts, assetExts }
	} = await getDefaultConfig();

	return {
		transformer: {
			babelTransformerPath: require.resolve('react-native-svg-transformer'),
			// eslint-disable-next-line require-await
			getTransformOptions: async () => ({
				transform: {
					experimentalImportSupport: false,
					inlineRequires: true
				}
			})
		},
		resolver: {
			assetExts: assetExts.filter(ext => ext !== 'svg'),
			sourceExts: [...sourceExts, 'svg']
		}
	};
})();

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = {
	expo: {
			name: "storyGen",
			slug: "storyGen",
			version: "1.0.0",
			orientation: "portrait",
			icon: "./src/assets/images/icon.png",
			scheme: "storyGen",
			userInterfaceStyle: "automatic",
			splash: {
					image: "./src/assets/images/splash.png",
					resizeMode: "contain",
					backgroundColor: "#ffffff"
			},
			ios: {
					supportsTablet: true,
					bundleIdentifier: "com.nikborzunov.storyGen"
			},
			android: {
					adaptiveIcon: {
							foregroundImage: "./assets/images/adaptive-icon.png",
							backgroundColor: "#ffffff"
					},
					package: "com.nikborzunov.storyGen"
			},
			web: {
					bundler: "metro",
					output: "static",
					favicon: "./assets/images/favicon.png"
			},
			plugins: [
					"expo-router",
					"expo-font"
			],
			extra: {
					GOOGLE_CLIENT_ID: "453382941318-cnlibeu160h4oje0hsioool3rn43o2bi.apps.googleusercontent.com",
					GOOGLE_CLIENT_ID_IOS: "453382941318-kgbs1075r6ifvmq4cokrp4cusloi9nf8.apps.googleusercontent.com",
					GOOGLE_CLIENT_SECRET: "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",
					API_URL: "http://192.168.0.103:1001"
			}
	}
};
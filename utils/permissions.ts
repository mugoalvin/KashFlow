import { PermissionsAndroid, Platform } from "react-native";

export async function requestSmsPermission() {
	if (Platform.OS !== 'android') return

	try {
		const hasPermission = await PermissionsAndroid.check(
			PermissionsAndroid.PERMISSIONS.READ_SMS
		)

		if (hasPermission) {
			console.log("Already Have SMS Permission")
			return
		}

		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_SMS,
			{
				title: "SMS Permission",
				message: "This app needs access to your messages to read M-Pesa transactions.",
				buttonNegative: "Cancel",
				buttonPositive: "OK"
			}
		)

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("SMS Permissions Granted")
		}
		else {
			console.log("SMS Permission Denied")
		}

	} catch (error) {
		console.warn(error)
	}
}
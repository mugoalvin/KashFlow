import Body from "@/components/views/body";
import useSnackbarContext from "@/contexts/SnackbarContext";
import useThemeContext from "@/contexts/ThemeContext";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { Vibration , StatusBar } from "react-native";
import { Button, Text } from "react-native-paper";



export default function Settings() {
	const { resetTheme, updateTheme } = useThemeContext()
	const statusBarHeight = StatusBar.currentHeight
	const { showSnackbar } = useSnackbarContext()
	return (
		<Body style={{ paddingTop: statusBarHeight } as any} className="items-center justify-center gap-3">
			<Button
				mode="outlined"
				onPress={async () => {
					const count = await sqliteDB.$count(mpesaMessages)

					showSnackbar({
						message: `Database Table has {${count}} rows`
					})
				}}
			>
				<Text>Show Database Table Count</Text>
			</Button>


			<Button
				mode="outlined"
				onPress={() =>
					updateTheme("#0000FF")
				}
				onLongPress={() => {
					Vibration.vibrate(50)
					resetTheme()
				}}
			>
				<Text>Update Theme</Text>
			</Button>
		</Body>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settigns
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference

*/}
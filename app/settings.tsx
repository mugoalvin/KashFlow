import Body from "@/components/views/body";
import useSnackbarContext from "@/contexts/SnackbarContext";
import useThemeContext from "@/contexts/ThemeContext";
import { sqliteDB } from "@/db/config";
import { categoriesTable } from "@/db/sqlite";
import { StatusBar, Vibration } from "react-native";
import { Button } from "react-native-paper";



export default function Settings() {
	const { resetTheme, updateTheme } = useThemeContext()
	const statusBarHeight = StatusBar.currentHeight
	return (
		<Body style={{ paddingTop: statusBarHeight } as any} className="items-center justify-center gap-3">
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
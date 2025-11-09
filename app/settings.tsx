import Body from "@/components/views/body";
import { StatusBar } from "react-native";



export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight


	return (
		<Body style={{ paddingTop: statusBarHeight } as any} className="items-center justify-center">

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
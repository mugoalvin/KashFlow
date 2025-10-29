import Body from "@/components/views/body";
import useThemeContext from "@/contexts/ThemeContext";
import { StatusBar } from "react-native";
import { Button } from "react-native-paper";

export default function Settings() {
	const { resetTheme, updateTheme } = useThemeContext()
	const statusBarHeight = StatusBar.currentHeight


	return ( // @ts-ignore
		<Body style={{ paddingTop: statusBarHeight }} className="items-center justify-center">
			<Button
				onPress={resetTheme}
			>
				Reset
			</Button>

			<Button
				onPress={() => updateTheme("#bada55")}
			>
				Update
			</Button>
		</Body>
	)
}
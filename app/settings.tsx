import Body from "@/components/views/body";
import { StatusBar } from "react-native";

export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight

	return ( // @ts-ignore
		<Body style={{ paddingTop: statusBarHeight }}>
			
		</Body>
	)
}
import Body from "@/components/views/body";
import useSnackbarContext from "@/contexts/SnackbarContext";
import { NativeModules } from "react-native";
import { Button } from "react-native-paper";

export default function Analysis() {
	const { showSnackbar } = useSnackbarContext()
	const { SmsReader } = NativeModules

	return (
		<Body className="items-center justify-center">
			<Button
				onPress={async () => {
					const message = await SmsReader.getInboxFilteredByDate("Mpesa", "2025-09-28")

					console.log(
						message
					)
				}}
			>
				Test Module
			</Button>
		</Body>
	)
}
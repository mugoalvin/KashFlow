import Body from "@/components/views/body";
import { router } from "expo-router";
import { Button } from "react-native-paper";

export default function Index() {

	return (
		<Body className="items-center justify-center">
			<Button
				mode="contained-tonal"
				onPress={() => router.push('/(home)/page')}
			>
				Hello
			</Button>
		</Body>
	);
}

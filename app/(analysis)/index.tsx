import Body from "@/components/views/body";
import { Mpesa } from "@/interface/mpesa";
import { parseMpesaMessage } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { NativeModules } from "react-native";
import { Button, IconButton } from "react-native-paper";

export default function Analysis() {
	const { SmsReader } = NativeModules
	const navigation = useNavigation()
	const [messages, setMessages] = useState<Mpesa[]>([])

	const parsedMessages = useMemo(() =>
		messages.map(msg => parseMpesaMessage(msg.body)),
		[messages]
	)

	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				<IconButton
					icon={({ color, size }) => <Ionicons name="arrow-redo-outline" color={color} size={size - 5} />}
					onPress={() => router.push('/(analysis)/analysis_more')}
				/>
		})
	}, [navigation])

	useEffect(() => {
		console.log(parsedMessages)
	}, [parsedMessages])

	return (
		<Body className="items-center">
			<Button
				onPress={async () => {
					const messages = await SmsReader.getInboxFilteredByDate("Mpesa", "2025-09-29")
					setMessages(messages)
				}}
			>
				Test Module
			</Button>
		</Body>
	)
}
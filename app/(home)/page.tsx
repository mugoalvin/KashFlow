import Body from "@/components/views/body";
import { Mpesa } from "@/interface/mpesa";
import { fetchSMSMessage, parseMpesaMessage } from "@/utils/functions";
import { useEffect, useMemo, useState } from "react";
import { Button } from "react-native-paper";

export default function Page() {
	const [messages, setMessages] = useState<Mpesa[]>([])

	async function getSpenditure() {
		const msgs = await fetchSMSMessage(5)
		setMessages(msgs || [])
	}

	const parsedMessage = useMemo(() =>
		messages.map(message => parseMpesaMessage(message.body)),
		[messages]
	)

	useEffect(() => {
		console.log(
			parsedMessage
				.filter(message => message.type === 'send')
				.map(message => message.amount)
				.reverse()
		)
	}, [parsedMessage])

	return (
		<Body>
			<Button
				mode="contained-tonal"
				onPress={getSpenditure}
			>
				Get Usage
			</Button>
		</Body>
	)
}

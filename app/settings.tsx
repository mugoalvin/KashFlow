import Body from "@/components/views/body";
import { Mpesa } from "@/interface/mpesa";
import { fetchSMSMessage, getListOfBalances, parseMpesaMessage } from "@/utils/functions";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { StatusBar, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight
	const [limit, setLimit] = useState<number>(0)
	const [messages, setMessages] = useState<Mpesa[]>([])
	const [listOfBalances, setListOfBalances] = useState<number[]>([])

	const parsedMessages = useMemo(() =>
		messages.map(msg => parseMpesaMessage(msg.body)),
		[messages]
	)

	useEffect(() => {
		const balanceList = getListOfBalances(parsedMessages)
		setListOfBalances(balanceList)
	}, [parsedMessages])

	return ( // @ts-ignore
		<Body style={{ paddingTop: statusBarHeight }}>
			<TextInput label="Enter Limit" mode="flat" onChangeText={value => setLimit(Number(value))} />

			<View className="flex-row justify-between mt-5">
				<Button
					mode="contained-tonal"
					disabled={limit === 0}
					onPress={async () => {
						const msgs = await fetchSMSMessage(limit)
						setMessages(msgs || [])
					}}
				>
					Get Balances
				</Button>
				<Button
					mode="contained-tonal"
					onPress={async () => {
						setMessages([])
					}}
				>
					Clear Balances
				</Button>
			</View>

			<FlashList
				className="flex-1"
				data={listOfBalances}
				renderItem={({ item, index }) => (
					<Animated.View
						className="p-2"
						entering={FadeInRight.duration(500).delay(index * 100)}
						exiting={FadeOutLeft.duration(500).delay(index * 100)}
					>
						<Text>{index + 1}: {item}</Text>
					</Animated.View>
				)}
			/>
		</Body>
	)
}
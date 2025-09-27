import Body from "@/components/views/body";
import { Mpesa } from "@/interface/mpesa";
import { calculateMpesaBalance, fechSMSMessage, getListOfBalances, parseMpesaMessage } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from '@shopify/flash-list';
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

export default function Index() {
	const navigation = useNavigation()
	const [messages, setMessages] = useState<Mpesa[]>([])
	const [balance, setBalance] = useState<number>(0)
	const [fulizaLimit, setFulizaLimit] = useState<number>(0)
	const [listOfBalances, setListOfBalances] = useState<number[]>([])

	const parsedMessages = useMemo(() =>
		messages.map(msg => parseMpesaMessage(msg.body)),
		[messages]
	)

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<>
					<IconButton
						icon={({ color, size }) => <Ionicons name="arrow-redo-outline" color={color} size={size - 5} />}
						onPress={() => router.push('/(home)/page')}
					/>
					<IconButton
						icon={({ color, size }) => <Ionicons name="search" color={color} size={size - 5} />}
						onPress={async () => {
							const msgs = await fechSMSMessage(10)
							setMessages(msgs || [])
						}}
					/>
				</>
			)
		})
	}, [])

	useEffect(() => {
		const { balance, limit } = calculateMpesaBalance(parsedMessages)
		const balanceList = getListOfBalances(parsedMessages)

		setBalance(balance)
		setFulizaLimit(limit || 0)
		setListOfBalances(balanceList)

	}, [parsedMessages])


	const renderItem = ({ item, index }: { item: Mpesa, index: number }) => {
		const object = parseMpesaMessage(item.body)
		return (
			<Animated.View
				className="py-4"
				entering={FadeInLeft.duration(500).delay(index * 100)}
				exiting={FadeOutRight.duration(500).delay(index * 100)}
			>

				<Text>{index + 1}. {object.counterparty} ___ Ksh.{object.amount}</Text>
				<Text className="ms-4">{object.type}</Text>
			</Animated.View>
		)
	}


	return (
		<Body className="gap-3">
			<View className="flex-row justify-around">
				{
					balance !== 0 &&
					<Text>M-Pesa Balance: {balance}</Text>
				}
				{
					balance !== 0 &&
					<Text>Fuliza Limit: {fulizaLimit}</Text>
				}
			</View>

			<Button
				onPress={() =>
					setMessages([])
				}
			>
				Clear Data
			</Button>

			<FlashList
				className="flex-1"
				data={messages}
				renderItem={renderItem}
			/>

		</Body>
	);
}

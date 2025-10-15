import BalanceInfo from "@/components/information/balanceInfo";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { Mpesa } from "@/interface/mpesa";
import { calculateMpesaBalance, fetchDailyTransaction, parseMpesaMessage } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import { NativeModules } from 'react-native'
import useSnackbarContext from "@/contexts/SnackbarContext";

export default function Index() {
	const theme = useTheme()
	const { SmsReader } = NativeModules
	const navigation = useNavigation()
	const [messages, setMessages] = useState<Mpesa[]>([])
	const [balance, setBalance] = useState<number>(0)
	const { showSnackbar } = useSnackbarContext()

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
							const date = new Date()
							// 2025-10-08
							const currentDate =
								date.getFullYear().toString()
									.concat("-")
									.concat((date.getMonth() + 1).toString())
									.concat("-")
									.concat((date.getDate()).toString())
							const msgs = await fetchDailyTransaction(currentDate)
							setMessages(msgs || [])
						}}
					/>
				</>
			)
		})
	}, [])

	useEffect(() => {
		const { balance } = calculateMpesaBalance(parsedMessages)

		setBalance(balance)
	}, [parsedMessages])


	return (
		<Body className="gap-3">
			<BalanceInfo balance={balance} />
			<TodaysTransaction messages={messages} />

			<Button
				className="mb-28"
				mode="elevated"
				onPress={async () => {
					try {
						const confirmation = await SmsReader.testModule()
						showSnackbar({
							message: confirmation
						})
					}
					catch (e: any) {
						showSnackbar({
							message: e.error,
							isError: true
						})
					}
				}}
			>
				Test Module
			</Button>
		</Body>
	);
}

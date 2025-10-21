import BalanceInfo from "@/components/information/balanceInfo";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { MpesaParced } from "@/interface/mpesa";
import { calculateMpesaBalance, fetchDailyTransaction } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { IconButton } from "react-native-paper";

export default function Index() {
	const navigation = useNavigation()
	const [messages, setMessages] = useState<MpesaParced[]>([])
	const [balance, setBalance] = useState<number>(0)


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
		const { balance } = calculateMpesaBalance(messages)

		setBalance(balance)
	}, [messages])


	return (
		<Body className="gap-3">
			<BalanceInfo balance={balance} />
			<TodaysTransaction messages={messages} />
		</Body>
	);
}

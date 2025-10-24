import BalanceInfo from "@/components/information/balanceInfo";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { MpesaParced } from "@/interface/mpesa";
import { calculateMpesaBalance, fetchDailyTransaction, syncDatabase } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { IconButton } from "react-native-paper";

import { sqliteDB } from "@/db/config";
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';


export default function Index() {
	const navigation = useNavigation()
	const [messages, setMessages] = useState<MpesaParced[]>([])
	const [balance, setBalance] = useState<number>(0)


	const { success, error } = useMigrations(sqliteDB, migrations)

	useEffect(() => {
		if (success) {
			syncDatabase(sqliteDB)
		}
	}, [success, error])


	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<>
					<IconButton
						icon={({ color, size }) => <Ionicons name="refresh-outline" color={color} size={size - 5} />}
						onPress={() => syncDatabase(sqliteDB)}
					/>
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
			<TodaysTransaction />
		</Body>
	);
}
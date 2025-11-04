import BalanceInfo from "@/components/information/balanceInfo";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { syncDatabase } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { IconButton } from "react-native-paper";

import { sqliteDB } from "@/db/config";
import { getBalance } from "@/db/db_functions";
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';


export default function Index() {
	const navigation = useNavigation()
	const [balance, setBalance] = useState<number>(0)


	const { success, error } = useMigrations(sqliteDB, migrations)

	function syncDB_getBalance() {
			syncDatabase(sqliteDB)
				.then(() => {
					getBalance(sqliteDB)
						.then(setBalance)
				})
	}
	
	useEffect(() => {
		if (success) {
			syncDB_getBalance()
		}
	}, [success, error])


	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<>
					<IconButton
						icon={({ color, size }) => <Ionicons name="refresh-outline" color={color} size={size - 5} />}
						onPress={() => syncDB_getBalance()}
					/>
					<IconButton
						icon={({ color, size }) => <Ionicons name="arrow-redo-outline" color={color} size={size - 5} />}
						onPress={() => router.push('/(home)/page')}
					/>
				</>
			)
		})
	}, [])


	return (
		<Body className="gap-3">
			<BalanceInfo balance={balance} />
			<TodaysTransaction />
		</Body>
	);
}
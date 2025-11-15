import BalanceInfo from "@/components/information/balanceInfo";
import MonthyTransactionSummary from "@/components/ui/summary/monthly";
import WeeklyTransactionSummary from "@/components/ui/summary/weekly";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { sqliteDB } from "@/db/config";
import migrations from '@/drizzle/migrations';
import { getTodaysDate, syncDatabase } from "@/utils/functions";
import { requestSmsPermission } from "@/utils/permissions";
import { Ionicons } from "@expo/vector-icons";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";


export default function Index() {
	const dateObj = new Date
	const navigation = useNavigation()
	const { success, error } = useMigrations(sqliteDB, migrations)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

	useEffect(() => {
		let isMounted = true

		const init = async () => {
			if (!success || error) return // Wait until migration is successful

			const hasPermission = await requestSmsPermission()
			if (!isMounted) return

			if (hasPermission) {
				await syncDatabase(sqliteDB)
				if (isMounted) setIsLoading(false)
			} else {
				console.log("Permission not granted. Skipping sync.")
			}
		}

		init()

		return () => {
			isMounted = false
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
				</>
			)
		})
	}, [navigation])

	if (isLoading) {
		return (
			<Body>
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" />
				</View>
			</Body>
		);
	}

	return (
		<Body>
			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={async () => {
							setIsRefreshing(true)
							await syncDatabase(sqliteDB)
							setIsRefreshing(false)
						}}
					/>
				}
			>
				<View className="gap-3">
					<BalanceInfo />
					<TodaysTransaction />
					<WeeklyTransactionSummary year={dateObj.getFullYear()} month={dateObj.getMonth() + 1} dateInWeek={getTodaysDate()} />
					<MonthyTransactionSummary year={dateObj.getFullYear()} month={dateObj.getMonth() + 1} />
				</View>
			</ScrollView>
		</Body>
	);
}

// Purpose of each transaction to be added on each transaction upon long pressing
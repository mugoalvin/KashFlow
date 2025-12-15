import BalanceInfo from "@/components/information/balanceInfo";
import MonthyTransactionSummary from "@/components/ui/summary/monthly";
import WeeklyTransactionSummary from "@/components/ui/summary/weekly";
import Body from "@/components/views/body";
import TodaysTransaction from "@/components/views/todaysTransactions";
import { sqliteDB } from "@/db/config";
import { categoriesTable } from "@/db/sqlite";
import migrations from '@/drizzle/migrations';
import { addCategoryToDatabase, getTodaysDate, syncDatabase } from "@/utils/functions";
import { requestSmsPermission } from "@/utils/permissions";
import { eq } from "drizzle-orm";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";


export default function Index() {
	const dateObj = new Date
	const { success, error } = useMigrations(sqliteDB, migrations)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
	const [refreshKey, setRefreshKey] = useState<number>(0)

	useEffect(() => {
		let isMounted = true

		const init = async () => {
			if (!success || error) return // Wait until migration is successful

			const hasPermission = await requestSmsPermission()
			if (!isMounted) return

			if (hasPermission) {
				await syncDatabase(sqliteDB)
				const res = await sqliteDB.select().from(categoriesTable).where(eq(categoriesTable.title, "Bills & Fees"))
				if (res.length === 0) {
					await addCategoryToDatabase({
						title: "Bills & Fees",
						icon: "💰"
					})
				}
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


	if (isLoading) {
		return (
			<Body className="justify-center items-center">
				<ActivityIndicator />
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
							setRefreshKey(prev => prev + 1)
							setIsRefreshing(false)
						}}
					/>
				}
			>
				<View className="gap-3">
					<BalanceInfo refreshKey={refreshKey} />
					<TodaysTransaction refreshKey={refreshKey} />
					<WeeklyTransactionSummary year={dateObj.getFullYear()} month={dateObj.getMonth() + 1} dateInWeek={getTodaysDate()} />
					<MonthyTransactionSummary year={dateObj.getFullYear()} month={dateObj.getMonth() + 1} />
				</View>
			</ScrollView>
		</Body>
	);
}
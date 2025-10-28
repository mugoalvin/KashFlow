import useSnackbarContext from "@/contexts/SnackbarContext";
import { sqliteDB } from "@/db/config";
import { MpesaParced } from "@/interface/mpesa";
import { fetchMonthTransaction, groupDatesByWeek } from "@/utils/functions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionList, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import LightText from "../text/lightText";
import DailyTransactionInfo from "./dailyTransactionInfo";

interface MonthlyTransactionInfoProps {
	month: string
	/** parent-provided cached data; if provided (even empty array) the component will skip initial fetch */
	initialData?: MpesaParced[] | null
	/** optional callback to send fetched data back to parent for caching */
	onDataLoaded?: (data: MpesaParced[]) => void
}

export default function MonthlyTransactionInfo({ month, initialData = null, onDataLoaded }: MonthlyTransactionInfoProps) {
	const [monthlyData, setMonthlyData] = useState<MpesaParced[]>(initialData ?? [])
	const [isLoading, setIsLoading] = useState(false)
	const { showSnackbar } = useSnackbarContext()

	useEffect(() => {
		// If parent passed cached data (even empty array), don't fetch again
		if (initialData !== null) return

		let mounted = true
		setIsLoading(true)
		fetchMonthTransaction(sqliteDB, month)
			.then((data) => {
				if (!mounted) return
				setMonthlyData(data)
				if (onDataLoaded) onDataLoaded(data)
			})
			.catch((e: any) => {
				if (!mounted) return
				showSnackbar({
					message: e?.message ?? String(e),
					isError: true
				})
			})
			.finally(() => mounted && setIsLoading(false))

		return () => {
			mounted = false
		}
	}, [month, showSnackbar, initialData, onDataLoaded])

	const sections = useMemo(() => {
		if (!monthlyData.length) return []

		const dateMap = new Map<string, MpesaParced[]>()
		for (const tx of monthlyData) {
			if (!tx.parsedDate) continue
			const list = dateMap.get(tx.parsedDate) ?? []
			list.push(tx)
			dateMap.set(tx.parsedDate, list)
		}

		const allDates = Array.from(dateMap.keys())

		const weeks = groupDatesByWeek(allDates as string[])

		return weeks
			.reverse()
			.map((weekDates, weekIndex) => {
				const weekData = weekDates
					.slice()
					.reverse()
					.map(date => ({
						date,
						transactions: dateMap.get(date) ?? []
					}))

				return {
					title: `Week ${weeks.length - weekIndex}`,
					data: weekData
				}
			})
	}, [monthlyData])

	const renderSectionHeader = useCallback(({ section }: any) => (
		<LightText
			className="mt-6 mb-2 text-lg"
			text={section.title}
		/>
	), [])

	const renderItem = useCallback(({ item }: any) => (
		<View className="flex-row justify-between">
			<Text>{item.date}</Text>
			<Text>Transactions: {item.transactions.length}</Text>
		</View>
		// <DailyTransactionInfo
		// 	date={item.date}
		// 	length={item.transactions.length}
		// 	transactions={item.transactions}
		// />
	), [])

	const renderEmptyComponent = () => (
		<View className="flex-1 aspect-square items-center justify-end pb-16">
			{isLoading ? <ActivityIndicator /> : <LightText text="No transactions for this month" />}
		</View>
	)

	// If loading and we have no data yet, render a full-screen loader so it's always visible
	if (isLoading && monthlyData.length === 0) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<SectionList
			className="flex-1 my-4 w-[100%]"
			sections={sections}
			keyExtractor={(item) => item.date}
			renderSectionHeader={renderSectionHeader}
			renderItem={renderItem}
			// initialNumToRender={10}
			// maxToRenderPerBatch={12}
			// windowSize={11}
			// removeClippedSubviews={true}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={renderEmptyComponent}
		/>
	)
}
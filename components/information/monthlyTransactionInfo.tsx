import useSnackbarContext from "@/contexts/SnackbarContext";
import { sqliteDB } from "@/db/config";
import { MpesaParced } from "@/interface/mpesa";
import { fetchMonthTransaction, groupDatesByWeek } from "@/utils/functions";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import MonthyTransactionSummary from "../ui/summary/monthly";
import WeeklyTransactionSummary from "../ui/summary/weekly";
import SelectWeekDropDown from "../userInput/selectWeekDropDown";
import WeeklyTransactionInfo from "./weeklyTransactionInfo";

interface MonthlyTransactionInfoProps {
	monthDateString: string
	initialData?: MpesaParced[] | null
	onDataLoaded?: (data: MpesaParced[]) => void
}

export default function MonthlyTransactionInfo({ monthDateString, initialData = null, onDataLoaded }: MonthlyTransactionInfoProps) {
	const [monthlyData, setMonthlyData] = useState<MpesaParced[]>(initialData ?? [])
	const [isLoading, setIsLoading] = useState(true)
	const { showSnackbar } = useSnackbarContext()

	const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0)
	const [year, month] = monthDateString.split('-')

	useEffect(() => {
		// If parent passed cached data (even empty array), don't fetch again
		if (initialData !== null) return

		let mounted = true
		fetchMonthTransaction(sqliteDB, monthDateString)
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
	}, [monthDateString, showSnackbar, initialData, onDataLoaded])

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


	if (isLoading && monthlyData.length === 0) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		)
	}

	const currentWeek = sections[selectedWeekIndex]

	return (
		<ScrollView
			className="flex-1 my-4 w-[100%]"
		>
			<SelectWeekDropDown items={sections} setSelectedWeekIndex={setSelectedWeekIndex} selectedWeekIndex={selectedWeekIndex} />

			{currentWeek ? (
				<>
					<WeeklyTransactionInfo item={currentWeek} />

					{currentWeek.data && currentWeek.data.length > 0 && (
						<WeeklyTransactionSummary
							year={Number(year)}
							month={Number(month)}
							dateInWeek={currentWeek.data[currentWeek.data.length - 1].date}
						/>
					)}

					<MonthyTransactionSummary year={Number(year)} month={Number(month)} />
				</>
			) : (
				<View className="flex-1 items-center justify-center p-4">
					<Text>No transactions for this month.</Text>
				</View>
			)}

		</ScrollView>
	)
}
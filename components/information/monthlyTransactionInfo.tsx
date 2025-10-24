import useSnackbarContext from "@/contexts/SnackbarContext";
import { MpesaParced } from "@/interface/mpesa";
import { fetchMonthTransaction, groupDatesByWeek } from "@/utils/functions";
import { useEffect, useMemo, useState } from "react";
import { SectionList, View } from "react-native";
import LightText from "../text/lightText";
import DailyTransactionInfo from "./dailyTransactionInfo";


export default function MonthlyTransactionInfo() {
	const [monthlyData, setMonthlyData] = useState<MpesaParced[]>([])
	const { showSnackbar } = useSnackbarContext()

	useEffect(() => {
		const todaysDate = new Date()
		const year = todaysDate.getFullYear()
		const month = todaysDate.getMonth() + 1

		fetchMonthTransaction(`${year}-${month}`)
			.then(setMonthlyData)
			.catch((e: any) => {
				showSnackbar({
					message: e.messages,
					isError: true
				})
			})
	}, [])

	const sections = useMemo(() => {
		if (!monthlyData.length) return []

		const allDates = Array.from(
			new Set(monthlyData.map(month => month.parsedDate).filter(Boolean))
		)

		const weeks = groupDatesByWeek(allDates as string[])

		return weeks
			.reverse()
			.map((weekDates, weekIndex) => {
				const weekData = weekDates
					.slice()
					.reverse()
					.map(date => ({
						date,
						transactions: monthlyData.filter(tx => tx.parsedDate === date)
					}))

				return {
					title: `Week ${weeks.length - weekIndex}`,
					data: weekData
				}
			})
	}, [monthlyData])


	return (

		<View className="flex-1 my-4">
			<SectionList
				sections={sections}
				keyExtractor={(item) => item.date}
				renderSectionHeader={({ section }) => (
					<LightText
						className="mt-6 mb-2 text-lg"
						text={section.title}
					/>
				)}
				renderItem={({ item }) => (
					<DailyTransactionInfo
						date={item.date}
						length={item.transactions.length}
						transactions={item.transactions}
					/>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	)
}
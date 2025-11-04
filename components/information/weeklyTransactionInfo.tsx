import { MpesaParced } from "@/interface/mpesa";
import { getListOfBalances, getTodaysDate } from "@/utils/functions";
import { storeNavData } from '@/utils/navigationCache';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { Divider, IconButton, Text, useTheme } from "react-native-paper";
import LineGraph from "../ui/graphs/line";

interface WeeklyTransactionInfoProps {
	item: {
		title: string;
		data: {
			date: string;
			transactions: MpesaParced[];
		}[];
	}
}

export default function WeeklyTransactionInfo({ item }: WeeklyTransactionInfoProps) {
	const theme = useTheme()
	const firstItemDataDate = item.data[0]?.date
	const lastItemDataDate = item.data[item.data.length - 1]?.date

	const dateRange = `${formatDate(lastItemDataDate as string)} - ${ getTodaysDate() === firstItemDataDate ? "Today" : formatDate(firstItemDataDate as string)}`

	function formatDate(date: string): string {
		return moment(date).format("ddd, Do")
	}


	// @ts-ignore
	let array = item.data.reduce((acc, day) => acc.concat(day.transactions), []);
	const balances =
		getListOfBalances(array)
			.reverse()
			.map(balanceObj => {
				return {
					value: balanceObj.balance,
					dataPointText: Intl.NumberFormat("en-US").format(balanceObj.balance),
					// label: balanceObj.day
				}
			})


	return (
		<>
			<View className="flex-1 justify-between my-4">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-5">
						<Text className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.elevation.level1 }}>
							{dateRange}
						</Text>
						<Text>{item.data.length} day(s)</Text>
					</View>

					<IconButton
						icon={() => <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />}
						onPress={() => {
							// store the heavy payload in a short-lived in-memory cache
							const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
							storeNavData(id, item.data)
							router.push({ pathname: '/(transactions)/analysis_more', params: { id, dateRange } })
						}}
					/>
				</View>
				<LineGraph data={balances} />
			</View>
			<Divider />
		</>
	)
}
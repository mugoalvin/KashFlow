import { MpesaParced } from "@/interface/mpesa";
import { getListOfBalances } from "@/utils/functions";
import { storeNavData } from '@/utils/navigationCache';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

	// @ts-ignore
	let array = item.data.reduce((acc, day) => acc.concat(day.transactions), []);
	const balances =
		getListOfBalances(array)
			.reverse()
			.map(balance => {
				return {
					value: balance,
					dataPointText: balance.toString()
				}
			})


	return (
		<>
			<View className="flex-1 justify-between my-4">
				<View className="flex-row items-center justify-between">
					<Text>{item.title}</Text>
					<IconButton
						icon={() => <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />}
						onPress={() => {
							// store the heavy payload in a short-lived in-memory cache
							const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
							storeNavData(id, item.data)
							router.push({ pathname: '/(transactions)/analysis_more', params: { id } })
						}}
					/>
				</View>
				<LineGraph
					data={balances}
				/>
			</View>
			<Divider />
		</>
	)
}
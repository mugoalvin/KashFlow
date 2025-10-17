import { MpesaParced } from "@/interface/mpesa";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import Title from "../text/title";
import DailyTransactionInfo from "./dailyTransactionInfo";

interface WeeklyTransactionInfoProps {
	monthlyParsedMessages: MpesaParced[]
	weeklyDates: string[]
}

export default function WeeklyTransactionInfo({ weeklyDates, monthlyParsedMessages }: WeeklyTransactionInfoProps) {
	const theme = useTheme()

	return (
		<View className="my-4">
			<Title color={theme.colors.onSurface} text="This Week" />
			<FlatList
				data={weeklyDates}
				renderItem={({ item, index }) => (
					<DailyTransactionInfo key={index} title={item} index={index} monthlyParsedMessages={monthlyParsedMessages} />
				)}
			/>
		</View>
	)
}
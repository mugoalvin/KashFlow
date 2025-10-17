import { generatePastDates, groupDatesByWeek } from "@/utils/functions";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import WeeklyTransactionInfo from "./weeklyTransactionInfo";


export default function MonthlyTransactionInfo() {

	const monthlyDates = groupDatesByWeek(
		generatePastDates(2)
	)

	return (
		<View className="my-4">
			<FlatList
				data={monthlyDates}
				renderItem={({ item, index }) => (
					<WeeklyTransactionInfo key={index} weeklyDates={item} />
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	)
}
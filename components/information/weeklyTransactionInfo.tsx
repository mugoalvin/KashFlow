import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import LightText from "../text/lightText";
import DailyTransactionInfo from "./dailyTransactionInfo";
import Title from "../text/title";
import { Text, useTheme } from "react-native-paper";

interface WeeklyTransactionInfoProps {
	weeklyDates: string[]
}

export default function WeeklyTransactionInfo({ weeklyDates }: WeeklyTransactionInfoProps) {
	const theme = useTheme()

	return (
		<View className="my-4">
			<Title color={ theme.colors.onSurface } text="This Week" />
			<FlatList
				data={weeklyDates}
				renderItem={({ item, index }) => (
					<DailyTransactionInfo key={index} date={item} index={ index}  />
				)}
			/>
		</View>
	)
}
import { View } from "react-native";
import { LineChart, LineChartBicolor } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";

interface LineGraphProps {
	data: {
		value: number
		dataPointText?: string
	}[]
}

export default function LineGraph({ data }: LineGraphProps) {
	const theme = useTheme()

	return (
		<View className="flex items-center justify-center p-2 w-full rounded-2xl" style={{ backgroundColor: theme.colors.elevation.level1 }}>
			<LineChart
				// areaChart
				// curved

				// isAnimated
				// width={340}
				// initialSpacing={10}
				// hideDataPoints

				data={data}
				color={theme.colors.primary}
				dataPointsColor={theme.colors.primaryContainer}
				hideRules={true}
				yAxisTextStyle={{
					color: theme.colors.onSecondaryContainer,
					fontSize: 10,
				}}
				yAxisColor={theme.colors.tertiary}
				xAxisColor={theme.colors.tertiary}
				thickness={2}

				textColor1="yellow"
				textShiftY={-8}
				textShiftX={-10}
				textFontSize={8}
			/>
		</View>
	)
}
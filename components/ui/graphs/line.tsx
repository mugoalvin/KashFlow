import { Dimensions, View } from "react-native";
import { LineChartBicolor } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";

interface LineGraphProps {
	data: {
		value: number
		dataPointText?: string
		label?: string
	}[]
}

export default function LineGraph({ data }: LineGraphProps) {
	const theme = useTheme()
	// const chartWidth = Dimensions.get('window').width - 65
	const chartWidth = Dimensions.get('window').width - 40
	const dataPointSpacing = chartWidth / (data.length) - 1

	return (
		<View className="flex items-center justify-center py-5 w-full rounded-2xl" style={{ backgroundColor: theme.colors.elevation.level1 }}>
			<LineChartBicolor
				areaChart

				// isAnimated
				width={chartWidth}
				spacing={dataPointSpacing}
				// spacing={20}

				initialSpacing={10}

				hideRules

				data={data}
				dataPointsColor={theme.colors.primaryContainer}
				yAxisTextStyle={{
					color: theme.colors.onSecondaryContainer,
					fontSize: 10,
				}}
				xAxisLabelTextStyle={{
					color: theme.colors.onSecondaryContainer,
					fontSize: 10,
				}}
				yAxisColor={theme.colors.tertiary}
				xAxisColor={theme.colors.tertiary}

				thickness={2}
				hideDataPoints

				textColor="yellow"
				textShiftY={-8}
				textShiftX={-10}
				textFontSize={8}

				// @ts-ignore
				color={theme.colors.success}
				colorNegative={theme.colors.error}


				// @ts-ignore
				startFillColor={theme.colors.successContainer}
				endFillColor={theme.colors.elevation.level1}

				startFillColorNegative={theme.colors.errorContainer}
				endFillColorNegative={theme.colors.elevation.level1}

			/>
		</View>
	)
}
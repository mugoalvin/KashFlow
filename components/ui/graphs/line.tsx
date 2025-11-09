import { Dimensions, View } from "react-native";
import { LineChartBicolor } from "react-native-gifted-charts";
import { Text, useTheme } from "react-native-paper";

interface LineGraphProps {
	data: {
		value: number
		dataPointText?: string
		label?: string
	}[]
}

export default function LineGraph({ data }: LineGraphProps) {
	const theme = useTheme()
	const chartWidth = Dimensions.get('window').width - 40
	const dataPointSpacing = chartWidth / (data.length) - .5


	if (data.every(d => d.value < 0)) {
		return (
			<Text>Render Too expensive</Text>
		)
	}

	if (data.length <= 1 || data === null || data === undefined) {
		return (
			<View className="flex items-center justify-center py-5 w-full rounded-2xl" style={{ backgroundColor: theme.colors.elevation.level1 }}>
				<Text>{data.length} Transaction found</Text>
				<Text>{"Can't plot a chart with 1 data point"}</Text>
			</View>
		)
	}

	return (
		<>
			<Text>
				Transactions: {data.length}
			</Text>
			<View className="flex items-center justify-center py-5 w-full rounded-2xl" style={{ backgroundColor: theme.colors.elevation.level1 }}>
				<LineChartBicolor
					areaChart
					data={data}

					// Basic Chart Styling
					width={chartWidth}
					initialSpacing={5}
					spacing={dataPointSpacing}


					// Rules
					dashWidth={10}
					dashGap={15}
					rulesColor={theme.colors.secondaryContainer}

					// Animations
					isAnimated
					animationDuration={1000}
					onDataChangeAnimationDuration={1000}


					// Line Colors
					dataPointsColor={theme.colors.primaryContainer}
					thickness={2}


					// Data Points
					hideDataPoints
					textColor="yellow"
					textShiftY={-8}
					textShiftX={-10}
					textFontSize={8}


					// Area Colors
					// @ts-ignore
					color={theme.colors.success}
					colorNegative={theme.colors.error}
					// @ts-ignore
					startFillColor={theme.colors.successContainer}
					endFillColor={theme.colors.elevation.level1}

					startFillColorNegative={theme.colors.errorContainer}
					endFillColorNegative={theme.colors.elevation.level1}

					// Axis's Configurations
					yAxisTextStyle={{
						color: theme.colors.onSecondaryContainer,
						fontSize: 10,
					}}
					yAxisColor={theme.colors.tertiary}
					noOfSections={5}

					maxValue={
						Math.ceil(Math.max(...data.map(d => d.value)) / 500) * 500
					}

					xAxisLabelTextStyle={{
						color: theme.colors.onSecondaryContainer,
						fontSize: 10,
					}}
					xAxisColor={theme.colors.tertiary}
				/>
			</View>
		</>
	)
}
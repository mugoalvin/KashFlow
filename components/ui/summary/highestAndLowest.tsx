import { MpesaParced } from "@/interface/mpesa"
import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"

interface HighestAndLowestTrasactionProps {
	highest: MpesaParced
	lowest: MpesaParced
}

export default function HighestAndLowestTrasaction({ highest, lowest }: HighestAndLowestTrasactionProps) {
	const theme = useTheme()

	return (
		<>
			<View className="flex-row items-end justify-between">
				<View>
					<Text style={{ color: theme.colors.onSurfaceDisabled }}>Highest Transaction</Text>
					<Text>{highest.counterparty}</Text>
				</View>
				<View>
					<Text>Ksh { Intl.NumberFormat().format(highest.amount) }</Text>
				</View>
			</View>

			<View className="flex-row items-end justify-between">
				<View>
					<Text style={{ color: theme.colors.onSurfaceDisabled }}>Lowest Transaction</Text>
					<Text>{lowest.counterparty}</Text>
				</View>
				<View>
					<Text>Ksh {Intl.NumberFormat().format(lowest.amount)}</Text>
				</View>
			</View>
		</>
	)
}
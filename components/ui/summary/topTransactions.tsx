import { SortedTransaction } from "@/components/text/interface"
import { View } from "react-native"
import { Text, useTheme } from 'react-native-paper'

interface TopTransactionsProps {
	transactions: SortedTransaction[]
}

export default function TopTransactions({ transactions }: TopTransactionsProps) {
	const theme = useTheme()

	return (
		<View className="gap-7">
			<View className="flex-row justify-between">
				<Text style={{ color: theme.colors.onSurfaceDisabled }}>CounterParty</Text>
				<Text style={{ color: theme.colors.onSurfaceDisabled }}>No. Of Transactions</Text>
				<Text style={{ color: theme.colors.onSurfaceDisabled }}>Total Amount</Text>
			</View>
			{
				transactions.map((transaction, index) =>
					<View key={index} className="flex-row items-end justify-between">
						<View className="w-5/12">
							<Text variant="bodySmall">{transaction.counterparty}</Text>
						</View>
						<View className="w-3/12 items-center gap-1">
							<Text>{transaction.transactionCount}</Text>
						</View>
						<View className="w-4/12 items-end gap-1">
							<Text>Ksh {Intl.NumberFormat("en-US").format(transaction.totalSent)}</Text>
						</View>
					</View>
				)
			}
		</View>
	)
}
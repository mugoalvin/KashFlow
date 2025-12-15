import { SortedTransaction } from "@/components/text/interface"
import { Text as NativeText, View } from "react-native"
import { Text as PaperText, useTheme } from 'react-native-paper'

interface TopTransactionsProps {
	transactions: SortedTransaction[]
}

export default function TopTransactions({ transactions }: TopTransactionsProps) {
	const theme = useTheme()

	return (
		<View className="gap-7">
			<View className="flex-row justify-between">
				<NativeText style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>Counter Party</NativeText>
				<NativeText style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>No. Of Transactions</NativeText>
				<NativeText style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>Total Amount</NativeText>
			</View>
			{
				transactions.map((transaction, index) =>
					<View key={index} className="flex-row items-end justify-between">
						<View className="w-5/12">
							<PaperText variant="bodySmall">{transaction.counterparty}</PaperText>
						</View>
						<View className="w-3/12 items-center gap-1">
							<PaperText>{transaction.transactionCount}</PaperText>
						</View>
						<View className="w-4/12 items-end gap-1">
							<PaperText>Ksh {Intl.NumberFormat("en-US").format(transaction.totalSent)}</PaperText>
						</View>
					</View>
				)
			}
		</View>
	)
}
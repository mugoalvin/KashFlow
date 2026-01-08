import { transactionButtonType } from "@/app/(tabs)/(transactions)"
import useSnackbarContext from "@/contexts/SnackbarContext"
import { MpesaParced, MpesaTransactionType } from "@/interface/mpesa"
import moment from "moment"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { useTheme } from "react-native-paper"
import TransInfoSkeleton from "../skeletons/transInfoSkeleton"
import LightText from "../text/lightText"
import Title from "../text/title"
import TransInfo from "./transInfo"

interface DailyTransactionInfoProps {
	date: string
	transactions: MpesaParced[]
	length: number
	loading: boolean
	transactionType?: transactionButtonType
}

export default function DailyTransactionInfo({ date, transactions, length, loading, transactionType }: DailyTransactionInfoProps) {
	const theme = useTheme()
	const { showSnackbar } = useSnackbarContext()
	const moneyInTransactions: MpesaTransactionType[] = ["receive", "fuliza"]
	const moneyOutTransactions: MpesaTransactionType[] = ["airtime", "send", "payFuliza", "partialFulizaPay", "withdraw"]

	const [transToDisplay, setTransToDisplay] = useState<MpesaParced[]>([])

	useEffect(() => {
		switch (transactionType) {
			case "all":
				setTransToDisplay(transactions)
				break;

			case "moneyIn":
				setTransToDisplay(
					transactions.filter(t => moneyInTransactions.includes(t.type))
				)
				break;

			case "moneyOut":
				setTransToDisplay(
					transactions.filter(t => moneyOutTransactions.includes(t.type))
				)
				break;

			default:
				showSnackbar({
					message: !transactionType ? "No Transaction Type" : `Invalid Transaction Type: ${transactionType}`,
					isError: true
				})
				break;
		}
	}, [transactions, transactionType])


	return (
		<View className="mb-10">
			<View className="flex-row items-baseline justify-between">
				<Title
					color={theme.colors.primary}
					className="mb-2"
					fontSize={theme.fonts.titleMedium.fontSize}
					fontWeight="bold"
					text={moment(date).format("ddd - Do MMM YY")}
				/>
			</View>
			{loading ? (
				[1, 2, 3].map(num =>
					<TransInfoSkeleton key={num} index={num} length={3} />
				)
			) : transToDisplay.length > 0 ? (
				transToDisplay.map((tx, i) => (
					<TransInfo
						key={`${date}-${tx.id}`}
						item={tx}
						index={i}
						length={transToDisplay.length}
					/>
				))
			) : (
				<View className="h-20 justify-center items-center">
					<LightText text="No Transactions Made This Day" />
				</View>
			)}
		</View>
	)
}
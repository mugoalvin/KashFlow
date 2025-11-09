import { MpesaParced } from "@/interface/mpesa"
import moment from "moment"
import { View } from "react-native"
import LightText from "../text/lightText"
import TransInfo from "./transInfo"

interface DailyTransactionInfoProps {
	date: string
	transactions: MpesaParced[]
	length: number
}

export default function DailyTransactionInfo({ date, transactions, length }: DailyTransactionInfoProps) {

	return (
		<View className="mb-4">
			<View className="flex-row items-baseline justify-between">
				<LightText
					className="mb-2"
					text={moment(date).format("ddd - Do MMM YY")}
				/>
			</View>
			{length ? (
				transactions.map((tx, i) => (
					<TransInfo
						key={`${date}-${i}`}
						item={tx}
						index={i}
						length={length}
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
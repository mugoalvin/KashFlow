import useSnackbarContext from "@/contexts/SnackbarContext"
import { Mpesa } from "@/interface/mpesa"
import { fetchDailyTransaction } from "@/utils/functions"
import moment from "moment"
import { useEffect, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import LightText from "../text/lightText"
import TransInfo from "./transInfo"
import { Text, useTheme } from "react-native-paper"
import { View } from "react-native"

interface DailyTransactionInfoProps {
	date: string
	index: number
}

export default function DailyTransactionInfo({ date }: DailyTransactionInfoProps) {
	const theme = useTheme()
	const { showSnackbar } = useSnackbarContext()
	const [messages, setMessages] = useState<Mpesa[]>([])

	useEffect(() => {
		fetchDailyTransaction(date)
			.then(data => {
				setMessages(data as Mpesa[])
			})
			.catch((e: any) => {
				showSnackbar({
					message: e.message,
					isError: true
				})
			})
	}, [])

	return (
		<>
			<LightText className="mt-5 mb-2" text={`${moment(date).format('dddd')} - ${date}`} />
			<FlatList
				data={messages}
				renderItem={({ item, index }) => (
					<TransInfo
						item={item}
						index={index}
						length={messages.length}
					/>
				)}
				ListEmptyComponent={
					<View className="h-24 items-center justify-center">
						<Text style={{ color: theme.colors.onPrimaryContainer }}>No Transactions Made This Day</Text>
					</View>
				}
			/>
		</>
	)
}
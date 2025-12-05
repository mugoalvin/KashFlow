import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getMoneyInAndOut, getTodaysDate } from "@/utils/functions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import Title from "../text/title";
import TransactionSummary from "../ui/summary/transaction";
import AppCarousel from "./carousel";

interface TodaysTransactionProps {
	refreshKey: number
}

export default function TodaysTransaction({ refreshKey }: TodaysTransactionProps) {
	const theme = useTheme()
	const [todaysTransactionParsedMessages, setTodaysTransactionParsedMessages] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)


	async function getMessages() {
		const todaysMessages = await sqliteDB
			.select()
			.from(mpesaMessages)
			.where(eq(mpesaMessages.parsedDate, getTodaysDate()))
			.orderBy(desc(mpesaMessages.id)) as MpesaParced[]

		setTodaysTransactionParsedMessages(todaysMessages)
	}

	useEffect(() => {
		const { receive, send } = getMoneyInAndOut(todaysTransactionParsedMessages)

		setMoneySend(send)
		setMoneyReceived(receive)

	}, [todaysTransactionParsedMessages])

	useEffect(() => {
		getMessages()
	}, [refreshKey])

	return (
		<>
			<Title
				leadingIcon={<Ionicons name='calendar-number-sharp' size={16} color={theme.colors.primary} />}
				text="Today's Transactions"
				trailingIcon={
					<IconButton
						icon={() =>
							<MaterialIcons
								name="sort"
								size={16}
								color={theme.colors.primary}
							/>
						}
						onPress={() => { }}
					/>
				}
			/>

			{
				todaysTransactionParsedMessages.length === 0
					?
					<View className="flex-1 items-center justify-center">
						<Text style={{ color: theme.colors.onSurfaceDisabled }}>No transactions made today</Text>
					</View>
					:
					<AppCarousel
						data={todaysTransactionParsedMessages}
					/>
			}

			<TransactionSummary
				title="Today's Summary"
				moneyIn={moneyReceived}
				moneyOut={moneySend}
			/>
		</>
	)
}
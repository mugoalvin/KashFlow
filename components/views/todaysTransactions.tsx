import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getMoneyInAndOut, getTodaysDate } from "@/utils/functions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { IconButton, Text, useTheme } from "react-native-paper";
import Title from "../text/title";
import TransactionSummary from "../ui/summary/transactionSummary";
import AppCarousel from "./carousel";

interface TodaysTransactionProps {
	refreshKey: number
}

export default function TodaysTransaction({ refreshKey }: TodaysTransactionProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')
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
			<View className={`${!useCard && 'px-2 rounded-lg'}`} style={{ backgroundColor: !useCard ? theme.colors.elevation.level2 : theme.colors.background }}>

				<Title
					text="Today's Transactions"
					color={theme.colors.onSurface}
					leadingIcon={
						<Ionicons name='calendar-number-sharp' size={16} color={theme.colors.primary} />
					}
					trailingIcon={
						<IconButton
							icon={() =>
								<MaterialIcons
									name="sort"
									size={16}
									color={theme.colors.background}
								/>
							}
						/>
					}
				/>
			</View>

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
				trailingIcon={
					<IconButton
						icon={() =>
							<MaterialIcons
								name="sort"
								size={16}
								color={theme.colors.background}
							/>
						}
					/>
				}
			/>
		</>
	)
}
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getHighestAndLowestTransaction, getMoneyInAndOut, getTodaysDate } from "@/utils/functions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import TransInfo from "../information/transInfo";
import Title from "../text/title";
import TransactionSummary from "../ui/summary/transaction";


export default function TodaysTransaction() {
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
	}, [])

	function EmptyComponent() {
		return (
			<View className="items-center justify-center" style={{ height: 310 }}>
				<Text style={{ color: theme.colors.onSurfaceDisabled }}>No Transactions Today</Text>
			</View>
		)
	}


	return (
		<>
			{/* <Title
				leadingIcon={<Ionicons name='calendar-number-sharp' size={16} color={theme.colors.primary} />}
				text="Todays Transactions"
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
			/> */}

			{/* <FlatList
				style={{
					// minHeight: 300,
					maxHeight: 310,
				}}
				contentContainerStyle={{
					justifyContent: 'center',
				}}

				// className="flex-1"
				data={todaysTransactionParsedMessages}
				renderItem={({ item, index }) =>
					<TransInfo key={index} item={item} index={index} length={todaysTransactionParsedMessages.length} />
				}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={() => <EmptyComponent />}
			/> */}

			<TransactionSummary
				title="Todays Summary"
				moneyIn={moneyReceived}
				moneyOut={moneySend}
			/>
		</>
	)
}
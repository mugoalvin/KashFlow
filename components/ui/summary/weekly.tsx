import { SortedTransaction, TransactionSortMode } from "@/components/text/interface";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getDatesInMonth, getMoneyInAndOut, getTopCounterparties, groupDatesByWeek } from "@/utils/functions";
import { MaterialIcons } from "@expo/vector-icons";
import { inArray } from "drizzle-orm";
import { useEffect, useState } from "react";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdown-menu";
import TransactionSummary from "./transaction";

interface WeeklyTransactionSummaryProps {
	year: number
	month: number
	dateInWeek: string
}

export default function WeeklyTransactionSummary({ year, month, dateInWeek }: WeeklyTransactionSummaryProps) {
	const theme = useTheme()
	const [weekTransactions, setWeekTransactions] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)
	const [datesInThisWeek, setDatesInThisWeek] = useState<string[]>([])
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

	const [topTransactions, setWeeklyTopTransactions] = useState<SortedTransaction[]>([])
	const [weeklySortType, setWeeklySortType] = useState<TransactionSortMode>('amount')

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};


	useEffect(() => {
		setDatesInThisWeek(
			groupDatesByWeek(
				getDatesInMonth(year, month)
			)
				.find(week =>
					week.includes(dateInWeek)
				) as string[]
		)
	}, [year, month, dateInWeek])

	useEffect(() => {
		if (datesInThisWeek.length === 0) return;
		(async () => {
			const transactions = await sqliteDB
				.select()
				.from(mpesaMessages)
				.where(inArray(mpesaMessages.parsedDate, datesInThisWeek)) as MpesaParced[];

			setWeekTransactions(transactions);
		})();
	}, [datesInThisWeek]);


	useEffect(() => {
		const { receive, send } = getMoneyInAndOut(weekTransactions)

		setMoneySend(send)
		setMoneyReceived(receive)
		setIsPageLoading(false)
	}, [weekTransactions])

	useEffect(() => {
		setWeeklyTopTransactions(
			getTopCounterparties(weekTransactions, weeklySortType)
		)
	}, [weekTransactions, weeklySortType])

	return (
		<TransactionSummary
			title={"Weekly Summary"}
			moneyIn={moneyReceived}
			moneyOut={moneySend}
			trailingIcon={
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<IconButton icon={() => <MaterialIcons name="sort" color={theme.colors.primary} size={16} />} />
					</DropdownMenuTrigger>

					<DropdownMenuContent insets={contentInsets} sideOffset={2} className="w-56" align="start" style={{ backgroundColor: theme.colors.secondaryContainer }}>
						<DropdownMenuLabel>Sort By</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>

							<DropdownMenuItem onPress={() => setWeeklySortType('amount')} android_ripple={{ color: 'red', borderless: false }}>
								<Text style={{ color: theme.colors.onSecondaryContainer }}>Cummulative Amount</Text>
							</DropdownMenuItem>
							<DropdownMenuItem onPress={() => setWeeklySortType('count')}>
								<Text style={{ color: theme.colors.onSecondaryContainer }}>Number Of Counts</Text>
							</DropdownMenuItem>

						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			}

			isLoading={isPageLoading}
			topTransactions={topTransactions}
		/>
	)
}
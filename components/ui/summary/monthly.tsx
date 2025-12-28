import { SortedTransaction, TransactionSortMode } from "@/components/text/interface"
import { sqliteDB } from "@/db/config"
import { mpesaMessages } from "@/db/sqlite"
import { MpesaParced } from "@/interface/mpesa"
import { getDatesInMonth, getHighestAndLowestTransaction, getMoneyInAndOut, getTopCounterparties } from "@/utils/functions"
import { MaterialIcons } from "@expo/vector-icons"
import { inArray } from "drizzle-orm"
import React, { useEffect, useRef, useState } from "react"
import { IconButton, Text, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdown-menu"
import TransactionSummary from "./transactionSummary"

interface MonthyTransactionSummaryProps {
	year: number
	month: number
}

export default function MonthyTransactionSummary({ year, month }: MonthyTransactionSummaryProps) {
	const theme = useTheme()
	const [monthTransactions, setMonthTransactions] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)

	const [sortType, setSortType] = useState<TransactionSortMode>('amount')
	const [highestTrasaction, setHighestTrasaction] = useState<MpesaParced>()
	const [lowestTrasaction, setLowestTrasaction] = useState<MpesaParced>()
	const [topTransactions, setTopTransactions] = useState<SortedTransaction[]>([])

	const datesInMonth = useRef<string[]>([])
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};

	datesInMonth.current =
		getDatesInMonth(year, month)

	async function fetchThisMonthTransactions() {
		const transactions = await sqliteDB
			.select()
			.from(mpesaMessages)
			.where(inArray(mpesaMessages.parsedDate, datesInMonth.current)) as MpesaParced[]


		setMonthTransactions(transactions)
	}

	useEffect(() => {
		fetchThisMonthTransactions()
	}, [])

	useEffect(() => {
		const { receive, send } = getMoneyInAndOut(monthTransactions)

		setMoneySend(send)
		setMoneyReceived(receive)

		const { highest, lowest } = getHighestAndLowestTransaction(monthTransactions)

		setHighestTrasaction(highest as MpesaParced)
		setLowestTrasaction(lowest as MpesaParced)

	}, [monthTransactions])

	useEffect(() => {
		setTopTransactions(
			getTopCounterparties(monthTransactions, sortType)
		)
	}, [monthTransactions, sortType])

	return (
		<TransactionSummary
			title={"Monthly Summary"}
			trailingIcon={
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<IconButton icon={() => <MaterialIcons name="sort" color={theme.colors.primary} size={16} />} />
					</DropdownMenuTrigger>

					<DropdownMenuContent insets={contentInsets} sideOffset={2} className="w-56" align="start" style={{ backgroundColor: theme.colors.secondaryContainer }}>
						<DropdownMenuLabel>Sort By</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>

							<DropdownMenuItem onPress={() => setSortType('amount')} android_ripple={{ color: theme.colors.secondaryContainer }} >
								<Text style={{ color: theme.colors.onSecondaryContainer }}>Cummulative Amount</Text>
							</DropdownMenuItem>
							<DropdownMenuItem onPress={() => setSortType('count')}>
								<Text style={{ color: theme.colors.onSecondaryContainer }}>Number Of Counts</Text>
							</DropdownMenuItem>

						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			}
			moneyIn={moneyReceived}
			moneyOut={moneySend}

			topTransactions={topTransactions}
			highest={highestTrasaction}
			lowest={lowestTrasaction}
		/>
	)
}
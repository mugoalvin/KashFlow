import { SortedTransaction, TransactionSortMode } from "@/components/text/interface"
import SummaryDropDown from "@/components/userInput/summaryDropDown"
import { sqliteDB } from "@/db/config"
import { mpesaMessages } from "@/db/sqlite"
import { MpesaParced } from "@/interface/mpesa"
import { getDatesInMonth, getHighestAndLowestTransaction, getMoneyInAndOut, getTopCounterparties } from "@/utils/functions"
import { inArray } from "drizzle-orm"
import React, { useEffect, useRef, useState } from "react"
import TransactionSummary from "./transactionSummary"

interface MonthyTransactionSummaryProps {
	year: number
	month: number
}

export default function MonthyTransactionSummary({ year, month }: MonthyTransactionSummaryProps) {
	const [monthTransactions, setMonthTransactions] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true)


	const [sortType, setSortType] = useState<TransactionSortMode>('amount')
	const [highestTrasaction, setHighestTrasaction] = useState<MpesaParced>()
	const [lowestTrasaction, setLowestTrasaction] = useState<MpesaParced>()
	const [topTransactions, setTopTransactions] = useState<SortedTransaction[]>([])
	const [isAscending, setIsAscending] = useState<boolean>(false)
	const [noTransactions, setNoTransactions] = useState<number>(3)

	const datesInMonth = useRef<string[]>([])

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
		setIsPageLoading(false)
	}, [monthTransactions])

	useEffect(() => {
		setTopTransactions(
			getTopCounterparties(monthTransactions, sortType, isAscending, noTransactions)
		)
	}, [monthTransactions, sortType, isAscending, noTransactions])

	return (
		<TransactionSummary
			title={"Monthly Summary"}
			moneyIn={moneyReceived}
			moneyOut={moneySend}
			isLoading={isPageLoading}
			topTransactions={topTransactions}
			highest={highestTrasaction}
			lowest={lowestTrasaction}

			isAscending={isAscending}
			currentSortType={sortType}
			setSortType={setSortType}
			setOrderType={setIsAscending}

			trailingIcon={
				<SummaryDropDown setNoTransactions={setNoTransactions} />
			}
		/>
	)
}
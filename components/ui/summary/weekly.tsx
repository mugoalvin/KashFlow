import { SortedTransaction, TransactionSortMode } from "@/components/text/interface";
import SummaryDropDown from "@/components/userInput/summaryDropDown";
import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getDatesInMonth, getMoneyInAndOut, getTopCounterparties, groupDatesByWeek } from "@/utils/functions";
import { inArray } from "drizzle-orm";
import { useEffect, useState } from "react";
import TransactionSummary from "./transactionSummary";

interface WeeklyTransactionSummaryProps {
	year: number
	month: number
	dateInWeek: string
}

export default function WeeklyTransactionSummary({ year, month, dateInWeek }: WeeklyTransactionSummaryProps) {
	const [weekTransactions, setWeekTransactions] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)
	const [datesInThisWeek, setDatesInThisWeek] = useState<string[]>([])
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

	const [topTransactions, setWeeklyTopTransactions] = useState<SortedTransaction[]>([])
	const [weeklySortType, setWeeklySortType] = useState<TransactionSortMode>('amount')
	const [isAscending, setIsAscending] = useState<boolean>(false)
	const [noTransactions, setNoTransactions] = useState<number>(3)


	useEffect(() => {
		const week = groupDatesByWeek(getDatesInMonth(year, month)).find(week =>
			week.includes(dateInWeek)
		)

		setDatesInThisWeek(week ?? [])
	}, [year, month, dateInWeek])

	useEffect(() => {
		if (!datesInThisWeek || datesInThisWeek.length === 0) return;
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
			getTopCounterparties(weekTransactions, weeklySortType, isAscending, noTransactions)
		)
	}, [weekTransactions, weeklySortType, isAscending, noTransactions])

	return (
		<TransactionSummary
			title={"Weekly Summary"}
			moneyIn={moneyReceived}
			moneyOut={moneySend}
			isLoading={isPageLoading}
			topTransactions={topTransactions}

			isAscending={isAscending}
			currentSortType={weeklySortType}
			setSortType={setWeeklySortType}
			setOrderType={setIsAscending}

			trailingIcon={
				<SummaryDropDown setNoTransactions={setNoTransactions} />
			}
		/>
	)
}
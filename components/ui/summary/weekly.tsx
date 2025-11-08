import { sqliteDB } from "@/db/config";
import { mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { getDatesInMonth, getMoneyInAndOut, getTodaysDate, groupDatesByWeek } from "@/utils/functions";
import { inArray } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import TransactionSummary from "./transaction";

export default function WeeklyTransactionSummary() {
	const [weekTransactions, setWeekTransactions] = useState<MpesaParced[]>([])
	const [moneySend, setMoneySend] = useState<number>(0)
	const [moneyReceived, setMoneyReceived] = useState<number>(0)

	const datesInThisWeek = useRef<string[]>([])

	const dateObj = new Date()

	datesInThisWeek.current =
		groupDatesByWeek(
			getDatesInMonth(dateObj.getFullYear(), dateObj.getMonth() + 1)
		)
			.find(week =>
				week.includes(getTodaysDate())
			) as string[]

	async function fetchThisWeeksTransactions() {
		const transactions = await sqliteDB
			.select()
			.from(mpesaMessages)
			.where(inArray(mpesaMessages.parsedDate, datesInThisWeek.current)) as MpesaParced[]

		setWeekTransactions(transactions)
	}

	useEffect(() => {
		fetchThisWeeksTransactions()
	}, [])

	useEffect(() => {
		const { receive, send } = getMoneyInAndOut(weekTransactions)

		setMoneySend(send)
		setMoneyReceived(receive)
	}, [weekTransactions])

	return (
		<TransactionSummary
			title={"Weekly Summary"}
			moneyIn={moneyReceived}
			moneyOut={moneySend}
		/>
	)
}
import { Category, TransactionSortMode } from "@/components/text/interface";
import { sqliteDB } from "@/db/config";
import { categoriesTable, mpesaMessages } from "@/db/sqlite";
import { Mpesa, MpesaParced, MpesaTransactionType, typeMap } from "@/interface/mpesa";
import { desc, eq, isNull, or, sql } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import moment from "moment";
import { NativeModules } from 'react-native';
import { extractAirtimeDetails, extractAmount, extractFulizaDetails, extractPartialFulizaPay, extractPayFulizaDetails, extractReceiveDetails, extractSendDetails, extractWithdrawDetails } from "./extractDetails";

const { SmsReader } = NativeModules


function parseDate(inputString: string) {
	const dateObj = new Date(inputString);

	if (isNaN(dateObj.getTime())) {
		throw new Error("Invalid date format");
	}

	const date = dateObj.toISOString().split("T")[0];
	const time = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

	return { date, time };
}


// export function parseMpesaMessage(messageID: string, message: string, date: string): MpesaParced {
export function parseMpesaMessage(messageID: string, message: string, date: string) {
	const id = Number(messageID)
	let
		account: string | undefined,
		balance: number | undefined,
		counterparty: string | undefined,
		dueDate: string | undefined,
		fee: number | undefined,
		limit: number | undefined,
		number: string | undefined,
		outstanding: number | undefined,
		paid: number | undefined,
		parsedTime: string | undefined,
		parsedDate: string | undefined,
		transactionCost: number | undefined

	let type: MpesaTransactionType = 'send';

	for (const keyword in typeMap) {
		if (message.includes(keyword)) {
			type = typeMap[keyword];
			break;
		}
	}

	let amount = extractAmount(message)

	const balanceMatch = message.match(/New M-PESA balance is Ksh([\d,]+\.\d{2})/);
	balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : undefined;

	const transactionCostMatch = message.match(/Transaction cost, Ksh([\d]+\.\d{2})/);
	transactionCost = transactionCostMatch ? parseFloat(transactionCostMatch[1]) : undefined;

	if (type === 'airtime') {
		const { extractedAmount, extractedBalance, extractedTransactionCost } = extractAirtimeDetails(message)
		counterparty = "Airtime Purchase"
		amount = extractedAmount
		balance = extractedBalance
		transactionCost = extractedTransactionCost
	}

	if (type === "fuliza") {
		const { extractedAmount, extractedDueDate, extractedFee, extractedOutstanding } = extractFulizaDetails(message)
		counterparty = "Fuliza Borrowed"
		amount = extractedAmount
		dueDate = extractedDueDate
		fee = extractedFee
		outstanding = extractedOutstanding
	}

	if (type === "payFuliza") {
		const { extractedBalance, extractedLimit, extractedPaid } = extractPayFulizaDetails(message)
		counterparty = "Full Fuliza Payment"
		balance = extractedBalance
		limit = extractedLimit
		paid = extractedPaid
	}

	if (type === "partialFulizaPay") {
		const { extractedBalance, extractedLimit } = extractPartialFulizaPay(message)
		counterparty = "Fartial Fuliza Payment"
		balance = extractedBalance
		limit = extractedLimit
	}

	if (type === 'receive') {
		const { extractedCounterParty, extractedNumber } = extractReceiveDetails(message)
		counterparty = extractedCounterParty
		number = extractedNumber
	}

	if (type === 'send') {
		const { extractedAccount, extractedCounterParty, extractedNumber } = extractSendDetails(message)
		account = extractedAccount
		counterparty = extractedCounterParty
		number = extractedNumber
	}

	if (type === 'withdraw') {
		counterparty = extractWithdrawDetails(message)
	}

	parsedDate = parseDate(date)?.date
	parsedTime = parseDate(date)?.time

	return { id, type, amount, account, counterparty, dueDate, fee, limit, message, number, outstanding, paid, balance, transactionCost, parsedDate, parsedTime }
}


export function calculateMpesaBalance(parsedMessages: any[]): { balance: number; limit: number | null } {
	let foundBalance: number | null = null;
	let foundOutstanding: number | null = null;
	let foundLimit: number | null = null;

	for (let i = 0; i < parsedMessages.length; i++) {
		const msg = parsedMessages[i];

		if (msg.balance && msg.balance > 0 && foundBalance === null) {
			foundBalance = msg.balance;
		}

		if ((msg.balance === 0 || msg.balance == null) && msg.outstanding && foundOutstanding === null) {
			foundOutstanding = msg.outstanding * -1;
		}

		if (msg.limit && foundLimit === null) {
			foundLimit = msg.limit;
		}

		if (foundBalance !== null && foundLimit !== null) {
			return { balance: foundBalance, limit: foundLimit };
		}

		if (foundOutstanding !== null && foundLimit !== null) {
			return { balance: foundOutstanding, limit: foundLimit };
		}
	}

	if (foundBalance !== null) {
		return { balance: foundBalance, limit: foundLimit };
	}

	if (foundOutstanding !== null) {
		return { balance: foundOutstanding, limit: foundLimit };
	}

	return { balance: 0, limit: null };
}



export function getListOfBalances(parsedMessages: any[]): { day: string, balance: number }[] {
	return parsedMessages.map(msg => {
		const balance = msg.balance && msg.balance !== 0 ?
			msg.balance :
			msg.outstanding && msg.outstanding * -1

		const day = moment(msg.parsedDate).format('ddd')

		return {
			day,
			balance
		}
	}

	).filter(value => value.balance)
}


export async function fetchLastTransactionId(db: ExpoSQLiteDatabase): Promise<number> {
	const val = await db
		.select()
		.from(mpesaMessages)
		.orderBy(desc(mpesaMessages.id))
		.limit(1)

	return val[0]?.id || 2
}

export async function fetchLatestTransactions(lastMgsId: number) {
	const latestTransactions = await SmsReader.getLatestMessages("Mpesa", lastMgsId) as Mpesa[]
	return latestTransactions.map(transaction =>
		parseMpesaMessage(transaction.id, transaction.body, transaction.date)
	)
}

export async function fetchDailyTransaction(date: string) {
	const transactions = await SmsReader.getInboxFilteredByDate("Mpesa", date) as Mpesa[]
	return transactions.map(transaction =>
		parseMpesaMessage(transaction.id, transaction.body, transaction.date)
	)
}

export async function fetchMonthTransaction(db: ExpoSQLiteDatabase, month: string) {
	return await db
		.select()
		.from(mpesaMessages)
		.orderBy(desc(mpesaMessages.id))
		.where(sql`${mpesaMessages.parsedDate} LIKE ${month + '%'}`) as MpesaParced[]
}

export function groupDatesByWeek(dates: string[]) {
	if (dates.length <= 1) return []

	// Filter empty strings, remove duplicates, and sort chronologically
	const uniqueDates = Array.from(new Set(dates.filter(Boolean))).sort(
		(a, b) => moment(a).valueOf() - moment(b).valueOf()
	)

	const moments = uniqueDates.map(d => moment(d))
	const grouped: moment.Moment[][] = []

	let currentWeek: moment.Moment[] = []
	let currentWeekStart = moments[0].clone().startOf("week")

	for (const d of moments) {
		const weekStart = d.clone().startOf("week")
		if (!weekStart.isSame(currentWeekStart, "day")) {
			grouped.push(currentWeek)
			currentWeek = []
			currentWeekStart = weekStart
		}
		currentWeek.push(d)
	}

	if (currentWeek.length) grouped.push(currentWeek)

	// Return array of arrays of strings
	return grouped.map(week => week.map(d => d.format("YYYY-MM-DD")))
}


export function generatePastDates(daysBack: number): string[] {
	const today = moment().startOf("day");
	const dates = [];

	for (let i = 0; i < daysBack; i++) {
		dates.push(today.clone().subtract(i, "days").format("YYYY-MM-DD"));
	}

	return dates;
}


export async function syncDatabase(db: ExpoSQLiteDatabase) {
	try {
		const lastId = await fetchLastTransactionId(db)
		const transactions = await fetchLatestTransactions(lastId) as MpesaParced[]

		await db.transaction(async (tx) => {
			for (const transaction of transactions) {
				const previous = await tx.select({
					categoryId: mpesaMessages.categoryId
				})
					.from(mpesaMessages)
					.where(eq(mpesaMessages.counterparty, transaction.counterparty!))
					.orderBy(desc(mpesaMessages.id))
					.limit(1)

				if (previous.length && typeof previous[0].categoryId === 'number') {
					transaction.categoryId = previous[0].categoryId
				}

				// @ts-ignore
				await tx.insert(mpesaMessages).values(transaction);
			}
		})

		await db.delete(mpesaMessages).where(
			or(
				eq(mpesaMessages.counterparty, ""),
				isNull(mpesaMessages.counterparty)
			)
		)
	}
	catch (e: any) {
		console.error("Syncronization Failure: ", e.message)
	}
}


export function getYearsFrom(year: number): number[] {
	const currentYear = new Date().getFullYear()
	const years = []
	for (let y = year; y <= currentYear; y++) {
		years.push(y)
	}
	return years
}


export function getTodaysDate(): string {
	const date = new Date()
	return date.getFullYear().toString()
		.concat("-")
		.concat((date.getMonth() + 1).toString().padStart(2, '0'))
		.concat("-")
		.concat((date.getDate()).toString().padStart(2, '0'))
}


export function getMoneyInAndOut(transactions: MpesaParced[]): { receive: number, send: number } {

	// console.log(
	// 	transactions
	// 		.filter(t => t.type === "withdraw")
	// 		.reduce((sum, t) => sum + t.amount, 0)
	// )

	if (transactions.length === 0) return { receive: 0, send: 0 }

	let receive: number = 0
	let send: number = 0

	for (const { type, amount } of transactions) {
		if (type === 'receive') receive += amount
		else if (type === 'send') send += amount
	}

	return {
		receive,
		send
	}
}

export function getDatesInMonth(year: number, month: number): string[] {
	const dates: string[] = []
	const lastDay = new Date(year, month, 0).getDate()

	for (let day = 1; day <= lastDay; day++) {
		const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		dates.push(formatted)
	}

	return dates
}


export function getHighestAndLowestTransaction(transactions: MpesaParced[]) {
	const valid = transactions.filter(t => t.amount != null)

	if (valid.length === 0) return { highest: null, lowest: null };

	let highest = valid[0]
	let lowest = valid[0]

	for (const transaction of valid) {
		if (transaction.amount > highest.amount) highest = transaction
		if (transaction.amount < lowest.amount) lowest = transaction
	}

	return {
		highest,
		lowest
	}
}


export function getTopCounterparties(transactions: MpesaParced[], sortBy: TransactionSortMode, numberOfTransactions?: number) {
	const totals = new Map<string, { totalSent: number; totalReceived: number; count: number; type: MpesaTransactionType }>();

	for (const tx of transactions) {
		const entry = totals.get(tx.counterparty || '') || {
			totalSent: 0,
			totalReceived: 0,
			count: 0,
			type: 'send' as MpesaTransactionType
		};

		if (tx.type === "send") {
			entry.type = tx.type
			entry.totalSent += tx.amount;
			entry.count += 1;
		} else if (tx.type === "receive") {
			entry.type = tx.type
			entry.totalReceived += tx.amount;
		}

		totals.set(tx.counterparty || '', entry);
	}

	const sorted = Array.from(totals.entries())
		.map(([counterparty, data]) => ({
			counterparty,
			totalSent: data.totalSent,
			transactionCount: data.count,
			type: data.type,
		}))
		.sort((a, b) =>
			sortBy === "count"
				? b.transactionCount - a.transactionCount
				: b.totalSent - a.totalSent
		)
		.slice(0, numberOfTransactions || 3)

	return sorted;
}


export function chunkArray<T>(arr: T[], size: number) {
	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}


export async function addCategoryToDatabase(category: Omit<Category, "id" | "name">) {

	function generateName(title: string) {
		return title.replaceAll(" ", "_").toLowerCase()
	}

	try {
		return await sqliteDB
			.insert(categoriesTable)
			.values({
				title: category.title,
				name: generateName(category.title),
				icon: category.icon
			})
	} catch (err: any) {
		console.error(err)
		throw new Error(err.message)
	}
}
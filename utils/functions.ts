import { Mpesa, MpesaParced, MpesaTransactionType, typeMap } from "@/interface/mpesa";
import moment from "moment";
import { NativeModules, ToastAndroid } from 'react-native';
import { extractAmount, extractFulizaDetails, extractPartialFulizaPay, extractPayFulizaDetails, extractReceiveDetails, extractSendDetails, extractWithdrawDetails } from "./extractDetails";

const { SmsReader } = NativeModules


const parseDate = (raw: string | undefined) => {
	if (!raw) return;

	const [d, m, yAndTime] = raw.split("/");
	const [y] = yAndTime.split(" at ");

	const day = d.padStart(2, "0");
	const month = m.padStart(2, "0");
	const year = `20${y}`;

	return `${year}-${month}-${day}`;
}


export function parseMpesaMessage(message: string): MpesaParced {
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
		rawTime: string | undefined,
		parsedDate: string | undefined,
		transactionCost: number | undefined

	let type: MpesaTransactionType = 'send';

	for (const keyword in typeMap) {
		if (message.includes(keyword)) {
			type = typeMap[keyword];
			break;
		}
	}


	const amount = extractAmount(message)

	const timeMatch = message.match(/on ([\d\/]+ at [\d:]+ [AP]M)/);
	rawTime = timeMatch ? timeMatch[1] : undefined;

	const balanceMatch = message.match(/New M-PESA balance is Ksh([\d,]+\.\d{2})/);
	balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : undefined;

	const transactionCostMatch = message.match(/Transaction cost, Ksh([\d]+\.\d{2})/);
	transactionCost = transactionCostMatch ? parseFloat(transactionCostMatch[1]) : undefined;


	if (type === "fuliza") {
		const { extractedAmount, extractedDueDate, extractedFee, extractedOutstanding } = extractFulizaDetails(message)
		// amount = extractedAmount
		dueDate = extractedDueDate
		fee = extractedFee
		outstanding = extractedOutstanding
	}

	if (type === "payFuliza") {
		const { extractedBalance, extractedLimit, extractedPaid } = extractPayFulizaDetails(message)
		balance = extractedBalance
		limit = extractedLimit
		paid = extractedPaid
	}

	if (type === "partialFulizaPay") {
		const { extractedAmount, extractedBalance, extractedLimit } = extractPartialFulizaPay(message)
		// amount = extractedAmount
		balance = extractedBalance
		limit = extractedLimit
	}

	if (type === 'receive') {
		const { extractedCounterParty, extractedNumber } = extractReceiveDetails(message)
		counterparty = extractedCounterParty
		number = extractedNumber
	}

	if (type === 'send') {
		const { extractedAmount, extractedCounterParty, extractedNumber } = extractSendDetails(message)
		account = extractedAmount
		counterparty = extractedCounterParty
		number = extractedNumber
	}

	if (type === 'withdraw') {
		extractWithdrawDetails(message)
	}


	parsedDate = parseDate(rawTime)

	// @ts-ignore
	return { type, amount, account, counterparty, dueDate, fee, limit, message, number, outstanding, paid, rawTime, balance, transactionCost, parsedDate };
}




export async function fetchSMSMessage(limit: number) {
	try {
		const mpesaMsgs = await SmsReader.getInboxFiltered("Mpesa", limit) as Mpesa[]
		ToastAndroid.showWithGravity(
			`Found ${mpesaMsgs.length}`,
			ToastAndroid.LONG,
			ToastAndroid.BOTTOM,
		)
		return mpesaMsgs
	}
	catch (e: any) {
		ToastAndroid.showWithGravity(
			e.message,
			ToastAndroid.LONG,
			ToastAndroid.BOTTOM,
		)
	}
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



export function getListOfBalances(parsedMessages: any[]): number[] {
	return parsedMessages.map(msg =>
		msg.balance && msg.balance !== 0 ?
			msg.balance :
			msg.outstanding && msg.outstanding * -1

	).filter(value => value)
}


export async function fetchDailyTransaction(date: string) {
	return await SmsReader.getInboxFilteredByDate("Mpesa", date)
}

export async function fetchMonthTransaction(month: string) {
	const rawMessages = await SmsReader.getMonthlyTransactions("Mpesa", month) as Mpesa[]
	return rawMessages.map(msg =>
		parseMpesaMessage(msg.body)
	)
}

export function groupDatesByWeek(dates: string[]) {
	if (!dates.length) return []

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
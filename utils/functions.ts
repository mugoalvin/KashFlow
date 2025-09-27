import { Mpesa, MpesaParced, MpesaTransactionType, typeMap } from "@/interface/mpesa";
import { NativeModules, ToastAndroid } from 'react-native';

const { SmsReader } = NativeModules

export function parseMpesaMessage(message: string): MpesaParced {
	let type: MpesaTransactionType = 'send';

	for (const keyword in typeMap) {
		if (message.includes(keyword)) {
			type = typeMap[keyword];
			break;
		}
	}

	const amountMatch = message.match(/Ksh([\d,]+\.\d{2})/);
	const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;

	let counterparty = undefined;
	let account = undefined;
	let number = undefined;
	let time = undefined;
	let balance = undefined;
	let transactionCost = undefined;

	if (type === "fuliza") {
		const amountMatch = message.match(/Fuliza M-PESA amount is Ksh\s*([\d,]+\.\d{2})/);
		const feeMatch = message.match(/Access Fee charged Ksh\s*([\d,]+\.\d{2})/);
		const outstandingMatch = message.match(/outstanding amount is Ksh\s*([\d,]+\.\d{2})/);
		const dueDateMatch = message.match(/due on ([\d\/]+)/);

		return {
			type,
			amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined,
			fee: feeMatch ? parseFloat(feeMatch[1].replace(/,/g, "")) : undefined,
			outstanding: outstandingMatch ? parseFloat(outstandingMatch[1].replace(/,/g, "")) : undefined, // @ts-ignore
			dueDate: dueDateMatch ? dueDateMatch[1] : undefined,
		};
	}

	if (type === "payFuliza") {
		const paidMatch = message.match(/Confirmed\. Ksh\s*([\d,]+\.\d{2})/);
		const limitMatch = message.match(/Available Fuliza M-PESA limit is Ksh\s*([\d,]+\.\d{2})/);
		const balanceMatch = message.match(/M-PESA balance is Ksh\s*([\d,]+\.\d{2})/);

		return {
			type,
			paid: paidMatch ? parseFloat(paidMatch[1].replace(/,/g, "")) : undefined,
			limit: limitMatch ? parseFloat(limitMatch[1].replace(/,/g, "")) : undefined,
			balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined,
		};
	}

	if (type === "partialFulizaPay") {
		const amountMatch = message.match(/Confirmed\. Ksh\s*([\d,]+\.\d{2})/);
		const limitMatch = message.match(/Fuliza M-PESA limit is Ksh\s*([\d,]+\.\d{2})/);
		const balanceMatch = message.match(/M-PESA balance is Ksh\s*([\d,]+\.\d{2})/);

		return {
			type,
			amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined,
			limit: limitMatch ? parseFloat(limitMatch[1].replace(/,/g, "")) : undefined,
			balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined,
		}
	}

	switch (type) {
		case 'receive': {
			const senderMatch = message.match(/from (.+?) (\d+) on/);
			if (senderMatch) {
				counterparty = senderMatch[1];
				number = senderMatch[2];
			}
			break;
		}

		case "send": {
			let recipient = message.match(/paid to (.+?)\./);
			if (recipient) {
				counterparty = recipient[1];
			} else {
				recipient = message.match(/sent to (.+?) (\d+) on/);
				if (recipient) {
					counterparty = recipient[1];
					number = recipient[2];
				} else {
					recipient = message.match(/sent to (.+?) for account (.+?) on/);
					if (recipient) {
						counterparty = recipient[1];
						account = recipient[2];
					} else {
						recipient = message.match(/sent to (.+?) on/);
						if (recipient) counterparty = recipient[1];
					}
				}
			}
			break;
		}

		case "withdraw": {
			const withdrawMatch = message.match(/-\s*(.+?)\s*New M-PESA balance/);
			counterparty = withdrawMatch ? withdrawMatch[1].trim() : null;
			break;
		}
		default:
			counterparty = undefined;
			break;
	}

	const timeMatch = message.match(/on ([\d\/]+ at [\d:]+ [AP]M)/);
	time = timeMatch ? timeMatch[1] : null;

	const balanceMatch = message.match(/New M-PESA balance is Ksh([\d,]+\.\d{2})/);
	balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : null;

	const transactionCostMatch = message.match(/Transaction cost, Ksh([\d]+\.\d{2})/);
	transactionCost = transactionCostMatch ? parseFloat(transactionCostMatch[1]) : null;

	// @ts-ignore
	return { type, amount, account, counterparty, number, time, balance, transactionCost };
}




export async function fechSMSMessage(limit: number) {
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
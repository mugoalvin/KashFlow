export function extractAmount(message: string) {
	const amountMatch = message.match(/Ksh([\d,]+\.\d{2})/);
	return amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;
}

export function extractAirtimeDetails(message: string) {
	const amountMatch = message.match(/You bought Ksh\s*([\d,]+\.\d{2})/);
	const balanceMatch = message.match(/balance is Ksh\s*([\d,]+\.\d{2})/);
	const costMatch = message.match(/Transaction cost, Ksh\s*([\d,]+\.\d{2})/);

	return {
		extractedAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined,
		extractedBalance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined,
		extractedTransactionCost: costMatch ? parseFloat(costMatch[1].replace(/,/g, "")) : undefined
	};
}



export function extractFulizaDetails(message: string) {
	const amountMatch = message.match(/Fuliza M-PESA amount is Ksh\s*([\d,]+\.\d{2})/);
	const feeMatch = message.match(/Access Fee charged Ksh\s*([\d,]+\.\d{2})/);
	const outstandingMatch = message.match(/outstanding amount is Ksh\s*([\d,]+\.\d{2})/);
	const dueDateMatch = message.match(/due on ([\d\/]+)/);

	return {
		extractedAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined,
		extractedFee: feeMatch ? parseFloat(feeMatch[1].replace(/,/g, "")) : undefined,
		extractedOutstanding: outstandingMatch ? parseFloat(outstandingMatch[1].replace(/,/g, "")) : undefined, // @ts-ignore
		extractedDueDate: dueDateMatch ? dueDateMatch[1] : undefined,
	};
}

export function extractPayFulizaDetails(message: string) {
	const paidMatch = message.match(/Confirmed\. Ksh\s*([\d,]+\.\d{2})/);
	const limitMatch = message.match(/Available Fuliza M-PESA limit is Ksh\s*([\d,]+\.\d{2})/);
	const balanceMatch = message.match(/M-PESA balance is Ksh\s*([\d,]+\.\d{2})/);

	return {
		extractedPaid: paidMatch ? parseFloat(paidMatch[1].replace(/,/g, "")) : undefined,
		extractedLimit: limitMatch ? parseFloat(limitMatch[1].replace(/,/g, "")) : undefined,
		extractedBalance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined,
	};
}


export function extractPartialFulizaPay(message: string) {
	const amountMatch = message.match(/Confirmed\. Ksh\s*([\d,]+\.\d{2})/);
	const limitMatch = message.match(/Fuliza M-PESA limit is Ksh\s*([\d,]+\.\d{2})/);
	const balanceMatch = message.match(/M-PESA balance is Ksh\s*([\d,]+\.\d{2})/);

	return {
		extractedAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined,
		extractedLimit: limitMatch ? parseFloat(limitMatch[1].replace(/,/g, "")) : undefined,
		extractedBalance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, "")) : undefined,
	}
}


export function extractReceiveDetails(message: string) {
	// const senderMatch = message.match(/from (.+?) (\d+) on/)!;
	const senderMatch = message.match(/from (.+?) (\d+) on/)

	if (!senderMatch) {
		return {
			extractedCounterParty: "",
			extractedNumber: ""
		}
	}

	return {
		extractedCounterParty: senderMatch[1] || "",
		extractedNumber: senderMatch[2] || ""
	}
}

export function extractSendDetails(message: string) {
	const patterns = [
		{ regex: /paid to (.+?)\./, fields: ['counterparty'] },
		{ regex: /sent to (.+?) for account (.+?) on/, fields: ['counterparty', 'account'] },
		{ regex: /sent to (.+?) (\d+) on/, fields: ['counterparty', 'number'] },
		{ regex: /sent to (.+?) on/, fields: ['counterparty'] }
	];

	type ResultKey = 'counterparty' | 'number' | 'account';
	const result: { counterparty: string; number: string; account: string; } = { counterparty: '', number: '', account: '' };

	for (const pattern of patterns) {
		const match = message.match(pattern.regex);
		if (match) {
			pattern.fields.forEach((field, index) => {
				(result as any)[field as ResultKey] = match[index + 1];
			});
			break;
		}
	}

	return {
		extractedAccount: result.account,
		extractedCounterParty: result.counterparty,
		extractedNumber: result.number
	};
}

export function extractWithdrawDetails(message: string) {
	const withdrawMatch = message.match(/-\s*(.+?)\s*New M-PESA balance/);
	return withdrawMatch ? withdrawMatch[1].trim() : "Cash Withdrawal";
}
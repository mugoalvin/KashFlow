export type MpesaTransactionType = "airtime" | "receive" | "send" | "fuliza" | "payFuliza" | "partialFulizaPay" | "withdraw"


export const typeMap: { [key: string]: MpesaTransactionType } = {
	"of airtime on": "airtime",
	"You have received": "receive",
	"paid to": "send",
	"sent to": "send",
	"PMWithdraw": "withdraw",
	"AMWithdraw": "withdraw",
	"Confirmed. Fuliza": "fuliza",
	"fully pay": "payFuliza",
	"partially pay your outstanding Fuliza": "partialFulizaPay"
}


export interface MpesaParced {
	id: number
	type: MpesaTransactionType
	amount: number
	account?: string
	balance?: number
	counterparty?: string
	dueDate?: string
	fee?: number
	limit?: number
	message: string
	number?: number
	outstanding?: number
	paid?: number
	parsedDate?: string
	parsedTime?: string
	purpose?: string
	rawTime: string
	transactionCost?: number
}

export interface Mpesa {
	id: string
	address: string
	body: string
	date: string
	type: MpesaTransactionType
}

export interface MpesaReceive {
	amount: number
	balance: number
	counterparty: string
	number: string
	time: string
	type: "receive"
}

export interface MpesaSend {
	account?: string
	amount: number
	balance: number
	counterparty: string
	time: string
	transactionCost: number
	type: "send"
}

export interface MpesaWithdraw {
	amount: number
	balance: number
	counterparty: string
	time: string
	transactionCost: number
	type: "withdraw"
}

export interface MpesaFuliza {
	amount: number
	dueDate: string
	fee?: number
	outstanding: number
	type: "fuliza"
}

export interface MpesaPayFuliza {
	balance: number
	limit: number
	paid: number
	type: "payFuliza"
}
import { ReactNode } from "react"

export interface MyTextProps {
	leadingIcon?: ReactNode
	trailingIcon?: ReactNode
	color?: string
	className?: string
	text?: string
}

export type TransactionSortMode = "amount" | "count"

export interface SortedTransaction {
	counterparty: string
	totalSent: number
	transactionCount: number
}
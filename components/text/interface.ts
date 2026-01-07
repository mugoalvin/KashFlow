import { MpesaTransactionType } from "@/interface/mpesa"
import { ReactNode } from "react"

export interface MyTextProps {
	leadingIcon?: ReactNode
	trailingIcon?: ReactNode
	color?: string
	className?: string
	text?: string
	fontSize?: number
	fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "light" | "medium" | "regular" | "semibold" | "condensedBold" | "condensed" | "heavy" | "black"
}

export type TransactionSortMode = "amount" | "count"

export interface SortedTransaction {
	counterparty: string
	totalSent: number
	totalReceived: number
	transactionCount: number
	type: MpesaTransactionType
}

export interface Category {
	id?: number
	title: string
	name: string
	icon?: string
}

export enum SummaryOrderType {
	Ascending,
	Descending
} 
import { ReactNode } from "react"

export interface MyTextProps {
	leadingIcon?: ReactNode
	trailingIcon?: ReactNode
	color?: string
	className?: string
	text?: string
}
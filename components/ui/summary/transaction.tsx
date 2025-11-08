import Title from "@/components/text/title";
import { MpesaParced } from "@/interface/mpesa";
import { View } from "react-native";
import { Divider, Text, useTheme } from 'react-native-paper';
import HighestAndLowestTrasaction from "./highestAndLowest";
import { ReactNode } from "react";
import { SortedTransaction } from "@/components/text/interface";
import TopTransactions from "./topTransactions";

interface TransactionSummaryProps {
	title: string
	moneyIn: number
	moneyOut: number
	highest?: MpesaParced
	lowest?: MpesaParced
	trailingIcon?: ReactNode
	topTransactions?: SortedTransaction[]
}

export default function TransactionSummary({ title, moneyIn, moneyOut, highest, lowest, trailingIcon, topTransactions }: TransactionSummaryProps) {
	const theme = useTheme()

	return (
		<>
			<Title text={title} trailingIcon={ trailingIcon } />
			<View className="gap-5 p-5 rounded-lg" style={{ backgroundColor: theme.colors.elevation.level2 }}>

				<View className="flex-row">
					<View className="flex-1 justify-around">
						<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>Money In</Text>
						<Text variant="headlineSmall">Ksh { Intl.NumberFormat().format(moneyIn)}</Text>
					</View>
					<View className="flex-1 items-end justify-around">
						<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>Money Out</Text>
						<Text variant="headlineSmall">Ksh { Intl.NumberFormat().format(moneyOut)}</Text>
					</View>
				</View>

				{
					topTransactions && topTransactions.length > 0 &&
					<>
						<Divider />
						<TopTransactions transactions={topTransactions} />
					</>
				}

				{
					(highest && lowest) &&
					<>
						<Divider />
						<HighestAndLowestTrasaction highest={highest} lowest={lowest} />
					</>
				}

			</View>


		</>
	)
}
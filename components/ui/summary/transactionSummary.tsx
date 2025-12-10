import { SortedTransaction } from "@/components/text/interface";
import Title from "@/components/text/title";
import { MpesaParced } from "@/interface/mpesa";
import { ReactNode } from "react";
import { View } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { ActivityIndicator, Divider, Text, useTheme } from 'react-native-paper';
import HighestAndLowestTrasaction from "./highestAndLowest";
import TopTransactions from "./topTransactions";

interface TransactionSummaryProps {
	title: string
	moneyIn: number
	moneyOut: number
	highest?: MpesaParced
	lowest?: MpesaParced
	trailingIcon?: ReactNode
	topTransactions?: SortedTransaction[]
	isLoading?: boolean
}

export default function TransactionSummary({ title, moneyIn, moneyOut, highest, lowest, trailingIcon, topTransactions, isLoading = false }: TransactionSummaryProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')

	return (
		<>
			<View className={`${!useCard && 'px-2 rounded-lg'}`} style={{ backgroundColor: !useCard ? theme.colors.elevation.level2 : theme.colors.background }}>
				<Title text={title} trailingIcon={trailingIcon} color={theme.colors.onSurface} />
			</View>

			<View
				className={`gap-5 ${useCard && 'px-5'} py-5 rounded-lg`}
				style={{ backgroundColor: useCard ? theme.colors.elevation.level1 : theme.colors.background }}>

				<View className="flex-row h-11">
					{
						isLoading
							?
							<View className="flex-1 items-center justify-center">
								<ActivityIndicator />
							</View>
							:
							<>
								<View className="flex-1 justify-around">
									<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>Money In</Text>
									<Text variant="headlineSmall">Ksh {Intl.NumberFormat().format(moneyIn)}</Text>
								</View>
								<View className="flex-1 items-end justify-around">
									<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>Money Out</Text>
									<Text variant="headlineSmall">Ksh {Intl.NumberFormat().format(moneyOut)}</Text>
								</View>
							</>
					}
				</View>

				{
					topTransactions && topTransactions.length > 0 &&
					<>
						<Divider horizontalInset />
						<TopTransactions transactions={topTransactions} />
					</>
				}

				{
					(highest && lowest) &&
					<>
						<Divider horizontalInset />
						<HighestAndLowestTrasaction highest={highest} lowest={lowest} />
					</>
				}

			</View>


		</>
	)
}
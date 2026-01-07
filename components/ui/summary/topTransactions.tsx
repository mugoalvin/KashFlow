import { SortedTransaction, TransactionSortMode } from "@/components/text/interface"
import { Text as ReusableText } from "@/components/ui/text"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text as NativeText, Pressable, View } from "react-native"
import { Icon, Text as PaperText, useTheme } from 'react-native-paper'
import Animated, { FadeInLeft, FadeOutRight, LinearTransition } from "react-native-reanimated"

interface TopTransactionsProps {
	transactions: SortedTransaction[]
	isAscending?: boolean
	currentSortType?: TransactionSortMode
	setSortType?: (type: TransactionSortMode) => void
	setOrderType?: (type: boolean) => void
}

export default function TopTransactions({ transactions, currentSortType, isAscending, setSortType, setOrderType }: TopTransactionsProps) {
	const theme = useTheme()

	return (
		<View className="gap-7">
			<View className="flex-row justify-between">
				<NativeText style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>Counter Party</NativeText>
				<Pressable className="flex-row items-center gap-2"
					onPress={() =>
						currentSortType === 'count' ?
							setOrderType && setOrderType(!isAscending) :
							setSortType && setSortType('count')
					}
				>
					<NativeText className="text-center" style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>Transactions{'\n'}Count</NativeText>
					<Icon
						source={() => <FontAwesome name="sort" color={theme.colors.secondary} />}
						size={10}
					/>
				</Pressable>
				<Pressable className="flex-row items-center gap-2"
					onPress={() =>
						currentSortType === 'amount' ?
							setOrderType && setOrderType(!isAscending) :
							setSortType && setSortType('amount')
					}
				>
					<NativeText className="text-center" style={{ color: theme.colors.onSurfaceDisabled, fontWeight: 'bold' }}>Total{'\n'}Amount</NativeText>
					<Icon
						source={() => <FontAwesome name="sort" color={theme.colors.secondary} />}
						size={10}
					/>
				</Pressable>
			</View>
			{
				transactions.map((transaction, i) =>
					<Animated.View
						key={transaction.counterparty}
						layout={LinearTransition.duration(500)}
						entering={FadeInLeft.delay(i * 100).duration(500)}
						exiting={FadeOutRight.delay(i * 100).duration(500)}
						className="flex-row items-end justify-between"
					>
						<Tooltip className="w-5/12">
							<TooltipTrigger>
								<PaperText numberOfLines={1} ellipsizeMode="tail">{transaction.counterparty}</PaperText>
							</TooltipTrigger>
							<TooltipContent style={{ backgroundColor: theme.colors.background, outlineWidth: 1, outlineColor: theme.colors.outline, }}>
								<ReusableText style={{ color: theme.colors.onTertiaryContainer }}>
									{transaction.counterparty}
								</ReusableText>
							</TooltipContent>
						</Tooltip>
						<View className="w-3/12 items-center gap-1">
							<PaperText>{transaction.transactionCount}</PaperText>
						</View>
						<View className="w-4/12 items-end gap-1">
							{
								transaction.type === 'receive'
									? <PaperText>+ Ksh {Intl.NumberFormat("en-US").format(transaction.totalReceived)}</PaperText>
									: <PaperText>- Ksh {Intl.NumberFormat("en-US").format(transaction.totalSent)}</PaperText>
							}
						</View>
					</Animated.View>
				)
			}
		</View>
	)
}
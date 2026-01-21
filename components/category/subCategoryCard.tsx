import { sqliteDB } from '@/db/config'
import { mpesaMessages } from '@/db/sqlite'
import { and, count, eq, sql } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { Text, useTheme } from 'react-native-paper'

interface SubCategoryCardProps {
	counterParty: string
}

export default function SubCategoryCard({ counterParty }: SubCategoryCardProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')
	const [transactionCount, setTransactionCount] = useState<number>()
	const [totalAmount, setTotalAmount] = useState<number>()
	const [currentAmount, setCurrentAmount] = useState<number>()

	// Date Format: 2025-03-04
	async function getCount() {
		const res = await sqliteDB
			.select({ count: count() })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.counterparty, counterParty))

		setTransactionCount(res[0].count)

		const ovverall = await sqliteDB
			.select({ amount: mpesaMessages.amount })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.counterparty, counterParty))

		setTotalAmount(
			ovverall.reduce((acc, current) => acc + current.amount!, 0)
		)


		const currentMonth = await sqliteDB
			.select({ amount: mpesaMessages.amount })
			.from(mpesaMessages)
			.where(
				and(
					eq(mpesaMessages.counterparty, counterParty),
					sql`strftime('%Y-%m', ${mpesaMessages.parsedDate}) = strftime('%Y-%m', 'now')`
				))

		setCurrentAmount(
			currentMonth.reduce((acc, current) => acc + current.amount!, 0)
		)
	}

	useEffect(() => {
		getCount()
	}, [])

	return (
		<View
			className='justify-center py-3 px-2 gap-2 rounded'
			style={{
				backgroundColor:
					useCard
						? theme.colors.elevation.level1
						: theme.colors.elevation.level0
			}}
		>
			<View>
				<Text className='font-bold text-base'>
					{counterParty}
				</Text>
				<Text className='text-xs' style={{ color: theme.colors.onSurfaceDisabled }}>
					{Intl.NumberFormat('en-us').format(transactionCount || 0)} Transactions
				</Text>
			</View>

			<View className='flex-row justify-between'>
				<View className='flex-row gap-1'>
					<Text className='text-xs' style={{ color: theme.colors.onSurfaceDisabled }}>This Month:</Text>
					<Text className='text-xs' style={{ color: theme.colors.onSurfaceDisabled }}>{Intl.NumberFormat('en-us').format(currentAmount || 0)}</Text>
				</View>
				<View className='flex-row gap-1'>
					<Text className='text-xs' style={{ color: theme.colors.onSurfaceDisabled }}>Overrall:</Text>
					<Text className='text-xs' style={{ color: theme.colors.onSurfaceDisabled }}>{Intl.NumberFormat('en-us').format(totalAmount || 0)}</Text>
				</View>
			</View>
		</View>
	)
}
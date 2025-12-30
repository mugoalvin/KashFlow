import { sqliteDB } from '@/db/config'
import { mpesaMessages } from '@/db/sqlite'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { Category } from '../text/interface'

interface CategoryCardProps {
	category: Category
	index: number
	refreshKey: number
}

export default function CategoryCard({ category, index, refreshKey }: CategoryCardProps) {
	const theme = useTheme()
	const [distinctCount, setDistinctCount] = useState<number>(0)

	useEffect(() => {
		sqliteDB
			.selectDistinct({ counter: mpesaMessages.counterparty })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.categoryId, category.id!))

			.then(rows => setDistinctCount(rows.length))
	}, [refreshKey])

	return (
		<Animated.View
			key={category.name}
			className='flex-row items-center justify-between h-20 rounded-lg mb-3'
			style={{
				backgroundColor: theme.colors.elevation.level1
			}}
			entering={FadeInDown.duration(500).delay(index * 200)}
			exiting={FadeOutDown.duration(500).delay(index * 200)}
		>
			<View className='flex-row items-center'>
				<IconButton
					icon={() =>
						<MaterialDesignIcons name='minus-circle' size={20} color={theme.colors.primary} />
					}
				/>
				<View className='gap-1'>
					<Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>{category.title}</Text>
					{
						distinctCount &&
							<Text variant='bodySmall'>{distinctCount} Counter Parties</Text>
					}
				</View>
			</View>

			<IconButton
				icon={() =>
					<MaterialDesignIcons name='pencil-outline' size={20} color={theme.colors.primary} />
				}
			/>
		</Animated.View>
	)
}
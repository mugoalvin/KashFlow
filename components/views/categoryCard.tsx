// @ts-check
import { sqliteDB } from '@/db/config'
import { mpesaMessages } from '@/db/sqlite'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useMMKVBoolean } from 'react-native-mmkv'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, ZoomOut } from 'react-native-reanimated'
import RightActionCategorySwipable from '../animations/rightActionCaregorySwipable'
import { Category } from '../text/interface'
import LeftActionCategorySwipable from '../animations/leftActionCategorySwipable'

interface CategoryCardProps {
	category: Category
	index: number
	refreshKey: number
}

export default function CategoryCard({ category, index, refreshKey }: CategoryCardProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')
	const [distinctCount, setDistinctCount] = useState<number>(0)

	useEffect(() => {
		sqliteDB
			.selectDistinct({ counter: mpesaMessages.counterparty })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.categoryId, category.id!))

			.then(rows => setDistinctCount(rows.length))
	}, [refreshKey])

	return (
		<Swipeable
			friction={1}
			overshootRight
			overshootFriction={4}
			renderLeftActions={(progress, translationX) => 
				<LeftActionCategorySwipable translationX={translationX} />
			}
			renderRightActions={(progress, translateX) =>
				<RightActionCategorySwipable translationX={translateX} />
			}
			containerStyle={{
				marginVertical: useCard ? 5 : 0
			}}
		>
			<Animated.View
				key={category.name}
				className='flex-row items-center justify-between h-20 rounded-lg'
				style={{
					backgroundColor: useCard ? theme.colors.elevation.level1 : theme.colors.background
				}}
				entering={FadeInDown.duration(500).delay(index * 200)}
				exiting={ZoomOut.duration(500).delay(index * 200)}
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
							distinctCount !== 0 &&
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
		</Swipeable>
	)
}
import { sqliteDB } from '@/db/config'
import { mpesaMessages } from '@/db/sqlite'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'
import Swipeable, { SwipeDirection } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useMMKVBoolean } from 'react-native-mmkv'
import { IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import LeftActionCategorySwipable from '../animations/leftActionCategorySwipable'
import RightActionCategorySwipable from '../animations/rightActionCaregorySwipable'
import { Category } from '../text/interface'

interface CategoryCardProps {
	category: Category
	index: number
	refreshKey: number
	onEdit?: (id: number) => void
	onDelete?: (id: number) => void
}

export default function CategoryCard({ category, index, refreshKey, onEdit, onDelete }: CategoryCardProps) {
	const theme = useTheme()
	const [useCard] = useMMKVBoolean('useCard')
	const [counterParties, setCounterParties] = useState<string[]>([])
	const [isInitialRender, setIsInitialRender] = useState<boolean>(true)
	const screenWidth = Dimensions.get('window').width

	useEffect(() => {
		const timer = setTimeout(() => setIsInitialRender(false), 1000);
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		sqliteDB
			.selectDistinct({ counter: mpesaMessages.counterparty })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.categoryId, category.id!))

			.then(rows => setCounterParties(
				// @ts-ignore
				rows.reduce((acc, row) => acc.concat(row.counter), [])
			))
	}, [refreshKey])

	return (
		<Animated.View
			entering={
				isInitialRender ?
					ZoomIn.duration(500).delay(index * 70) :
					ZoomIn.duration(500)
			}
			exiting={ZoomOut.duration(500)}
			style={{ zIndex: -1, width: screenWidth - 16 }}
		>
			<Swipeable
				friction={1}
				overshootRight
				overshootFriction={4}
				renderLeftActions={(progress, translationX, methods) =>
					<LeftActionCategorySwipable category_id={category.id!} translationX={translationX} onEdit={onEdit} />
				}
				renderRightActions={(progress, translateX) =>
					<RightActionCategorySwipable category_id={category.id!} translationX={translateX} onDelete={onDelete} />
				}
				onSwipeableOpen={(direction: SwipeDirection) =>
					direction === 'right' ?
						onEdit!(category.id!) :
						onDelete!(category.id!)
				}
				containerStyle={{
					flex: 1,
					marginVertical: useCard ? 5 : 0
				}}
			>
				<Animated.View
					className='flex-row items-center justify-between h-20 rounded-lg'
					style={{
						backgroundColor: useCard ? theme.colors.elevation.level1 : theme.colors.background
					}}
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
								counterParties.length !== 0 &&
								<Text variant='bodySmall'>{counterParties.length} Counter Parties</Text>
							}
						</View>
					</View>

					<IconButton
						icon={() =>
							<MaterialDesignIcons name='dots-vertical' size={20} color={theme.colors.primary} />
						}
					/>
				</Animated.View>
			</Swipeable>
		</Animated.View>
	)
}
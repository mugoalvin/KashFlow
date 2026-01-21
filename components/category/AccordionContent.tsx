import { sqliteDB } from '@/db/config'
import { subCategoriesTable } from '@/db/sqlite'
import { eq } from 'drizzle-orm'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated'
import { Category, SubCategory } from '../text/interface'
import LightText from '../text/lightText'
import SubCategoryDropDownMenu from './subCategoryDropDownMenu'

interface CategoryAccordionContentProps {
	category: Category
	refreshKey: number
}

export default function CategoryAccordionContent({ category, refreshKey }: CategoryAccordionContentProps) {
	const theme = useTheme()
	const [subCategories, setSubCategories] = useState<Pick<SubCategory, 'id' | 'title'>[]>()

	useEffect(() => {
		sqliteDB
			.selectDistinct({ id: subCategoriesTable.id, title: subCategoriesTable.title })
			.from(subCategoriesTable)
			.where(eq(subCategoriesTable.categoryId, category.id))

			.then(setSubCategories)
	}, [refreshKey])

	return (
		<View>
			<View className='ps-8 pe-5'>
				<LightText text='Sub-Categories' className='mb-2' />
			</View>
			{
				subCategories?.map((tx, i) =>
					<Animated.View
						key={tx.title}
						entering={FadeInDown.delay(i * 50).duration(500)}
						exiting={FadeOutRight.duration(500)}
					>
						<Pressable
							className='flex-row items-center justify-between rounded-md ps-8'
							android_ripple={{
								color: theme.colors.elevation.level3,
								foreground: true
							}}
							onPress={() =>
								router.push({
									pathname: '/(tabs)/(categories)/subCategory',
									params: {
										id: tx.id,
										subCategory: tx.title,
									}
								})
							}
						>
							<Text style={{ color: theme.colors.onSecondaryContainer }} >
								{tx.title}
							</Text>
							<SubCategoryDropDownMenu subCategory={tx} />
						</Pressable>
					</Animated.View>
				)
			}
		</View>
	)
}
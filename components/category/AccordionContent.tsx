import { sqliteDB } from '@/db/config'
import { subCategoriesTable } from '@/db/sqlite'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
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
		// .then(console.log)
	}, [refreshKey])

	return (
		<View className='ps-12 pe-5'>
			<LightText text='Sub-Categories' className='mb-2' />
			{
				subCategories?.map((tx, i) =>
					<Animated.View
						key={tx.title}
						className='flex-row items-center justify-between'
						entering={FadeInDown.delay(i * 50).duration(500)}
						exiting={FadeOutRight.duration(500)}
					>
						<Text style={{ color: theme.colors.onSecondaryContainer }} >
							{tx.title}
						</Text>

						<SubCategoryDropDownMenu subCategory={tx} />
					</Animated.View>
				)
			}
		</View>
	)
}
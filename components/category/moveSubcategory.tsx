import useBottomSheetContext from '@/contexts/BottomSheetContext'
import { sqliteDB } from '@/db/config'
import { categoriesTable, subCategoriesTable } from '@/db/sqlite'
import { Ionicons } from '@expo/vector-icons'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { useMMKVNumber } from 'react-native-mmkv'
import { Button, Divider, Icon, Text, useTheme } from 'react-native-paper'
import { Category, SubCategory } from '../text/interface'

interface MoveSubCategoryProps {
	subCategory: Pick<SubCategory, 'id' | 'title'>
}

export default function MoveSubCategory({ subCategory }: MoveSubCategoryProps) {
	const theme = useTheme()
	const { closeSheet } = useBottomSheetContext()
	const [categories, setCategories] = useState<Pick<Category, 'id' | 'title'>[]>([])
	const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
	const [, setNewCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

	async function getCategories() {
		const cats = await sqliteDB
			.select({
				id: categoriesTable.id,
				title: categoriesTable.title
			})
			.from(categoriesTable)

		setCategories(cats)
	}

	async function moveSubCategoryToCategory() {
		closeSheet()

		await sqliteDB
			.update(subCategoriesTable)
			.set({
				categoryId: selectedCategoryId
			})
			.where(eq(subCategoriesTable.id, subCategory.id))

		setNewCategoryRefreshKey(prev => prev ? prev + 1 : 0)
	}

	useEffect(() => {
		getCategories()
	}, [])

	return (
		<View className='gap-3 pb-5'>
			<Text className='text-sm'>Move</Text>
			<Text className='text-3xl font-bold' style={{ color: theme.colors.tertiary }}>{subCategory.title}</Text>
			<Text className='text-sm'>to</Text>

			<Divider horizontalInset style={{ backgroundColor: theme.colors.background }} />

			<View className='gap-1'>
				{
					categories.map(category =>
						<Pressable
							key={category.title}
							className='flex-row justify-between py-5 pe-4'
							onPress={() => {
								setSelectedCategoryId(category.id)
							}}
							android_ripple={{
								color: theme.colors.primary,
								foreground: true
							}}
						>
							<Text>{category.title}</Text>
							{
								selectedCategoryId === category.id &&
								<Icon
									source={() =>
										<Ionicons name='checkmark' color={theme.colors.tertiary} size={15} />
									}
									size={40}
								/>
							}
						</Pressable>
					)
				}
			</View>

			<Button
				mode='contained'
				onPress={() => {
					moveSubCategoryToCategory()
				}}
			>
				Move
			</Button>
		</View>
	)
}
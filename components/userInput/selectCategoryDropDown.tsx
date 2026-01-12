import { sqliteDB } from '@/db/config';
import { categoriesTable, subCategoriesTable } from '@/db/sqlite';
import { MpesaParced } from '@/interface/mpesa';
import { updateCounterpartyCategory } from '@/utils/functions';
import { getDropDownStyles } from '@/utils/styles';
import { Ionicons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category, SubCategory } from '../text/interface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';


interface SelectCategoryDropDownProps {
	transaction: MpesaParced
	closeModal: () => void
}

// Extends your existing Category type to include its children
type CategoryWithSubs = Category & {
	subCategories: SubCategory[];
};

export default function SelectCategoryDropDown({ transaction, closeModal }: SelectCategoryDropDownProps) {
	const theme = useTheme()
	const didSetInitialCategory = useRef(false)
	const [categories, setCategories] = useState<CategoryWithSubs[]>([])
	const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>()
	const [categoryNameToDisplay, setCategoryNameToDisplay] = useState<string>()

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};



	async function onUpdate(subCategory: SubCategory) {
		const res = await updateCounterpartyCategory(subCategory.id, transaction.counterparty)
		if (res.changes > 0) {
			const categoryTitle = await sqliteDB
				.select()
				.from(subCategoriesTable)
				.where(
					eq(subCategoriesTable.id, subCategory.id)
				)

			setCategoryNameToDisplay(categoryTitle[0].title)
		}
	}


	useEffect(() => {
		const fetchMenuData = async () => {
			try {
				const [cats, subs] = await Promise.all([
					sqliteDB.select().from(categoriesTable),
					sqliteDB.select().from(subCategoriesTable)
				]);

				const nestedData = cats.map(category => ({
					...category,
					subCategories: subs.filter(sub => sub.categoryId === category.id)
				}));

				setCategories(nestedData);
			} catch (error) {
				console.error("Failed to fetch menu data:", error);
			}
		};

		sqliteDB
			.select()
			.from(subCategoriesTable)
			.where(
				eq(subCategoriesTable.id, transaction.categoryId || 2)
			)
			.limit(1)

			.then(categories => {
				setSelectedSubCategory(categories[0] as SubCategory)
				setCategoryNameToDisplay(categories[0].title)
			})

		fetchMenuData()
		didSetInitialCategory.current = true
	}, [])


	if (selectedSubCategory)
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Pressable className='flex-row items-baseline justify-between gap-5 px-4 py-1 rounded-full' style={{ backgroundColor: theme.colors.onTertiary }}>
						<Text>{categoryNameToDisplay}</Text>
						<Icon source={() => <Ionicons name='chevron-down' color={theme.colors.onTertiaryContainer} />} size={20} />
					</Pressable>
				</DropdownMenuTrigger>

				<DropdownMenuContent insets={contentInsets} sideOffset={2} alignOffset={-70} className="w-56" align="start" style={getDropDownStyles(theme).menuContent}>
					<DropdownMenuLabel>Select Sub Category</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>

						{
							categories.map(category =>
								<DropdownMenuSub key={category.name}>
									<DropdownMenuSubTrigger>
										<Text>{category.title}</Text>
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent style={getDropDownStyles(theme).subContent}>
										{
											category.subCategories.map(subCategory =>
												<DropdownMenuItem key={subCategory.name}
													onPress={() => onUpdate(subCategory)}
												>
													<Text>{subCategory.title}</Text>
												</DropdownMenuItem>
											)
										}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							)
						}

						<DropdownMenuSeparator />

						<DropdownMenuItem onPress={() => {
							closeModal()
							router.push({
								pathname: '/(tabs)/(categories)',
								params: {
									transactionString: JSON.stringify(transaction)
								}
							})
						}}
						>
							<Text>Add Category</Text>
						</DropdownMenuItem>

					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		)
}
import { sqliteDB } from '@/db/config';
import { categoriesTable } from '@/db/sqlite';
import { MpesaParced } from '@/interface/mpesa';
import { Ionicons } from '@expo/vector-icons';
import { PlatformPressable } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '../text/interface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';


interface SelectCategoryDropDownProps {
	selectedCategory: Category
	setSelectedCategory?: (category: Category) => void
	setIsCreatingNewCategory?: (val: boolean) => void
}

export default function SelectCategoryDropDown({ selectedCategory, setSelectedCategory, setIsCreatingNewCategory }: SelectCategoryDropDownProps) {
	const theme = useTheme()
	const [categories, setCategories] = useState<Category[]>([])

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};

	useEffect(() => {
		sqliteDB.select().from(categoriesTable)
			.then(res =>
				setCategories(res as Category[])
			)
			.catch(console.error)
	}, [])


	if (selectedCategory)
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<PlatformPressable className='flex-row items-baseline justify-between gap-5 px-4 py-1 rounded-full' style={{ backgroundColor: theme.colors.onTertiary }}>
						<Text>{selectedCategory?.icon || ""} {selectedCategory.title}</Text>
						<Icon source={() => <Ionicons name='chevron-down' color={theme.colors.onTertiaryContainer} />} size={20} />
					</PlatformPressable>
				</DropdownMenuTrigger>

				<DropdownMenuContent insets={contentInsets} sideOffset={2} alignOffset={-70} className="w-56" align="start" style={{ backgroundColor: theme.colors.background }}>
					<DropdownMenuLabel>Select Category</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>

						{
							categories.map(category =>
								<DropdownMenuItem key={category.name} onPress={() => setSelectedCategory&& setSelectedCategory(category)}>
									<Text>{category.title}</Text>
									<DropdownMenuShortcut>{category?.icon || ""}</DropdownMenuShortcut>
								</DropdownMenuItem>
							)
						}

						<DropdownMenuSeparator />

						<DropdownMenuItem onPress={() => setIsCreatingNewCategory && setIsCreatingNewCategory(true)}>
							<Text>Add Category</Text>
						</DropdownMenuItem>

					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		)
}
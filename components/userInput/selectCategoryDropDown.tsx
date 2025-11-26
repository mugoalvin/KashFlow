import { sqliteDB } from '@/db/config';
import { categoriesTable } from '@/db/sqlite';
import { Ionicons } from '@expo/vector-icons';
import { PlatformPressable } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function SelectCategoryDropDown() {
	const theme = useTheme()
	const [categories, setCategories] = useState<string[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string>()

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	};


	useEffect(() => {
		sqliteDB.selectDistinct({ categories: categoriesTable.title }).from(categoriesTable)
			.then(res =>
				setCategories(res.map(r => r.categories!))
			)
			.catch(console.error)
	}, [])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<PlatformPressable className='flex-row items-baseline justify-between gap-5 px-4 py-1 rounded-full' style={{ backgroundColor: theme.colors.onTertiary }}>
					<Text>{selectedCategory ? selectedCategory : "General"}</Text>
					<Icon source={() => <Ionicons name='chevron-down' color={theme.colors.onTertiaryContainer} />} size={20} />
				</PlatformPressable>
			</DropdownMenuTrigger>

			<DropdownMenuContent insets={contentInsets} sideOffset={2} alignOffset={-70} className="w-56" align="start">
				<DropdownMenuLabel>Select Category</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>

					{
						categories.map(category =>
							<DropdownMenuItem key={category} onPress={() => setSelectedCategory(category)}>
								<Text>{category}</Text>
								<DropdownMenuShortcut>{"\u{1F5FD}"}</DropdownMenuShortcut>
							</DropdownMenuItem>
						)
					}

				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
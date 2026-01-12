import useBottomSheetContext from '@/contexts/BottomSheetContext'
import { sqliteDB } from '@/db/config'
import { subCategoriesTable } from '@/db/sqlite'
import { getDropDownStyles } from '@/utils/styles'
import { Ionicons } from '@expo/vector-icons'
import { eq } from 'drizzle-orm'
import { AndroidHaptics, performAndroidHapticsAsync } from 'expo-haptics'
import React from 'react'
import { useMMKVNumber } from 'react-native-mmkv'
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SubCategory } from '../text/interface'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import MoveSubCategory from './moveSubcategory'
import RenameSubCategory from './renameSubCategory'

interface SubCategoryDropDownMenuProps {
	subCategory: Pick<SubCategory, 'id' | 'title'>
}

export default function SubCategoryDropDownMenu({ subCategory }: SubCategoryDropDownMenuProps) {
	const theme = useTheme()
	const { openSheet } = useBottomSheetContext()
	const [, setNewCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

	const insets = useSafeAreaInsets()
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 4,
		right: 4,
	}

	function onDelete() {
		performAndroidHapticsAsync(
			AndroidHaptics.Long_Press
		)

		sqliteDB
			.delete(subCategoriesTable)
			.where(eq(subCategoriesTable.id, subCategory.id))

			.then(() => {
				setNewCategoryRefreshKey(prev => prev ? prev + 1 : 0)
			})
	}

	function onRename() {
		openSheet({
			content: <RenameSubCategory subCategory={subCategory} />
		})
	}

	function onMove() {
		openSheet({
			content: <MoveSubCategory subCategory={subCategory} />
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton
					icon={({ color, size }) =>
						<Ionicons name='ellipsis-vertical' color={color} size={size - 10} />
					}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				insets={contentInsets}
				sideOffset={2}
				className="w-56"
				align="start"
				style={getDropDownStyles(theme).menuContent}
			>
				<DropdownMenuGroup>
					<DropdownMenuItem onPress={onRename}>
						<Text>Rename</Text>
					</DropdownMenuItem>
					<DropdownMenuItem onPress={onMove}>
						<Text>Move</Text>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator style={getDropDownStyles(theme).separator} />
				<DropdownMenuItem onPress={onDelete}>
					<Text>Delete</Text>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
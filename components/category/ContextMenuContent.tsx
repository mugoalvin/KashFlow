import useBottomSheetContext from '@/contexts/BottomSheetContext'
import React from 'react'
import { Text } from 'react-native-paper'
import { ContextMenuItem, ContextMenuShortcut } from '../ui/context-menu'
import AddSubCategory from '../userInput/addSubCategory'
import { Category } from '../text/interface'

interface CategoryContextMenuContentProps {
	category: Category
}

export default function CategoryContextMenuContent({ category }: CategoryContextMenuContentProps) {
	const { openSheet } = useBottomSheetContext()

	return (
		<>
			<ContextMenuItem onPress={() =>
				openSheet({
					content: <AddSubCategory category={category} />
				})
			}>
				<Text>Add Sub-Category</Text>
				<ContextMenuShortcut>+</ContextMenuShortcut>
			</ContextMenuItem>
		</>
	)
}
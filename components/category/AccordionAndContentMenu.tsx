import CategoryAccordionContent from "@/components/category/AccordionContent";
import CategoryCard from "@/components/category/Card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import EditCategory from "@/components/userInput/editCategory";
import useBottomSheetContext from '@/contexts/BottomSheetContext';
import useSnackbarContext from "@/contexts/SnackbarContext";
import { sqliteDB } from '@/db/config';
import { deleteSubCategoriesUnderCategory, nullifyCategoryIdsInMpesaMessages } from "@/db/db_functions";
import { categoriesTable } from '@/db/sqlite';
import { getDropDownStyles } from "@/utils/styles";
import { eq } from "drizzle-orm";
import { AndroidHaptics, performAndroidHapticsAsync } from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useMMKVNumber, useMMKVString } from 'react-native-mmkv';
import { useTheme } from 'react-native-paper';
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Category } from '../text/interface';
import CategoryContextMenuContent from "./ContextMenuContent";

export default function AccordionAndContentMenu() {
	const theme = useTheme()
	const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
	const [availableCategories, setAvailableCategories] = useState<Category[]>([])
	const categoriesRef = useRef(availableCategories);
	const { showSnackbar } = useSnackbarContext()
	const { openSheet } = useBottomSheetContext()
	const [newCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')
	const [accordionType] = useMMKVString('accordionType')

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	async function fetchCategories() {
		const val = await sqliteDB
			.select()
			.from(categoriesTable)

		setAvailableCategories(val as Category[])
	}


	const onEdit = (id: number) => {
		openSheet({
			content: <EditCategory id={id} />
		})
	}

	const onDelete = (id: number) => {
		const categoryToRestore = availableCategories.find(cat => cat.id === id)
		if (!categoryToRestore) return

		setAvailableCategories(prev =>
			prev.filter(cat => cat.id !== id)
		)

		showSnackbar({
			message: 'Deleting category',

			onUndo() {
				setAvailableCategories(prev => {
					const undone = [...prev, categoryToRestore]
					return undone.sort((a, b) => (a.id! - b.id!))
				})
			},
		})

		setTimeout(async () => {
			const isStillDeleted = !categoriesRef.current.some(cat => cat.id === id);

			if (isStillDeleted) {
				console.log("Snackbar unmounted. Permanently deleting...");
				try {
					await nullifyCategoryIdsInMpesaMessages(sqliteDB, id)
					await deleteSubCategoriesUnderCategory(sqliteDB, id)
					await sqliteDB
						.delete(categoriesTable)
						.where(eq(categoriesTable.id, id))
				} catch (error) {
					console.error("Database deletion failed:", error);
				}
			} else {
				console.log("Deletion aborted: User pressed Undo.");
			}
		}, 3500);
	}

	useEffect(() => {
		fetchCategories()
	}, [newCategoryRefreshKey])

	useEffect(() => {
		categoriesRef.current = availableCategories;
	}, [availableCategories]);

	return (
		<Accordion type={accordionType as 'single' | 'multiple'} className="w-full max-w-lg" defaultValue="item-1">
			<Animated.FlatList
				data={availableCategories}
				itemLayoutAnimation={
					LinearTransition
					// .springify()
					// .damping(60)
					// .mass(5)
				}
				keyExtractor={item => item.name}
				refreshControl={
					<RefreshControl
						refreshing={isPageRefreshing}
						progressBackgroundColor={theme.colors.primaryContainer}
						colors={[theme.colors.primary]}
						onRefresh={() => {
							setIsPageRefreshing(true)
							fetchCategories()
								.then(() => {
									setIsPageRefreshing(false)
								})
						}}
					/>
				}
				renderItem={({ item, index }) =>
					<AccordionItem value={`item-${index + 1}`}>
						<ContextMenu>

							<ContextMenuTrigger asChild className='p-3' onLongPress={() => {
								performAndroidHapticsAsync(
									AndroidHaptics.Long_Press
								)
							}}>
								<AccordionTrigger className='p-0 items-center'>
									<CategoryCard
										refreshKey={newCategoryRefreshKey || 0}
										index={index}
										category={item}
										onEdit={onEdit}
										onDelete={onDelete}
									/>
								</AccordionTrigger>
							</ContextMenuTrigger>


							<ContextMenuContent insets={contentInsets} style={{
								...getDropDownStyles(theme).menuContent,
								...getDropDownStyles(theme).contextMenuContent
							}}>
								<CategoryContextMenuContent category={item} />
							</ContextMenuContent>

						</ContextMenu>

						<AccordionContent className="flex flex-col gap-4 text-balance">
							<CategoryAccordionContent category={item} refreshKey={newCategoryRefreshKey || 0} />
						</AccordionContent>
					</AccordionItem>
				}
			/>
		</Accordion>
	)
}
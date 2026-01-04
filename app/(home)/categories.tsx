import { Category } from "@/components/text/interface";
import AddCategory from "@/components/userInput/addCategory";
import Body from "@/components/views/body";
import CategoryCard from "@/components/views/categoryCard";
import useBottomSheetContext from "@/contexts/BottomSheetContext";
import useSnackbarContext from "@/contexts/SnackbarContext";
import { sqliteDB } from "@/db/config";
import { nullifyCategoryIdsInMpesaMessages } from "@/db/db_functions";
import { categoriesTable } from "@/db/sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { useMMKVNumber } from "react-native-mmkv";
import { FAB, useTheme } from "react-native-paper";
import Animated, { LinearTransition } from "react-native-reanimated";


export default function Categories() {
	const theme = useTheme()
	const { openSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()
	const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
	const [availableCategories, setAvailableCategories] = useState<Category[]>([])
	const [newCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')
	const categoriesRef = useRef(availableCategories);

	useEffect(() => {
		categoriesRef.current = availableCategories;
	}, [availableCategories]);

	async function fetchCategories() {
		const val = await sqliteDB
			.select()
			.from(categoriesTable)

		setAvailableCategories(val as Category[])
	}

	useEffect(() => {
		fetchCategories()
	}, [newCategoryRefreshKey])

	return (
		<Body className="pt-3">
			<Animated.FlatList
				className='flex-1'
				data={availableCategories}
				itemLayoutAnimation={
					LinearTransition
						.springify()
						.damping(60)
						.mass(5)
				}
				keyExtractor={item => item.name}
				refreshControl={
					<RefreshControl
						refreshing={isPageRefreshing}
						progressBackgroundColor={theme.colors.tertiaryContainer}
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
					<CategoryCard
						refreshKey={newCategoryRefreshKey || 0}
						index={index}
						category={item}
						onDelete={async (id: number) => {
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
										await nullifyCategoryIdsInMpesaMessages(sqliteDB, id);
										await sqliteDB
											.delete(categoriesTable)
											.where(eq(categoriesTable.id, id));
									} catch (error) {
										console.error("Database deletion failed:", error);
									}
								} else {
									console.log("Deletion aborted: User pressed Undo.");
								}
							}, 3500);
						}}
					/>
				}
			/>

			<FAB
				style={{ position: 'absolute', margin: 16, bottom: 0, right: 0 }}
				icon={({ color, size }) =>
					<MaterialCommunityIcons name="plus" color={color} size={size} />
				}
				onPress={() =>
					openSheet({
						content: <AddCategory />
					})
				}
			/>
		</Body>
	)
}
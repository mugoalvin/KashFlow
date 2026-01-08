import { Category } from "@/components/text/interface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AddCategory from "@/components/userInput/addCategory";
import EditCategory from "@/components/userInput/editCategory";
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
import { FAB, Text, useTheme } from "react-native-paper";
import Animated, { LinearTransition } from "react-native-reanimated";


export default function Categories() {
	const theme = useTheme()
	const { openSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()
	const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
	const [availableCategories, setAvailableCategories] = useState<Category[]>([])
	const [newCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')
	const categoriesRef = useRef(availableCategories);


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
	}

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
			<Accordion type="single" collapsible className="w-full max-w-lg" defaultValue="item-1">
				<Animated.FlatList
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
							<AccordionTrigger className='p-0 items-center'>
								<CategoryCard
									refreshKey={newCategoryRefreshKey || 0}
									index={index}
									category={item}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-4 text-balance">
								<Text style={{ color: theme.colors.onSecondaryContainer }}>
									Our flagship product combines cutting-edge technology with sleek design. Built with
									premium materials, it offers unparalleled performance and reliability.
								</Text>
								<Text style={{ color: theme.colors.onSecondaryContainer }}>
									Key features include advanced processing capabilities, and an intuitive user interface
									designed for both beginners and experts.
								</Text>
							</AccordionContent>
						</AccordionItem>
					}
				/>
			</Accordion>


			<FAB
				// visible={false}
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
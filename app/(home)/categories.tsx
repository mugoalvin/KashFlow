import { Category } from "@/components/text/interface";
import AddCategory from "@/components/userInput/addCategory";
import Body from "@/components/views/body";
import CategoryCard from "@/components/views/categoryCard";
import useBottomSheetContext from "@/contexts/BottomSheetContext";
import { sqliteDB } from "@/db/config";
import { categoriesTable } from "@/db/sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useMMKVNumber } from "react-native-mmkv";
import { FAB, useTheme } from "react-native-paper";


export default function Categories() {
	const theme = useTheme()
	const { openSheet } = useBottomSheetContext()
	// const { transactionString } = useLocalSearchParams()
	// const transaction = JSON.parse(transactionString as string) as MpesaParced
	const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
	const [availableCategories, setAvailableCategories] = useState<Category[]>([])
	const [newCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

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
			<FlatList
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
				data={availableCategories}
				renderItem={({ item, index }) =>
					<CategoryCard
						refreshKey={newCategoryRefreshKey || 0}
						key={item.name}
						index={index}
						category={item}
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
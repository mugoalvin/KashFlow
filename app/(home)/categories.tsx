import { Category } from "@/components/text/interface";
import Body from "@/components/views/body";
import CategoryCard from "@/components/views/categoryCard";
import { sqliteDB } from "@/db/config";
import { categoriesTable } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useMMKVNumber } from "react-native-mmkv";
import { useTheme } from "react-native-paper";


export default function Categories() {
	const theme = useTheme()
	const { transactionString } = useLocalSearchParams()
	const transaction = JSON.parse(transactionString as string) as MpesaParced
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
		</Body>
	)
}
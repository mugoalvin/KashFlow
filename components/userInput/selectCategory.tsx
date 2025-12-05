import { sqliteDB } from "@/db/config";
import { categoriesTable, mpesaMessages } from "@/db/sqlite";
import { MpesaParced } from "@/interface/mpesa";
import { eq } from "drizzle-orm";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Category } from "../text/interface";
import LightText from "../text/lightText";
import CreateCategory from "./createCategory";
import SelectCategoryDropDown from "./selectCategoryDropDown";

interface SelectCategoryProps {
	transaction: MpesaParced
	closeModal: () => void
}

export default function SelectCategory({ closeModal, transaction }: SelectCategoryProps) {
	const theme = useTheme()
	const [selectedCategory, setSelectedCategory] = useState<Category>()
	const [isCreatingNewCategory, setIsCreatingNewCategory] = useState<boolean>(false)


	const didSetInitialCategory = useRef(false)

	useEffect(() => {
		const whereClause = transaction.categoryId
			? eq(categoriesTable.id, transaction.categoryId)
			: eq(categoriesTable.title, "Bills & Fees")

		sqliteDB
			.select()
			.from(categoriesTable)
			.where(whereClause)
			.then(categories => {
				setSelectedCategory(categories[0] as Category)
				didSetInitialCategory.current = true
			})
	}, [])

	useEffect(() => {
		if (didSetInitialCategory.current) {
			didSetInitialCategory.current = false
			return
		}

		if (selectedCategory?.id && transaction.counterparty) {
			sqliteDB
				.update(mpesaMessages)
				.set({ categoryId: selectedCategory.id })
				.where(eq(mpesaMessages.counterparty, transaction.counterparty as string))
				.then(console.log)
				.catch(console.error)
		}
	}, [selectedCategory, transaction.counterparty])


	function ValueDisplay({ title, value }: { title: string, value: string }) {
		return (
			<View className="flex-1">
				<LightText text={title} color={theme.colors.tertiary} />
				<Text variant="bodyLarge" className="text-xl">{value}</Text>
			</View>
		)
	}

	return (
		<View
			className="items-center p-5 mx-7 rounded-2xl gap-3 justify-between"
			style={{
				backgroundColor: theme.colors.secondaryContainer,
				aspectRatio: 1
			}}
		>
			{
				isCreatingNewCategory
					? <CreateCategory transaction={transaction} setIsCreatingNewCategory={setIsCreatingNewCategory} />
					:
					<>
						<Text
							className="uppercase"
							variant="headlineSmall"
							numberOfLines={2}
							ellipsizeMode="tail"
							style={{
								// @ts-expect-error
								color: transaction.type === 'receive' ? theme.colors.onSuccessContainer : theme.colors.onSecondaryContainer
							}}>
							{transaction.counterparty}
						</Text>

						<SelectCategoryDropDown selectedCategory={selectedCategory!} setSelectedCategory={setSelectedCategory} setIsCreatingNewCategory={setIsCreatingNewCategory} />

						<LightText text={`${transaction.parsedTime} on ${moment(transaction.parsedDate).format("ddd, Do MMM YY")}`} />

						<View className="flex-1 w-full">
							<ValueDisplay title="Amount" value={`Ksh ${transaction.amount}`} />
							<ValueDisplay title="Transaction Fee" value={`Ksh ${transaction.fee || 0}`} />
							<ValueDisplay title="Balance" value={`Ksh ${transaction.balance}`} />
						</View>
					</>
			}
		</View>
	)
}
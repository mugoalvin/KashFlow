import Body from "@/components/views/body";
import useSnackbarContext from "@/contexts/SnackbarContext";
import { sqliteDB } from "@/db/config";
import { categoriesTable, mpesaMessages } from "@/db/sqlite";
import { addCategoryToDatabase } from "@/utils/functions";
import { eq, sql } from "drizzle-orm";
import { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Settings() {
	const statusBarHeight = StatusBar.currentHeight
	const [textValue, setTextValue] = useState<string>()
	const [emoji, setEmoji] = useState<string>()
	const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true)
	const { showSnackbar } = useSnackbarContext()

	useEffect(() => {
		setIsBtnDisabled((textValue === "" || textValue === undefined) && (emoji === "" || emoji === undefined))
	}, [emoji, textValue])

	function deleteCategories() {
		sqliteDB.delete(categoriesTable)
			.then(console.log)
			.catch(console.error)
	}

	return (
		<Body style={{ paddingTop: statusBarHeight } as any} className="gap-5">

			<TextInput
				className="py-5"
				value={textValue}
				label="New Category Title"
				onChangeText={setTextValue}
			/>

			<TextInput
				className="py-5"
				value={emoji}
				label="Select Emoji"
				onChangeText={setEmoji}
			/>

			<Button
				mode="contained-tonal"
				disabled={isBtnDisabled}
				onPress={async () => {
					const res = await addCategoryToDatabase({
						title: textValue!.trim(),
						icon: emoji,
					})

					if (res?.changes && res?.changes > 0) {
						showSnackbar({
							message: `New Category inserted: ${textValue}`
						})
					}

					setTextValue('')
					setEmoji('')
				}}
			>
				Add New Category
			</Button>

			<View className="items-center justify-center gap-3">
				<Button
					mode="elevated"
					onPress={() => {
						sqliteDB.select().from(categoriesTable)
							.then(console.log)
							.catch(console.error)
					}}
				>
					Select Categories
				</Button>

				<Button
					mode="elevated"
					onPress={() => {
						sqliteDB.select().from(mpesaMessages)
							.orderBy(sql`${mpesaMessages.id} desc`)
							// .where(eq(mpesaMessages.counterparty, "Samuel  Gideon"))
							.limit(20)
							.then(console.log)
							.catch(console.error)
					}}
				>
					Select Messages
				</Button>

			</View>

			<Button
				mode="elevated"
				onPress={deleteCategories}
			>
				Delete Categories
			</Button>
		</Body>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settigns
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference
6. Bottom Tab Navigation label visibility mode
*/}
import useSnackbarContext from '@/contexts/SnackbarContext'
import { MpesaParced } from '@/interface/mpesa'
import { addCategoryToDatabase } from '@/utils/functions'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import SelectCategoryDropDown from './selectCategoryDropDown'

interface CreateCategoryProps {
	transaction: MpesaParced
	setIsCreatingNewCategory: (val: boolean) => void
}

export default function CreateCategory({ transaction, setIsCreatingNewCategory }: CreateCategoryProps) {
	const theme = useTheme()
	const { showSnackbar } = useSnackbarContext()
	const [textValue, setTextValue] = useState<string>()
	const [emoji, setEmoji] = useState<string>()
	const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true)

	useEffect(() => {
		setIsBtnDisabled((textValue === "" || textValue === undefined) && (emoji === "" || emoji === undefined))
	}, [emoji, textValue])


	return (
		<View className='flex-1 w-full  items-center justify-between'>
			<View className='w-full items-center justify-between gap-3'>
				<Text
					className="uppercase"
					variant="headlineSmall"
					numberOfLines={2}
					ellipsizeMode="tail"
					style={{
						// @ts-expect-error
						color: transaction.type === 'receive' ? theme.colors.onSuccessContainer : theme.colors.onSecondaryContainer
					}}
				>
					Create New Category
				</Text>

				<SelectCategoryDropDown selectedCategory={{
					name: "",
					title: textValue as string,
					icon: emoji
				}} />

				<View className='w-full gap-5'>
					<TextInput
						mode='outlined'
						style={{ maxHeight: 50, backgroundColor: theme.colors.elevation.level3 }}
						className="py-5 w-full"
						value={textValue}
						label="New Category Title"
						onChangeText={setTextValue}
					/>

					<TextInput
						mode='outlined'
						style={{ maxHeight: 50, backgroundColor: theme.colors.elevation.level3 }}
						className="py-5 w-full"
						value={emoji}
						label="Select Emoji"
						onChangeText={setEmoji}
					/>
				</View>
			</View>

			<View className='flex-row w-full justify-between'>
				<Button onPress={() => setIsCreatingNewCategory(false)}>
					<Ionicons name='chevron-back' className='mr-5' />
					Back
				</Button>

				<Button
					mode="contained"
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
						setIsCreatingNewCategory(false)
					}}
				>
					Create Category
				</Button>
			</View>
		</View>

	)
}
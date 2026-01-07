import useBottomSheetContext from '@/contexts/BottomSheetContext'
import useSnackbarContext from '@/contexts/SnackbarContext'
import { sqliteDB } from '@/db/config'
import { categoriesTable } from '@/db/sqlite'
import { updateCategoryToDatabase } from '@/utils/functions'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { eq } from 'drizzle-orm'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useMMKVNumber } from 'react-native-mmkv'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { Category } from '../text/interface'
import Title from '../text/title'

interface EditCategoryProps {
	id: number
}

export default function EditCategory({ id }: EditCategoryProps) {
	const theme = useTheme()
	const { closeSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()
	const highestTextLength = 20
	const [emojiCount, setEmojiCount] = useState<number>(1)
	const [textCount, setTextCount] = useState<number>(highestTextLength)

	const [currentCategory, setCurrentCategory] = useState<Category>()
	const [category, setCategory] = useState<string>(currentCategory?.title || '')
	const [emoji, setEmoji] = useState<string>(currentCategory?.icon || '')

	const [, setNewCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

	useEffect(() => {
		sqliteDB
			.select()
			.from(categoriesTable)
			.where(eq(categoriesTable.id, id))

			.then(categories =>
				// @ts-ignore
				setCurrentCategory(categories[0])
			)
	}, [id])

	useEffect(() => {
		if (currentCategory) {
			setCategory(currentCategory.title)
			setEmoji(currentCategory.icon)
		}
	}, [currentCategory])

	return (
		<View className='py-5 gap-3'>
			<Title
				text='Create Category'
				fontSize={theme.fonts.titleMedium.fontSize}
				color={theme.colors.onSecondaryContainer}
			/>

			<View className='w-full'>
				<TextInput
					mode='outlined'
					left={
						<TextInput.Icon
							icon={() => <MaterialIcons name="category" size={20} color={theme.colors.primary} />}
						/>
					}
					placeholder='eg. Bills'
					label="Title"
					value={category}
					right={
						<TextInput.Affix
							text={`/${textCount}`}
							textStyle={{
								color: theme.colors.primary
							}}
						/>
					}
					style={{
						backgroundColor: theme.colors.elevation.level5
					}}
					onChangeText={input => {
						setTextCount(highestTextLength - input.length)
						setCategory(input)
					}}
				/>
			</View>

			<View className='w-full'>
				<TextInput
					mode='outlined'
					left={
						<TextInput.Icon
							icon={() => <Entypo name="emoji-flirt" size={20} color={theme.colors.primary} />}
						/>
					}
					placeholder='eg. 😃'
					label="Emoji"
					value={emoji}
					right={
						<TextInput.Affix
							text={`/${emojiCount}`}
							textStyle={{
								color: theme.colors.primary
							}}
						/>
					}
					style={{
						backgroundColor: theme.colors.elevation.level5
					}}
					keyboardType='ascii-capable'
					passwordRules="maxlength: 1;"
					onChangeText={input => {
						setEmojiCount(1 - input.length)
						setEmoji(input)
					}}
				/>
			</View>

			<Button
				disabled={!category || !emoji}
				mode='contained'
				onPress={async () => {
					closeSheet()

					const res = await updateCategoryToDatabase({
						id,
						title: category!.trim(),
						icon: emoji,
					})

					setNewCategoryRefreshKey(prev => prev ? prev + 1 : 1)

					if (res?.changes && res?.changes > 0) {
						showSnackbar({
							message: `Category Updated: ${category}`
						})
					}

					setCategory('')
					setEmoji('')
				}}
			>
				Update
			</Button>
		</View>
	)
}
import useBottomSheetContext from '@/contexts/BottomSheetContext'
import useSnackbarContext from '@/contexts/SnackbarContext'
import { renameSubCategoryInDatabase } from '@/utils/functions'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useMMKVNumber } from 'react-native-mmkv'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import { SubCategory } from '../text/interface'

interface RenameSubCategoryProps {
	subCategory: Pick<SubCategory, 'id' | 'title'>
}

export default function RenameSubCategory({ subCategory }: RenameSubCategoryProps) {
	console.log(subCategory)
	const theme = useTheme()
	const { closeSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()
	const highestTextLength = 20
	const [textCount, setTextCount] = useState<number>(highestTextLength)
	const [newSubCategoryTitle, setNewSubCategoryTitle] = useState<string>(subCategory.title)
	const [, setNewCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

	return (
		<View className='p-3 gap-3'>
			<Text className='text-xl'>Rename</Text>
			<Text className='text-3xl font-bold'>{subCategory.title}</Text>
			<Text className='text-xl'>to</Text>

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
					value={newSubCategoryTitle}
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
						setNewSubCategoryTitle(input)
					}}
				/>
			</View>

			<Button
				disabled={!newSubCategoryTitle}
				mode='contained'

				onPress={async () => {
					closeSheet()

					const res = await renameSubCategoryInDatabase({
						id: subCategory.id,
						newCategoryTitle: newSubCategoryTitle!
					})

					setNewCategoryRefreshKey(prev => prev ? prev + 1 : 1)

					if (res?.changes && res?.changes > 0) {
						showSnackbar({
							message: `${subCategory.title!.trim()} renamed to ${newSubCategoryTitle}`
						})
					}

					setNewSubCategoryTitle('')
				}}
			>
				Rename
			</Button>
		</View>
	)
}
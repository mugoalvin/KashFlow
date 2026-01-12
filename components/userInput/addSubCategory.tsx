import useBottomSheetContext from '@/contexts/BottomSheetContext'
import useSnackbarContext from '@/contexts/SnackbarContext'
import { addSubCategoryToDatabase } from '@/utils/functions'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useMMKVNumber } from 'react-native-mmkv'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { Category } from '../text/interface'
import Title from '../text/title'

interface AddSubCategoryProps {
	category: Category
}

export default function AddSubCategory({ category }: AddSubCategoryProps) {
	const theme = useTheme()
	const { closeSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()

	const [subCategory, setSubCategory] = useState<string>()

	const highestTextLength = 20
	const [textCount, setTextCount] = useState<number>(highestTextLength)

	const [, setNewCategoryRefreshKey] = useMMKVNumber('newCategoryRefreshKey')

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
						setSubCategory(input)
					}}
				/>
			</View>

			<Button
				disabled={!subCategory}
				mode='contained'

				onPress={async () => {
					closeSheet()

					const res = await addSubCategoryToDatabase({
						categoryId: category.id,
						title: subCategory!.trim(),
					})

					setNewCategoryRefreshKey(prev => prev ? prev + 1 : 1)

					if (res?.changes && res?.changes > 0) {
						showSnackbar({
							message: `${subCategory!.trim()} added under ${category.title}`
						})
					}

					setSubCategory('')
				}}
			>
				Create
			</Button>

		</View>
	)
}
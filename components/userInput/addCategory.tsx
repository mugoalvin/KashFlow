import useBottomSheetContext from '@/contexts/BottomSheetContext';
import useSnackbarContext from '@/contexts/SnackbarContext';
import { addCategoryToDatabase } from '@/utils/functions';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useMMKVNumber } from 'react-native-mmkv';
import { Button, TextInput, useTheme } from 'react-native-paper';
import Title from '../text/title';

export default function AddCategory() {
	const theme = useTheme()
	const { closeSheet } = useBottomSheetContext()
	const { showSnackbar } = useSnackbarContext()
	const highestTextLength = 20
	const [emojiCount, setEmojiCount] = useState<number>(1)
	const [textCount, setTextCount] = useState<number>(highestTextLength)

	const [category, setCategory] = useState<string>()
	const [emoji, setEmoji] = useState<string>()

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

					const res = await addCategoryToDatabase({
						title: category!.trim(),
						icon: emoji,
					})

					setNewCategoryRefreshKey(prev => prev ? prev + 1 : 1)

					if (res?.changes && res?.changes > 0) {
						showSnackbar({
							message: `New Category inserted: ${category}`
						})
					}

					setCategory('')
					setEmoji('')
				}}
			>
				Create
			</Button>

		</View>
	)
}
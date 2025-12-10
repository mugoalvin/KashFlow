import ColorRow from '@/components/settings/colorRow'
import React from 'react'
import { View } from 'react-native'
import { Icon, Text, useTheme } from 'react-native-paper'

interface SelectThemeProps {
	closeSheet: () => void
}

export default function SelectTheme({ closeSheet }: SelectThemeProps) {
	const theme = useTheme()

	return (
		<View className='gap-5'>

			<View className='gap-2'>
				<Icon source={require('assets/icons/paint.png')} size={30} color={theme.colors.onSecondaryContainer} />
				<Text variant='headlineMedium'>Select Theme</Text>
				<Text>Select one of the colors to change the color theme</Text>
			</View>

			<ColorRow title='Default Color' closeSheet={closeSheet} />
			<ColorRow title='Other Theme' closeSheet={closeSheet} colors={[
				'#ad332d',
				'#ad702f',
				'#adad2a',
				'#59a82c',
				'#2aa19d',
				'#286f99',
				'#293496',
				'#502994',
				'#772996',
				'#7c269e',
				'#992574'
			]} />

		</View>
	)
}
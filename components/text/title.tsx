import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { MyTextProps } from './interface'

export default function Title({ color, text, leadingIcon, trailingIcon }: MyTextProps) {
	const theme = useTheme()

	return (
		<View className='flex-row items-center justify-between'>
			<View className='flex-row gap-3 items-baseline'>
				{leadingIcon}
				<Text
					style={{
						fontSize: theme.fonts.labelLarge.fontSize,
						color: color || theme.colors.onSurfaceDisabled
					}}>
					{text || "Title Here"}
				</Text>
			</View>
			{trailingIcon}
		</View>
	)
}
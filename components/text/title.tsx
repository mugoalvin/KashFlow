import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { MyTextProps } from './interface'

export default function Title({ color, text, leadingIcon, trailingIcon, fontSize, fontWeight }: MyTextProps) {
	const theme = useTheme()

	return (
		<View className='flex-row items-center justify-between'>
			<View className='flex-row gap-3 items-baseline'>
				{leadingIcon}
				<Text
					style={{
						// fontSize: fontSize || theme.fonts.labelLarge.fontSize,
						fontSize: fontSize || theme.fonts.titleMedium.fontSize,
						fontWeight: fontWeight || theme.fonts.labelLarge.fontWeight,
						color: color || theme.colors.onSurfaceDisabled
					}}>
					{text || "Title Here"}
				</Text>
			</View>
			{trailingIcon}
		</View>
	)
}
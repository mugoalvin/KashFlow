import React from 'react'
import { Text, useTheme } from 'react-native-paper'
import { MyTextProps } from './interface'

export default function LightText({ color, className, text }: MyTextProps) {
	const theme = useTheme()

	return (
		<Text
			className={className}
			style={{
				fontWeight: 'bold',
				color: color || theme.colors.onSurfaceDisabled
			}}
		>
			{text}
		</Text>
	)
}
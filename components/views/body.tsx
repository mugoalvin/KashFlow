import React from "react";
import { StatusBar, StyleProp, useColorScheme, View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

interface BodyProps {
	children?: React.ReactNode
	className?: string
	style?: StyleProp<ViewProps>
}

export default function Body({ children, className, style }: BodyProps) {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	return (
		<>
			<View
				className={`flex-1 p-2 ${className}`}
				style={{
					backgroundColor: theme.colors.background,
					// marginBottom: 80,
					...(typeof style === "object" && !Array.isArray(style) ? style : {})
				}}
			>
				{children}
			</View>
			<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
		</>
	)
}
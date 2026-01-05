import React from "react";
import { StatusBar, StyleProp, useColorScheme, View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

interface BodyProps {
	children?: React.ReactNode
	className?: string
	noPadding?: boolean
	style?: StyleProp<ViewProps>
	noBottomNav?: boolean
}

export default function Body({ children, noPadding = false, className, style, noBottomNav }: BodyProps) {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	return (
		<>
			<View
				className={`flex-1 ${noPadding ? "p-0" : "p-2"} ${className}`}
				style={{
					backgroundColor: theme.colors.background,
					marginBottom: noBottomNav ? 0 : 80,
					...(typeof style === "object" && !Array.isArray(style) ? style : {})
				}}
			>
				{children}
			</View>
			<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
		</>
	)
}
import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface BodyProps {
	children?: React.ReactNode
	className?: string
}

export default function Body({ children, className }: BodyProps) {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	return (
		<>
			<SafeAreaView
				className={`flex-1 ${className}`}
				style={{
					backgroundColor: theme.colors.background
				}}
			>
				{children}
			</SafeAreaView>
			<StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
		</>
	)
}
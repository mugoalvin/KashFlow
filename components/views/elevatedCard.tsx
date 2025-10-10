import { ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

interface ElevatedCardProps {
	className?: string
	children?: ReactNode
}

export default function ElevatedCard({ children, className }: ElevatedCardProps) {
	const theme = useTheme()

	return (
		<View
			style={{
				backgroundColor: theme.colors.elevation.level1
			}}
			className={`rounded ${className}`}
		>
			{children}
		</View>
	)
}
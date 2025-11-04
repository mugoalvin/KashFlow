import { ReactNode } from "react";
import { View } from "react-native";

interface ChipViewProps {
	children: ReactNode
}

export default function ChipView({ children }: ChipViewProps) {
	return (
		<View className="flex-row gap-2 mb-2 flex-wrap">
			{children}
		</View>
	)
}
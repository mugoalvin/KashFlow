import Body from "@/components/views/body";
import useThemeContext from "@/contexts/ThemeContext";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function Page() {
	const theme = useTheme()
	const { resetTheme, updateTheme } = useThemeContext()
	const [value, setValue] = useState<string>("bf7b24")

	return (
		<Body className="items-center justify-center gap-5">
			<Text>{value}</Text>

			<View className="flex-row w-full">
				<TextInput
					value={value}
					label="Enter Hex"
					style={{
						flex: 1,
						backgroundColor: theme.colors.elevation.level2
					}}
					onChangeText={setValue}
				/>
			</View>

			<Button
				mode="contained-tonal"
				onPress={resetTheme}
			>
				Reset Theme
			</Button>

			<Button
				mode="contained-tonal"
				onPress={() => {
					updateTheme(
						value
					)
				}}
			>
				Update Theme
			</Button>


		</Body>
	)
}

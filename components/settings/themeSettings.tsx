import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { List, useTheme } from 'react-native-paper'

interface ThemeSettingsProps {
	openSheet: () => void
}

export default function ThemeSettings({ openSheet }: ThemeSettingsProps) {
	const theme = useTheme()

	return (
		<List.Section title="Theme" titleStyle={{ color: theme.colors.onSurfaceDisabled }}>
			<List.Item
				title="App Theme"
				onPress={openSheet}
				right={() =>
					<Ionicons name='chevron-forward' color={theme.colors.onSurfaceVariant} />
				}
			/>
		</List.Section>
	)
}
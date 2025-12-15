import useSnackbarContext from '@/contexts/SnackbarContext'
import { Ionicons } from '@expo/vector-icons'
import { isDynamicThemeSupported } from '@pchmn/expo-material3-theme'
import React from 'react'
import { List, useTheme } from 'react-native-paper'
import { getTextStyles } from '../text/styles'

interface ThemeSettingsProps {
	openSheet: () => void
}

export default function ThemeSettings({ openSheet }: ThemeSettingsProps) {
	const theme = useTheme()
	const { showSnackbar } = useSnackbarContext()


	return (
		<List.Section title="Theme" titleStyle={getTextStyles(theme).SettingsSectionHeader}>
			<List.Item
				title="Material Theme Compatibility"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="Click to check whether your device is compatible with Dynamic Material Theme"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				onPress={() => showSnackbar({
					message: `Device is ${!isDynamicThemeSupported ? 'not ' : ''}compatible with Dynamic Material Theme`,
					isError: !isDynamicThemeSupported
				})}
			/>

			<List.Item
				title="App Theme"
				description="Choose your desired accent color"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				onPress={openSheet}
				right={() =>
					<Ionicons name='chevron-forward' color={theme.colors.onSurfaceVariant} />
				}
			/>
		</List.Section>
	)
}
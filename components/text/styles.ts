import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

export function getTextStyles(theme: MD3Theme) {
	return StyleSheet.create({
		SettingsSectionHeader: {
			fontSize: theme.fonts.bodyLarge.fontSize,
			fontWeight: 'bold',
			color: theme.colors.onSurfaceDisabled
		},
		SettingsTitle: {
			fontSize: theme.fonts.bodyLarge.fontSize
		},
		SettingsDescription: {
			fontSize: theme.fonts.bodySmall.fontSize,
			fontStyle: 'italic',
			color: theme.colors.onSurfaceDisabled
		}
	})
}
import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

export function getDropDownStyles(theme: MD3Theme) {
	return StyleSheet.create({
		menuContent: {
			backgroundColor: theme.colors.background,
			outlineWidth: 1,
			outlineColor: theme.colors.outlineVariant
		},
		separator: {
			backgroundColor: theme.colors.outlineVariant
		},
		contextMenuContent: {
			width: 200,
			// backgroundColor: theme.colors.elevation.level1,
		}
	})
}

export function getDropDownMenuItemAndroidRipple(theme: MD3Theme) {
	return {
		color: theme.colors.secondaryContainer,
		foreground: true
	}
}
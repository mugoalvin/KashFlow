import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

export function getSkeletonStyle(theme: MD3Theme) {
	return StyleSheet.create({
		backGround: {
			backgroundColor: theme.colors.elevation.level5
		}
	})
}
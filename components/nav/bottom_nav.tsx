import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs" 
import { useTheme } from "react-native-paper"

export default function NativeBottomTab() {
	const theme = useTheme()

	return (
		<NativeTabs
			tintColor={theme.colors.tertiary}
			backgroundColor={theme.colors.elevation.level1}
			labelVisibilityMode='selected'
			indicatorColor={theme.colors.surfaceVariant}
		>
			<NativeTabs.Trigger name='(home)'>
				<Label>Home</Label>
				<Icon drawable='home' />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(transactions)'>
				<Label>Transactions</Label>
				<Icon drawable='ic_menu_recent_history' />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='settings'>
				<Label>Settings</Label>
				<Icon drawable='ic_menu_manage' />
			</NativeTabs.Trigger>

		</NativeTabs>
	)
}
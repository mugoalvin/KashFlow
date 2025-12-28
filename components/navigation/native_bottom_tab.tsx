import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useMMKVString } from "react-native-mmkv";
import { useTheme } from "react-native-paper";

export default function NativeBottomTab() {
	const theme = useTheme()
	const [mode] = useMMKVString('labelVisibilityMode')

	return (
		<NativeTabs
			labelVisibilityMode={mode ? mode as "auto" | "selected" | "labeled" | "unlabeled" : 'auto'}
			backBehavior="history"
			indicatorColor={theme.colors.secondaryContainer}
			tintColor={theme.colors.onPrimaryContainer}
			backgroundColor={theme.dark ? theme.colors.elevation.level1 : theme.colors.elevation.level2}
		>

			<NativeTabs.Trigger name='(home)'>
				<Label>Home</Label>
				{/* <Icon drawable='home' /> */}
				<Icon drawable='ic_menu_mylocation' />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(transactions)'>
				<Label>Transactions</Label>
				<Icon drawable='ic_menu_recent_history' />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(settings)'>
				<Label>Settings</Label>
				{/* <Icon drawable="settings" /> */}
				<Icon drawable='ic_menu_manage' />
			</NativeTabs.Trigger>

		</NativeTabs>
	)
}
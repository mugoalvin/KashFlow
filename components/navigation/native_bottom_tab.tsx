import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

import { useMMKVString } from "react-native-mmkv";
import { useTheme } from "react-native-paper";

export default function NativeBottomTab() {
	const theme = useTheme()
	const [mode] = useMMKVString('labelVisibilityMode')

	return (
		<NativeTabs
			// @ts-expect-error
			labelVisibilityMode={mode ? mode : 'auto'}
			backBehavior="history"
			indicatorColor={theme.colors.secondaryContainer}
			tintColor={theme.colors.onPrimaryContainer}
			backgroundColor={theme.dark ? theme.colors.elevation.level1 : theme.colors.elevation.level2}
		>

			<NativeTabs.Trigger name='(home)'>
				<Label>Home</Label>
				<Icon drawable='home' />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(transactions)'>
				<Label>Transactions</Label>
				<Icon src={require("@/assets/icons/bar-chart-2.svg")} />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(settings)'>
				<Label>Settings</Label>
				<Icon drawable="settings" />
			</NativeTabs.Trigger>

		</NativeTabs>
	)
}
import { Feather } from "@expo/vector-icons";
import { Icon, Label, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
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

			<NativeTabs.Trigger name='(a_home)'>
				<Label>Home</Label>
				{
					Platform.select({
						android: <Icon src={<VectorIcon key='home_icon' family={Feather} name="home" />} />
					})
				}
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='(transactions)'>
				<Label>Transactions</Label>
				{
					Platform.select({
						android: <Icon src={<VectorIcon key='transaction_icon' family={Feather} name="activity" />} />
					})
				}
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="(categories)">
				<Label>Categories</Label>
				{
					Platform.select({
						android: <Icon src={<VectorIcon key='categories_icon' family={Feather} name='folder' />} />
					})
				}
			</NativeTabs.Trigger>

		</NativeTabs>
	)
}
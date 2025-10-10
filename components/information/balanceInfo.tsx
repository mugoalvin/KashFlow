import Entypo from '@expo/vector-icons/Entypo';
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Title from "../text/title";

interface BalanceInfoProps {
	balance: number
}

export default function BalanceInfo({ balance }: BalanceInfoProps) {
	const theme = useTheme()
	return (
		<View className="gap-3 mb-5">
			<Title
				leadingIcon={<Entypo name="wallet" size={16} color={theme.colors.primary} />}
				text="Your Balance"
			/>
			<Text
				variant="displaySmall"
				style={{
					color: theme.colors.primary,
					fontWeight: "bold",
					alignSelf: "flex-end"
				}}
			>
				Ksh {balance}
			</Text>
		</View>
	)
}
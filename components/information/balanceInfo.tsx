import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { IconButton, Text, useTheme } from "react-native-paper";
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
				trailingIcon={
					<IconButton
						icon={() => <Ionicons name='eye-off' size={16} color={theme.colors.primary} />}
						onPress={() => { }}
					/>
				}
			/>
			<View className='flex-row justify-center items-baseline gap-2'>
				<Text
					variant="headlineMedium"
					style={{
						color: theme.colors.primary,
					}}
				>
					Ksh
				</Text>
				<AnimatedNumbers
					animateToNumber={balance}
					animationDuration={2200}
					includeComma
					fontStyle={{
						fontSize: theme.fonts.headlineSmall.fontSize,
						color: theme.colors.primary,
						fontWeight: "bold",
						alignSelf: "flex-end"
					}}
				/>
			</View>
		</View>
	)
}
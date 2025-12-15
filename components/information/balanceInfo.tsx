import { sqliteDB } from '@/db/config';
import { getBalance } from '@/db/db_functions';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useState } from 'react';
import { View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { useMMKVBoolean } from 'react-native-mmkv';
import { IconButton, Text, useTheme } from "react-native-paper";
import Title from "../text/title";

interface BalanceInfoProps {
	refreshKey: number
}

export default function BalanceInfo({ refreshKey }: BalanceInfoProps) {
	const theme = useTheme()
	const [balance, setBalance] = useState<number>(0)
	const [isBalanceHidden, setIsBalanceHidden] = useMMKVBoolean('isMpesaHidden')

	useEffect(() => {
		getBalance(sqliteDB)
			.then(setBalance)
	}, [refreshKey])

	return (
		<View className="gap-3 mb-5">
			<Title
				leadingIcon={<Entypo name="wallet" size={16} color={theme.colors.primary} />}
				text="Your Balance"
				trailingIcon={
					<IconButton
						icon={() => <Ionicons name={isBalanceHidden ? 'eye-off' : 'eye'} size={16} color={theme.colors.primary} />}
						onPress={() => setIsBalanceHidden(prev => !prev)}
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
				{
					isBalanceHidden ?
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
						/> :
						<Text style={{ color: theme.colors.primary, }}>_____</Text>
				}
			</View>
		</View>
	)
}
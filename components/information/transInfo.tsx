import { Mpesa } from '@/interface/mpesa'
import { parseMpesaMessage } from '@/utils/functions'
import React from 'react'
import { Pressable, View } from 'react-native'
import { Divider, Icon, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated'

import useDialogContext from '@/contexts/DialogContext'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import LightText from '../text/lightText'


interface TransInfoProps {
	item: Mpesa
	index: number
	length: number
}

export default function TransInfo({ item, index, length }: TransInfoProps) {
	const theme = useTheme()
	const object = parseMpesaMessage(item.body)
	const { showDialog } = useDialogContext()

	const counterParty = (object.counterparty)?.toLowerCase().split(' ').map(word =>
		word.slice(0, 1).toUpperCase().concat(word.slice(1)).concat(' ')
	)
	const transactionType = (object.type)
		? object.type.charAt(0).toUpperCase() + object.type.slice(1)
		: ''

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable)


	return (
		<>
			{
				index !== 0 &&
				<Divider horizontalInset style={{ height: 1, backgroundColor: theme.colors.background }} />
			}
			<AnimatedPressable
				android_ripple={{
					color: theme.colors.secondaryContainer,
					foreground: true
				}}
				className={`flex-row justify-between p-4 ${index === 0 ? 'rounded-s-3xl rounded-e-md' : 'rounded-md'} ${index + 1 === length ? 'rounded-e-3xl' : 'rounded-md'}`}
				entering={FadeInLeft.duration(500).delay(index * 100)}
				exiting={FadeOutRight.duration(500).delay(index * 80)}
				style={{
					backgroundColor: theme.colors.elevation.level1
				}}
				onPress={() => showDialog({
					title: "Transaction Message",
					message: object.message!,
					actions: [{
						dialogText: "OK",
						action: () => { }
					}]
				})}
			>
				<View>
					<Text>{index + 1}. {counterParty}</Text>
					<LightText className="ms-4 text-sm" text={transactionType} />
				</View>
				<View className='flex-row justify-between min-w-24'>
					<Icon source={() =>
						<FontAwesome6
							name={object.type === 'receive' ? "arrow-up-long" : "arrow-down-long"}
							size={14}
							color={object.type === 'receive' ? "green" : "red"}
						/>
					}
						size={16} />
					<Text>Ksh.{object.amount}</Text>
				</View>
			</AnimatedPressable>
		</>
	)
}
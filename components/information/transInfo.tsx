import useDialogContext from '@/contexts/DialogContext'
import { useAnimations } from '@/contexts/useAnimations'
import useReduceMotion from '@/hooks/useReduceMotion'
import { MpesaParced } from '@/interface/mpesa'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import moment from 'moment'
import React from 'react'
import { Pressable, View } from 'react-native'
import { Divider, Icon, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInLeft } from 'react-native-reanimated'
import LightText from '../text/lightText'


interface TransInfoProps {
	item: MpesaParced
	index: number
	length: number
}

export default function TransInfo({ item, index, length }: TransInfoProps) {
	const theme = useTheme()
	const { showDialog } = useDialogContext()

	const counterParty = (item.counterparty)?.toLowerCase().split(' ').map(word =>
		word.slice(0, 1).toUpperCase().concat(word.slice(1)).concat(' ')
	)
	const transactionType = (item.type)
		? item.type.charAt(0).toUpperCase() + item.type.slice(1)
		: ''

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

	// function getTimeFromTransaction(timeString: string): string {
	// 	return moment(timeString, "DD/MM/YY [at] h:mm A").fromNow();
	// }


	// Animation Preferences
	const reduceMotion = useReduceMotion()
	const { enabled: userAnimationsEnabled } = useAnimations()
	const animationEnabled = userAnimationsEnabled && !reduceMotion


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
				className={`flex-row justify-between p-4 ${length === 1
					? 'rounded-3xl'
					: index === 0
						? 'rounded-s-3xl rounded-e-md'
						: index + 1 === length
							? 'rounded-e-3xl'
							: 'rounded-md'
					}`}

				entering={animationEnabled ? FadeInLeft.duration(500).delay(index * 100) : undefined}
				// exiting={animationEnabled ? FadeOutRight.duration(500).delay(index * 80) : undefined}
				style={{
					backgroundColor: theme.colors.elevation.level1
				}}
				onPress={() => showDialog({
					title: "Transaction Message",
					message: item.message!,
					actions: [{
						dialogText: "Cancel",
						action: () => { }
					}]
				})}
			>
				<View className='flex-1 pe-2'>
					<Text numberOfLines={1} ellipsizeMode='tail'>{index + 1}. {counterParty}</Text>
					{/* <LightText className="ms-4 text-sm" text={`${transactionType} : ${getTimeFromTransaction(item.rawTime!)}`} /> */}
					<LightText className="ms-4 text-sm" text={`${transactionType} : ${item.parsedTime}`} />
				</View>
				<View className='flex-row justify-between min-w-24'>
					<Icon source={() =>
						<FontAwesome6
							name={item.type === 'receive' ? "arrow-up-long" : "arrow-down-long"}
							size={14}
							color={item.type === 'receive' ? "green" : "red"}
						/>
					}
						size={16} />
					<Text>Ksh.{item.amount}</Text>
				</View>
			</AnimatedPressable>
		</>
	)
}
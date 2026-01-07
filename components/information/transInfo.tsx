import useDialogContext from '@/contexts/DialogContext'
import useModalContext from '@/contexts/ModalContext.'
import { MpesaParced } from '@/interface/mpesa'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import React from 'react'
import { Pressable, Vibration, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { Divider, Icon, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInLeft, FadeOutRight, LinearTransition } from 'react-native-reanimated'
import LightText from '../text/lightText'


interface TransInfoProps {
	item: MpesaParced
	index: number
	length: number
}

export default function TransInfo({ item, index, length }: TransInfoProps) {
	const theme = useTheme()
	const { showDialog } = useDialogContext()
	const { showModal } = useModalContext()
	const [useCard] = useMMKVBoolean('useCard')
	const [animationEnabled] = useMMKVBoolean('isAnimationEnabled')
	const [useMinTransInfo] = useMMKVBoolean('isTransInfoMin')


	const counterParty = (item.counterparty)?.toLowerCase().split(' ').map(word =>
		word.slice(0, 1).toUpperCase().concat(word.slice(1)).concat(' ')
	)
	const transactionType = (item.type)
		? item.type.charAt(0).toUpperCase() + item.type.slice(1)
		: ''

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

	return (
		<>
			{
				index !== 0 && useCard &&
				<Divider
					horizontalInset={useCard}
					style={{
						height: 1,
						backgroundColor: useCard ? theme.colors.background : theme.colors.outlineVariant
					}} />
			}
			<AnimatedPressable
				android_ripple={{
					color: theme.colors.secondaryContainer,
					foreground: true
				}}

				className={
					`flex-row justify-between ${useCard ? 'px-4' : 'px-1'} ${useCard ? 'py-4' : 'py-3'}
						${length === 1
						? 'rounded-3xl'
						: index === 0
							? 'rounded-s-3xl rounded-e-md'
							: index + 1 === length
								? 'rounded-e-3xl rounded-t-md'
								: 'rounded-md'
					}`
				}

				entering={animationEnabled ? FadeInLeft.duration(500).delay(index * 100) : undefined}
				exiting={animationEnabled ? FadeOutRight.duration(500).delay(index * 80) : undefined}
				layout={LinearTransition.duration(500)}
				style={{
					backgroundColor: useCard ? theme.colors.elevation.level1 : theme.colors.background
				}}
				onPress={() => showDialog({
					title: "Transaction Message",
					message: item.message!,
					actions: [{
						dialogText: "Cancel",
						action: () => { }
					}]
				})}
				onLongPress={() => {
					Vibration.vibrate(75)
					showModal({
						visibility: true,
						transaction: item
					})
				}}
			>
				<View className='flex-1 pe-2'>
					<Text numberOfLines={1} ellipsizeMode='tail'>{counterParty}</Text>
					{
						!useMinTransInfo &&
						<LightText fontSize={12} text={`${transactionType} : ${item.parsedTime}`} />
					}
				</View>
				<View className={`flex-row justify-between ${!useMinTransInfo && 'min-w-24'}`}>
					{
						!useMinTransInfo &&
						<Icon source={() =>
							<FontAwesome6
								name={item.type === 'receive' ? "arrow-up-long" : "arrow-down-long"}
								size={14}
								color={item.type === 'receive' ? "green" : "red"}
							/>
						}
							size={16}
						/>
					}
					<View className='gap-1 items-end'>
						{/* @ts-expect-error */}
						<Text style={{ color: item.type === 'receive' || item.type === 'fuliza' ? theme.colors.success : theme.colors.error }}>{item.type === 'receive' || item.type === 'fuliza' || "- "}Ksh. {item.amount || item.paid}</Text>
						{
							useMinTransInfo &&
							<LightText className="text-sm" text={item.parsedTime} fontSize={theme.fonts.bodySmall.fontSize} />
						}
					</View>
				</View>
			</AnimatedPressable>
		</>
	)
}
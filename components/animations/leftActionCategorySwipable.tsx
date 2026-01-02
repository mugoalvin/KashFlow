import React from 'react'
import { Icon, useTheme } from 'react-native-paper'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

interface LeftActionCategorySwipableProps {
	translationX: SharedValue<number>
}

export default function LeftActionCategorySwipable({ translationX }: LeftActionCategorySwipableProps) {
	const theme = useTheme()
	const ACTION_WIDTH = 80

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				translationX.value,
				[ACTION_WIDTH, ACTION_WIDTH / 4],
				[theme.colors.tertiaryContainer, theme.colors.background]
			)
		}
	})

	return (
		<Animated.View
			className='justify-center items-center'
			style={[animatedStyle, { width: ACTION_WIDTH }]}
		>
			<Icon
				source="pencil-outline"
				color={theme.colors.onSecondaryContainer}
				size={24}
			/>
		</Animated.View>
	)
}
import Body from '@/components/views/body'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useTheme } from 'react-native-paper'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

export default function GesturePage() {
	const theme = useTheme()
	const _PADDING = useSharedValue(20)
	const translateX = useSharedValue<number>(0)
	const translateY = useSharedValue<number>(0)
	const color = useSharedValue<string>(theme.colors.primary)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: color.value,
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value }
			],
			padding: _PADDING.value,
		}
	})

	const gesture = Gesture.Pan()
		// .onStart(() => {
		// 	_PADDING.value = withSpring(_PADDING.value + 10)
		// 	color.value = withTiming(theme.colors.errorContainer)
		// })
		.onUpdate((event) => {
			// console.log(event)
			translateX.value = event.translationX
			translateY.value = event.translationY
		})
		.onFinalize(() => {
			translateX.value = withSpring(0, { duration: 100, energyThreshold: .1 })
			translateY.value = withSpring(0, { duration: 100, energyThreshold: .1 })
		})


	return (
		<Body className='items-center justify-center'>
			<GestureDetector gesture={gesture}>
				<Animated.View
					style={[{
						borderRadius: 30,
					}, animatedStyle]}
				/>
			</GestureDetector>
		</Body>
	)
}
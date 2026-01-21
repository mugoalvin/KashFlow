import Body from '@/components/views/body'
import { sqliteDB } from '@/db/config'
import { subCategoriesTable } from '@/db/sqlite'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Button, useTheme } from 'react-native-paper'
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

			<Button
				onPress={() => {
					Haptics.performAndroidHapticsAsync(
						Haptics.AndroidHaptics.Long_Press
					)

					sqliteDB
						.select()
						// .from(categoriesTable)
						.from(subCategoriesTable)

						.then(res => {
							console.log(
								res
							)
						})
				}}
			>
				Perform Action
			</Button>
		</Body>
	)
}
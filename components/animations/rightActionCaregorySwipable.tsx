import { Icon, useTheme } from 'react-native-paper'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

interface RightActionCategorySwipableProps {
	translationX: SharedValue<number>
}

export default function RightActionCategorySwipable({ translationX }: RightActionCategorySwipableProps) {
	const theme = useTheme()
	const ACTION_WIDTH = 80

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				translationX.value,
				[ACTION_WIDTH * -1, ACTION_WIDTH / 4 * -1],
				[theme.colors.errorContainer, theme.colors.background]
			)
		}
	})

	return (
		<Animated.View
			className='justify-center items-center'
			style={[animatedStyle, { width: ACTION_WIDTH }]}
		>
			<Icon
				source="delete"
				color={theme.colors.onErrorContainer}
				size={24}
			/>
		</Animated.View>
	)
}
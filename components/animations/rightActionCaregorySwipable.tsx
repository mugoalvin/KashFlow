import { Pressable } from 'react-native'
import { Icon, useTheme } from 'react-native-paper'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

interface RightActionCategorySwipableProps {
	category_id: number
	translationX: SharedValue<number>
	onDelete?: (id: number) => void
}

export default function RightActionCategorySwipable({ category_id, translationX, onDelete }: RightActionCategorySwipableProps) {
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
			style={[animatedStyle, { width: ACTION_WIDTH }]}
		>
			<Pressable
				className='flex-1 justify-center items-center'
				android_ripple={{
					color: theme.colors.onErrorContainer,
					foreground: true
				}}
				onPress={async () => {
					onDelete && onDelete(category_id)
				}}
			>
				<Icon
					source="delete"
					color={theme.colors.onErrorContainer}
					size={24}
				/>
			</Pressable>
		</Animated.View>
	)
}
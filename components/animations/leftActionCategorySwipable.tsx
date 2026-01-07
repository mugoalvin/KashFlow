import { Pressable } from 'react-native'
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable'
import { Icon, useTheme } from 'react-native-paper'
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

interface LeftActionCategorySwipableProps {
	category_id: number
	translationX: SharedValue<number>
	methods?: SwipeableMethods
	onEdit?: (id: number) => void
}

export default function LeftActionCategorySwipable({ category_id, translationX, methods, onEdit }: LeftActionCategorySwipableProps) {
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
			style={[animatedStyle, { width: ACTION_WIDTH }]}
		>
			<Pressable
				className='flex-1 justify-center items-center'
				android_ripple={{
					color: theme.colors.onErrorContainer,
					foreground: true
				}}
				onPress={() => {
					onEdit && onEdit(category_id)
					methods?.close()
				}}
			>
				<Icon
					source="pencil-outline"
					color={theme.colors.onSecondaryContainer}
					size={24}
				/>
			</Pressable>
		</Animated.View>
	)
}
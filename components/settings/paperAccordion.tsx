import { useMMKVBoolean } from "react-native-mmkv";
import { List, Switch, useTheme } from "react-native-paper";

export default function AnimationPreferences() {
	const theme = useTheme()
	const [animataionToggle, setAnimataionToggle] = useMMKVBoolean('isAnimationEnabled')

	function toggleAnimation() {
		setAnimataionToggle(prev => !prev)
	}

	return (
		<List.Section title="Animation" titleStyle={{ color: theme.colors.onSurfaceDisabled }}>

			<List.Item
				title="Show Animation"
				description="Toggle animation"
				right={() =>
					<Switch
						value={animataionToggle}
						onValueChange={toggleAnimation}
					/>
				}
			/>

		</List.Section>
	)
}
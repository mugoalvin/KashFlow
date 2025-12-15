import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { List, RadioButton, Switch, useTheme } from "react-native-paper";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { getTextStyles } from "../text/styles";

export default function AnimationPreferences() {
	const theme = useTheme()
	const [tabViewAnimationType, setTabViewAnimationType] = useMMKVString('tabViewAnimationType')
	const [isAnimationEnabled] = useMMKVBoolean('isAnimationEnabled')
	const animationTypes = ["Spring", "Timing"]

	const [animataionToggle, setAnimataionToggle] = useMMKVBoolean('isAnimationEnabled')
	function toggleAnimation() {
		setAnimataionToggle(prev => !prev)
	}

	const [disableSwipe, setDisableSwipe] = useMMKVBoolean('isSwipeDisabled')
	function toggleSwipability() {
		setDisableSwipe(prev => !prev)
	}

	return (
		<List.Section title="Animation" titleStyle={getTextStyles(theme).SettingsSectionHeader}>

			<List.Item
				title="Show Animation"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="Toggle animation"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				right={() =>
					<Switch
						value={animataionToggle}
						onValueChange={toggleAnimation}
					/>
				}
			/>

			<List.Item
				title="Disable Tab View Swipe"
				titleStyle={getTextStyles(theme).SettingsTitle}
				right={() =>
					<Switch
						value={disableSwipe}
						onValueChange={toggleSwipability}
					/>
				}
			/>

			<List.Accordion
				title="Tab View animation type"
			>
				{
					animationTypes.map((animationType, index) =>
						<Animated.View
							key={animationType}
							entering={isAnimationEnabled ? FadeInUp.duration(100).delay(index * 50) : undefined}
							exiting={isAnimationEnabled ? FadeOutUp.duration(100).delay(index * 50) : undefined}
						>
							<List.Item
								title={animationType}
								rippleColor={theme.colors.secondaryContainer}
								right={() =>
									<RadioButton
										status={tabViewAnimationType === animationType?.toLowerCase() ? 'checked' : 'unchecked'}
										value={animationType.toLowerCase()}
										onPress={() => setTabViewAnimationType(animationType.toLowerCase())}
									/>
								}
								onPress={() => setTabViewAnimationType(animationType.toLowerCase())}
							/>
						</Animated.View>
					)
				}
			</List.Accordion>

		</List.Section>
	)
}
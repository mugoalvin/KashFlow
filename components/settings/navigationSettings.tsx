import React from 'react';
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { List, RadioButton, useTheme } from 'react-native-paper';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { getTextStyles } from '../text/styles';

export default function NavigationSettings() {
	const theme = useTheme()
	const [mode, setMode] = useMMKVString('labelVisibilityMode')
	const [isAnimationEnabled] = useMMKVBoolean('isAnimationEnabled')
	const visibilityModeArray = ['Auto', 'Selected', 'Labeled', 'Unlabeled']

	return (
		<List.Section title='Navigation' titleStyle={getTextStyles(theme).SettingsSectionHeader}>
			<List.Accordion
				title="Label Visibility Mode"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="The visibility mode of the bottom navigation tab item label."
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				theme={theme}
			>
				{
					visibilityModeArray.map((visibilityMode, index) =>
						<Animated.View
							key={visibilityMode}
							entering={isAnimationEnabled ? FadeInUp.duration(100).delay(index * 50) : undefined}
							exiting={isAnimationEnabled ? FadeOutUp.duration(100).delay(index * 50) : undefined}
						>
							<List.Item
								title={visibilityMode}
								titleStyle={getTextStyles(theme).SettingsTitle}
								rippleColor={theme.colors.secondaryContainer}
								right={() =>
									<RadioButton
										status={mode === visibilityMode?.toLowerCase() ? 'checked' : 'unchecked'}
										value={visibilityMode.toLowerCase()}
										onPress={() => setMode(visibilityMode.toLowerCase())}
									/>
								}
								onPress={() => setMode(visibilityMode.toLowerCase())}
							/>
						</Animated.View>
					)
				}
			</List.Accordion>

		</List.Section>
	)
}
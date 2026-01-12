import React from 'react'
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv'
// import { List, Switch, useTheme } from 'react-native-paper'
import { List, RadioButton, Switch, useTheme } from 'react-native-paper'
import { getTextStyles } from '../text/styles'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'


export default function GenaralSettings() {
	const theme = useTheme()
	const [isAnimationEnabled] = useMMKVBoolean('isAnimationEnabled')

	const [hideMpesaBalance, setHideMpesaBalance] = useMMKVBoolean('isMpesaHidden')
	
	function toggleMpesaBalanceVisibility() {
		setHideMpesaBalance(prev => !prev)
	}

	const [useCard, setUseCard] = useMMKVBoolean('useCard')
	function toggleUseCard() {
		setUseCard(prev => !prev)
	}

	const [useSummaryColor, setUseSummaryColor] = useMMKVBoolean('useSummaryColor')
	function toggleUseSummaryColor() {
		setUseSummaryColor(prev => !prev)
	}

	const [useMinTransInfo, setUseMinTransInfo] = useMMKVBoolean('isTransInfoMin')
	function toggleUseMinTransInfo() {
		setUseMinTransInfo(prev => !prev)
	}

	
	const [accordionType, setAccordionType] = useMMKVString('accordionType')

	return (
		<List.Section title='General' titleStyle={getTextStyles(theme).SettingsSectionHeader}>
			<List.Item
				title="Show M-Pesa Balance"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="Decide whether you want your M-Pesa balance is visible or hidden"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				onPress={toggleMpesaBalanceVisibility}
				right={() =>
					<Switch
						value={hideMpesaBalance}
						onValueChange={toggleMpesaBalanceVisibility}
					/>
				}
			/>

			<List.Item
				title="Use Card UI"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="Toggle elevated cards"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
				right={() =>
					<Switch
						value={useCard}
						onValueChange={toggleUseCard}
					/>
				}
			/>

			<List.Item
				title="Show Text Color In Summaries"
				titleStyle={getTextStyles(theme).SettingsTitle}
				right={() =>
					<Switch
						value={useSummaryColor}
						onValueChange={toggleUseSummaryColor}
					/>
				}
			/>

			<List.Item
				title="Minimize transaction Info"
				titleStyle={getTextStyles(theme).SettingsTitle}
				right={() => 
					<Switch
						value={useMinTransInfo}
						onValueChange={toggleUseMinTransInfo}
					/>
				}
			/>

			<List.Accordion
				title='Categories Accordion Type'
				titleStyle={getTextStyles(theme).SettingsTitle}
			>
				<Animated.View
					entering={isAnimationEnabled ? FadeInUp.duration(100) : undefined}
					exiting={isAnimationEnabled ? FadeOutUp.duration(100) : undefined}
				>
					<List.Item
						title='Single'
						rippleColor={theme.colors.secondaryContainer}
						right={() =>
							<RadioButton
								status={accordionType === 'single' ? 'checked' : 'unchecked'}
								value={'single'}
								onPress={() => setAccordionType('single')}
							/>
						}
					/>
					<List.Item
						title='Multiple'
						rippleColor={theme.colors.secondaryContainer}
						right={() =>
							<RadioButton
								status={accordionType === 'multiple' ? 'checked' : 'unchecked'}
								value={'multiple'}
								onPress={() => setAccordionType('multiple')}
							/>
						}
					/>
				</Animated.View>
			</List.Accordion>
		</List.Section>
	)
}
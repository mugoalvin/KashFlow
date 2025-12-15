import React from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { List, Switch, useTheme } from 'react-native-paper'
import { getTextStyles } from '../text/styles'

export default function GenaralSettings() {
	const theme = useTheme()

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

	const  [useMinTransInfo, setUseMinTransInfo] = useMMKVBoolean('isTransInfoMin')
	function toggleUseMinTransInfo () {
		setUseMinTransInfo(prev => !prev)
	}

	return (
		<List.Section title='General' titleStyle={getTextStyles(theme).SettingsSectionHeader}>
			<List.Item
				title="Show M-Pesa Balance"
				titleStyle={getTextStyles(theme).SettingsTitle}
				description="Decide whether you want your M-Pesa balance is visible or hidden"
				descriptionStyle={getTextStyles(theme).SettingsDescription}
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
		</List.Section>
	)
}
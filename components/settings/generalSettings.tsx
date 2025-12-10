import React from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { List, Switch, useTheme } from 'react-native-paper'

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

	return (
		<List.Section title='General' titleStyle={{ color: theme.colors.onSurfaceDisabled }}>
			<List.Item
				title="Show M-Pesa Balance"
				description="Decide whether you want your M-Pesa balance is visible or hidden"
				right={() =>
					<Switch
						value={hideMpesaBalance}
						onValueChange={toggleMpesaBalanceVisibility}
					/>
				}
			/>
			
			<List.Item
				title="Use Card UI"
				right={() =>
					<Switch
						value={useCard}
						onValueChange={toggleUseCard}
					/>
				}
			/>
		</List.Section>
	)
}
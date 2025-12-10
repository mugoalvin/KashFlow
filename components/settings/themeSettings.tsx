import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { List, Switch, useTheme } from 'react-native-paper'

interface ThemeSettingsProps {
	openSheet: () => void
}

export default function ThemeSettings({ openSheet }: ThemeSettingsProps) {
	const theme = useTheme()
	const [hideMpesaBalance, setHideMpesaBalance] = useMMKVBoolean('isMpesaHidden')

	function toggleMpesaBalanceVisibility() {
		setHideMpesaBalance(prev => !prev)
	}

	return (
		<List.Section title="Theme" titleStyle={{ color: theme.colors.onSurfaceDisabled }}>
			<List.Item
				title="App Theme"
				onPress={openSheet}
				right={() =>
					<Ionicons name='chevron-forward' color={theme.colors.onSurfaceVariant} />
				}
			/>

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
		</List.Section>
	)
}
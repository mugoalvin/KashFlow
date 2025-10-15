import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs'
import Transactions from '..'

export default function TabView() {
	return (
		<TabsProvider
			defaultIndex={0}
		>
			<Tabs>

				<TabScreen label='Tab 1'>
					<Transactions />
				</TabScreen>

				<TabScreen label='Tab 2'>
					<View>
						<Text>Tab 2</Text>
					</View>
				</TabScreen>

			</Tabs>
		</TabsProvider>
	)
}
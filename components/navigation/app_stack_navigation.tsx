import { Stack } from 'expo-router'

export default function AppStackNavigation() {
	return (
		<Stack
			initialRouteName='(tabs)'
			screenOptions={{
				headerShown: false,
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen name='(tabs)' />
			<Stack.Screen name='settings' />
		</Stack>
	)
}
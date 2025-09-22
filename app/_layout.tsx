import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';
import '../global.css';

import { Badge, Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

// import Feather from '@expo/vector-icons/Feather';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { Tabs } from 'expo-router';

export default function RootLayout() {
	const { theme, resetTheme, updateTheme } = useMaterial3Theme()
	const colorScheme = useColorScheme() || 'light'

	const paperTheme = {
		...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
		colors: {
			...(colorScheme === 'dark' ? theme.dark : theme.light)
		}
	}

	return (
		<ThemeContext.Provider value={{ resetTheme, updateTheme }}>
			<PaperProvider theme={paperTheme}>

				{/* <Tabs
					screenOptions={{
						headerStyle: {
							backgroundColor: theme[colorScheme].elevation.level1
						},
						headerTintColor: theme[colorScheme].onBackground,
						headerShadowVisible: false,

						tabBarStyle: {
							backgroundColor: theme[colorScheme].elevation.level1,
							borderTopColor: theme[colorScheme].elevation.level1,
						},
						tabBarActiveTintColor: theme[colorScheme].tertiary,
						tabBarInactiveTintColor: theme[colorScheme].onBackground
					}}
				>
					<Tabs.Screen
						name='(home)'
						options={{
							title: "Dashboard",
							tabBarLabel: "Home",
							tabBarIcon: ({ color, size }) => <Ionicons name='home' color={color} size={size} />
						}}
					/>
					<Tabs.Screen
						name='settings'
						options={{
							tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />
						}}
					/>
					<Tabs.Screen
						name='notification'
						options={{
							tabBarBadge: '9+',
							tabBarIcon: ({ color, size }) => <Ionicons name='notifications-outline' color={color} size={size} />
						}} />
				</Tabs> */}

				<NativeTabs
					tintColor={theme[colorScheme].tertiary}
					backgroundColor={theme[colorScheme].elevation.level1}
				>
					<NativeTabs.Trigger name='(home)'>
						<Label>Home</Label>
						<Icon drawable='home' />
					</NativeTabs.Trigger>

					<NativeTabs.Trigger name='settings'>
						<Label>Settings</Label>
						<Icon drawable='settings' />
					</NativeTabs.Trigger>

					<NativeTabs.Trigger name='notification'>
						<Label>Notification</Label>
						<Icon drawable='stat_notify_chat' />
						<Badge>2</Badge>
					</NativeTabs.Trigger>
				</NativeTabs>

			</PaperProvider>
		</ThemeContext.Provider>
	)
}
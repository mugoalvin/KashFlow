import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';
import '../global.css';

import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { darkCustomTheme, lightCustomTheme } from '@/utils/colors';
import { requestSmsPermission } from '@/utils/permissions';
import { Suspense, useEffect } from 'react';

import FallBack from '@/components/views/suspenceFallback';
import { DialogProvider } from '@/contexts/DialogContext';
// import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { PortalHost } from '@rn-primitives/portal'

import { SQLiteProvider } from 'expo-sqlite';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DATABASE_NAME = 'kashflow.db'

export default function RootLayout() {
	const { theme, resetTheme, updateTheme } = useMaterial3Theme()
	const colorScheme = useColorScheme() || 'light'

	const paperTheme = {
		...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
		colors: {
			...(colorScheme === 'dark' ? theme.dark : theme.light),
			...(colorScheme === 'dark' ? darkCustomTheme : lightCustomTheme)
		}
	}

	useEffect(() => {
		requestSmsPermission()
	}, [])

	return (
		<Suspense fallback={<FallBack />}>
			<SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense>
				<ThemeContext.Provider value={{ resetTheme, updateTheme }}>
					<PaperProvider theme={paperTheme}>
						<DialogProvider>
							<SnackbarProvider>
								<GestureHandlerRootView>

									<Tabs
										initialRouteName='(home)'
										screenOptions={{
											headerStyle: {
												backgroundColor: theme[colorScheme].elevation.level1
											},
											headerTintColor: theme[colorScheme].onBackground,
											headerShadowVisible: false,
											headerShown: false,

											tabBarStyle: {
												height: 60,
												alignItems: 'center',
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
												tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size - 5} />
											}}
										/>
										<Tabs.Screen
											name='(transactions)'
											options={{
												title: "Analysis",
												tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'notifications' : 'notifications-outline'} color={color} size={size - 5} />
											}} />
										<Tabs.Screen
											name='settings'
											options={{
												title: "Settings",
												tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={size - 5} />
											}}
										/>
									</Tabs>

									{/* <NativeTabs
										tintColor={theme[colorScheme].tertiary}
										backgroundColor={theme[colorScheme].elevation.level1}
										labelVisibilityMode='selected'
										indicatorColor={theme[colorScheme].surfaceVariant}
									>
										<NativeTabs.Trigger name='(home)'>
											<Label>Home</Label>
											<Icon drawable='home' />
										</NativeTabs.Trigger>

										<NativeTabs.Trigger name='(transactions)'>
											<Label>Transactions</Label>
											<Icon drawable='ic_menu_recent_history' />
										</NativeTabs.Trigger>

										<NativeTabs.Trigger name='settings'>
											<Label>Settings</Label>
											<Icon drawable='ic_menu_manage' />
										</NativeTabs.Trigger>

									</NativeTabs> */}

								</GestureHandlerRootView>
							</SnackbarProvider>
						</DialogProvider>
						<PortalHost />
					</PaperProvider>
				</ThemeContext.Provider>
			</SQLiteProvider>
		</Suspense>
	)
}
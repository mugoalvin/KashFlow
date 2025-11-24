import FallBack from '@/components/views/suspenceFallback';
import { DialogProvider } from '@/contexts/DialogContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { darkCustomTheme, lightCustomTheme } from '@/utils/colors';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { PortalHost } from '@rn-primitives/portal';
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';
import '../global.css';

export default function RootLayout() {
	const { theme, resetTheme, updateTheme } = useMaterial3Theme()
	const colorScheme = useColorScheme() || 'light'

	const paperTheme = useMemo(() => ({
		...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
		colors: {
			...(colorScheme === 'dark' ? theme.dark : theme.light),
			...(colorScheme === 'dark' ? darkCustomTheme : lightCustomTheme)
		}
	}), [colorScheme, theme.dark, theme.light])

	return (
		<ThemeContext.Provider value={{ resetTheme, updateTheme }}>
			<PaperProvider theme={paperTheme}>
				<Suspense fallback={<FallBack />}>
					<SQLiteProvider databaseName={process.env.EXPO_PUBLIC_DB_FILE_NAME as string} options={{ enableChangeListener: true }} useSuspense>
						<DialogProvider>
							<SnackbarProvider>
								<GestureHandlerRootView>

									<NativeTabs
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

									</NativeTabs>

								</GestureHandlerRootView>
							</SnackbarProvider>
						</DialogProvider>
						<PortalHost />
					</SQLiteProvider>
				</Suspense>
			</PaperProvider>
		</ThemeContext.Provider>
	)
}



{/* <Tabs
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
			tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size - 10} />
		}}
	/>
	<Tabs.Screen
		name='(transactions)'
		options={{
			title: "Analysis",
			tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'notifications' : 'notifications-outline'} color={color} size={size - 10} />
		}} />
	<Tabs.Screen
		name='settings'
		options={{
			title: "Settings",
			tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={size - 10} />
		}}
	/>
</Tabs> */}
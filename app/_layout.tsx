import NativeBottomTab from '@/components/navigation/native_bottom_tab';
import FallBack from '@/components/views/suspenceFallback';
import { DialogProvider } from '@/contexts/DialogContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { darkCustomTheme, lightCustomTheme } from '@/utils/colors';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { PortalHost } from '@rn-primitives/portal';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';
import '../global.css';
import { ModalProvider } from '@/contexts/ModalContext.';

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
						<ModalProvider>
							<DialogProvider>
								<SnackbarProvider>
									<GestureHandlerRootView>
										<NativeBottomTab />
									</GestureHandlerRootView>
								</SnackbarProvider>
							</DialogProvider>
						</ModalProvider>
						<PortalHost />
					</SQLiteProvider>
				</Suspense>
			</PaperProvider>
		</ThemeContext.Provider>
	)
}
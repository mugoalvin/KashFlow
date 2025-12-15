import NativeBottomTab from '@/components/navigation/native_bottom_tab';
import FallBack from '@/components/views/suspenceFallback';
import { BottomSheetProvider } from '@/contexts/BottomSheetContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { ModalProvider } from '@/contexts/ModalContext.';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { darkCustomTheme, lightCustomTheme } from '@/utils/colors';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { PortalHost } from '@rn-primitives/portal';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMMKVString } from 'react-native-mmkv';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';
import '../global.css';

export default function RootLayout() {
	const colorScheme = useColorScheme() || 'light'
	const [accentColor] = useMMKVString('accentColor')
	const { theme, resetTheme, updateTheme } = useMaterial3Theme({ fallbackSourceColor: accentColor })

	const paperTheme = useMemo(() => (
		colorScheme === 'dark' ?
			{
				...MD3DarkTheme,
				colors: { ...theme.dark, ...darkCustomTheme },
			} :
			{
				...MD3LightTheme,
				colors: { ...theme.light, ...lightCustomTheme },
			}
	), [colorScheme, theme])


	return (
		<ThemeContext.Provider value={{ resetTheme, updateTheme }}>
			<PaperProvider theme={paperTheme}>
				<Suspense fallback={<FallBack />}>
					<SQLiteProvider databaseName={process.env.EXPO_PUBLIC_DB_FILE_NAME as string} options={{ enableChangeListener: true }} useSuspense>
						<SnackbarProvider>
							<GestureHandlerRootView>
								<BottomSheetProvider>
									<ModalProvider>
										<DialogProvider>
											<NativeBottomTab />
										</DialogProvider>
									</ModalProvider>
									<PortalHost />
								</BottomSheetProvider>
							</GestureHandlerRootView>
						</SnackbarProvider>
					</SQLiteProvider>
				</Suspense>
			</PaperProvider>
		</ThemeContext.Provider>
	)
}
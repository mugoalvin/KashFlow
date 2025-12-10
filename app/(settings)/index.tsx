import AnimationPreferences from "@/components/settings/paperAccordion";
import ThemeSettings from "@/components/settings/themeSettings";
import BodyWithBottomSheet from "@/components/ui/bottomSheet/sheet";
import { useColorScheme } from "react-native";
import { Appbar, useTheme } from 'react-native-paper';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useMemo, useRef } from "react";
import SelectTheme from "@/components/ui/bottomSheet/selectTheme";

export default function Settings() {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	const bottomSheetRef = useRef<BottomSheetMethods>(null)
	const snapPoints = useMemo(() => ['50%', '75%'], [])
	const openSheet = () => bottomSheetRef.current?.snapToIndex(0)
	const closeSheet = () => bottomSheetRef.current?.close()

	return (
		<>
			<Appbar.Header mode="medium" style={{ backgroundColor: colorScheme === "dark" ? theme.colors.elevation.level2 : theme.colors.elevation.level2 }}>
				<Appbar.Content title="Settings" titleMaxFontSizeMultiplier={2} />
			</Appbar.Header>

			<BodyWithBottomSheet
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				initialSnapIndex={-1}
				sheetContent={<SelectTheme closeSheet={ closeSheet } />}
			>
				<AnimationPreferences />
				<ThemeSettings openSheet={ openSheet } />
			</BodyWithBottomSheet>
		</>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settings
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference
6. Bottom Tab Navigation label visibility mode
*/}
import GenaralSettings from "@/components/settings/generalSettings";
import NavigationSettings from "@/components/settings/navigationSettings";
import AnimationPreferences from "@/components/settings/paperAccordion";
import ThemeSettings from "@/components/settings/themeSettings";
import SelectTheme from "@/components/ui/bottomSheet/selectTheme";
import BodyWithBottomSheet from "@/components/ui/bottomSheet/sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useMemo, useRef } from "react";
import { useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Divider, useTheme } from 'react-native-paper';

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
				className="p-0"
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				initialSnapIndex={-1}
				sheetContent={<SelectTheme closeSheet={closeSheet} />}
			>
				<ScrollView>
					<GenaralSettings />
					<Divider horizontalInset />
					<AnimationPreferences />
					<Divider horizontalInset />
					<ThemeSettings openSheet={openSheet} />
					<Divider horizontalInset />
					<NavigationSettings />
				</ScrollView>
			</BodyWithBottomSheet>
		</>
	)
}
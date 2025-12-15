import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { useTheme } from 'react-native-paper'

interface BottomSheetProviderProps {
	children: ReactNode
	initialSnapIndex?: number
	snapPoints?: (number | string)[]
	onChange?: (index: number) => void
}

interface OpenSheetType {
	content: ReactNode
	snapIndex?: number
}

type BottomSheetContextType = {
	openSheet: ({ content, snapIndex }: OpenSheetType) => void
	closeSheet: () => void
}

export const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined)

export const BottomSheetProvider = ({ children, snapPoints, onChange }: BottomSheetProviderProps) => {
	const theme = useTheme()
	const sheetRef = useRef<BottomSheetMethods>(null)
	const [sheetContent, setSheetContent] = useState<ReactNode>()
	const resolvedSnapPoints = snapPoints ?? ['50%', '75%']

	const openSheet = ({content, snapIndex = 0}: OpenSheetType) => {
		setSheetContent(content)
		requestAnimationFrame(() => {
			sheetRef.current?.snapToIndex(snapIndex)
		})
	}

	const closeSheet = () => {
		requestAnimationFrame(() => {
			sheetRef.current?.close()
			setSheetContent(undefined)
		})
	}

	return (
		<BottomSheetContext.Provider value={{ closeSheet, openSheet }}>
			{children}
			<BottomSheet
				ref={sheetRef}
				index={-1}
				snapPoints={resolvedSnapPoints}
				onChange={onChange}
				enablePanDownToClose
				handleIndicatorStyle={{ backgroundColor: theme.colors.secondary }}
				backgroundStyle={{
					backgroundColor: theme.colors.secondaryContainer,
					borderTopLeftRadius: 30,
					borderTopRightRadius: 30,
				}}
			>
				<BottomSheetView style={{ marginHorizontal: 10 }}>
					{sheetContent}
				</BottomSheetView>
			</BottomSheet>
		</BottomSheetContext.Provider>
	)
}

export default function useBottomSheetContext() {
	const context = useContext(BottomSheetContext)
	if (!context) throw new Error('useBottomSheetContext must be used within the BottomSheetProvider')
	return context
}
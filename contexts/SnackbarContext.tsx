import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createContext, ReactNode, useContext, useState } from "react";
import { Snackbar, Text, useTheme } from "react-native-paper";

export type SnackbarParams = {
	message?: string
	isError?: boolean
	isWarning?: boolean
	onUndo?: () => void
}

type SnackbarContextType = {
	showSnackbar: ({ message, isError, isWarning, onUndo }: SnackbarParams) => void
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const theme = useTheme()
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')
	const [isError, setIsError] = useState<boolean>(false)
	const [isWarning, setIsWarning] = useState<boolean>(false)
	const [onUndo, setOnUndo] = useState<(() => void) | undefined>()


	const showSnackbar = ({ message, isError = false, isWarning = false, onUndo }: SnackbarParams) => {
		setMessage(message!)
		setIsVisible(true)
		setIsError(isError)
		setIsWarning(isWarning)
		setOnUndo(() => onUndo)
	}

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			<Snackbar
				visible={isVisible}
				onDismiss={() => {
					setIsVisible(false)
					setMessage('')
					setIsError(false)
					setIsWarning(false)
				}}
				duration={3000}
				style={{
					marginHorizontal: 10,
					marginBlockEnd: 100,
					padding: 0,
					// backgroundColor:
					// 	isError ? theme.colors.errorContainer : // @ts-expect-error
					// 		isWarning ? theme.colors.warningContainer :  // @ts-expect-error
					// 			theme.colors.successContainer

					backgroundColor:
						isError ? theme.colors.errorContainer :
							isWarning ? theme.colors.tertiaryContainer :
								theme.colors.primaryContainer
				}}
				icon={onUndo ? ({ size }) =>
					<MaterialCommunityIcons
						name="undo-variant"
						color={
							isError ? theme.colors.onErrorContainer :
								isWarning ? theme.colors.onTertiaryContainer :
									theme.colors.onPrimaryContainer
						}
						size={size}
					/> : undefined
				}
				onIconPress={() =>
					onUndo && onUndo()
				}
			>
				<Text
					style={{
						// color:
						// 	isError ? theme.colors.onErrorContainer : // @ts-expect-error
						// 		isWarning ? theme.colors.onWarningContainer :  // @ts-expect-error
						// 			theme.colors.onSuccessContainer

						color:
							isError ? theme.colors.onErrorContainer :
								isWarning ? theme.colors.tertiaryContainer :
									theme.colors.onPrimaryContainer
					}}
				>
					{message}
				</Text>
			</Snackbar>
		</SnackbarContext.Provider>
	)
}


export default function useSnackbarContext() {
	const context = useContext(SnackbarContext)
	if (!context) throw new Error("useSnackbar must be used within a SnackbarProvider")
	return context
}
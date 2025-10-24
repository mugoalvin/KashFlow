import { createContext, ReactNode, useContext, useState } from "react";
import { Snackbar, Text, useTheme } from "react-native-paper";

export type SnackbarParams = {
	message?: string;
	isError?: boolean;
	isWarning?: boolean;
};
type SnackbarContextType = {
	showSnackbar: ({ message, isError, isWarning }: SnackbarParams) => void
}
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const theme = useTheme()
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')
	const [isError, setIsError] = useState<boolean>(false)
	const [isWarning, setIsWarning] = useState<boolean>(false)


	const showSnackbar = ({ message, isError = false, isWarning = false }: SnackbarParams) => {
		// console.log("Snackbar called:", { message, isError, isWarning }) // Debug

		setMessage(message!)
		setIsVisible(true)
		setIsError(isError)
		setIsWarning(isWarning)
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
					backgroundColor:
						isError ? theme.colors.errorContainer : // @ts-expect-error
							isWarning ? theme.colors.warningContainer :  // @ts-expect-error
								theme.colors.successContainer
				}}
			>
				<Text
					className="text-xl"
					style={{
						color:
							isError ? theme.colors.onErrorContainer : // @ts-expect-error
								isWarning ? theme.colors.onWarningContainer :  // @ts-expect-error
									theme.colors.onSuccessContainer
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
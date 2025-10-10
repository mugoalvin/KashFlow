import { createContext, ReactNode, useContext, useState } from "react"
import { Button, Dialog, Portal, Text } from "react-native-paper"


type DialogAction = {
	dialogText: string
	action: () => void
}

type DialogParams = {
	title: string
	message: string
	actions: DialogAction[]
}

type DialogContextType = {
	showDialog: ({ actions, message, title }: DialogParams) => void
}


export const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const DialogProvider = ({ children }: { children: ReactNode }) => {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('')
	const [message, setMessage] = useState<string>('')
	const [actions, setActions] = useState<DialogAction[]>([])

	function showDialog({ actions, message, title }: DialogParams) {
		setTitle(title)
		setMessage(message)
		setActions(actions)
		setIsVisible(true)
	}

	return (
		<DialogContext.Provider value={{ showDialog }}>
			{children}
			<Portal>
				<Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
					<Dialog.Title>{title}</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">{message}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setIsVisible(false)}>{actions[0]?.dialogText}</Button>
						{/* <Button onPress={() => console.log(actions[1]?.action)}>{actions[1]?.dialogText}</Button> */}
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</DialogContext.Provider>
	)
}

export default function useDialogContext() {
	const context = useContext(DialogContext)
	if (!context) throw new Error("useDialog must be used within a DialogProvider")
	return context
}
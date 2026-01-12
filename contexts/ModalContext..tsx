import { createContext, ReactNode, useContext, useState } from "react";
import { Modal } from "react-native-paper";

type ShowModalParams = {
	visibility: boolean
	content: ReactNode
}

type ModalContextType = {
	closeModal: () => void
	showModal: ({ visibility, content }: ShowModalParams) => void
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)


export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [visibility, setVisibility] = useState<boolean>(false)
	const [content, setContent] = useState<ReactNode>()

	const showModal = ({ content, visibility }: ShowModalParams) => {
		setContent(content)
		setVisibility(visibility)
	}

	const closeModal = () => {
		setVisibility(false)
		setContent(null)
	}

	return ( // @ts-ignore
		<ModalContext.Provider value={{ showModal, closeModal }}>
			{children}
			<Modal visible={visibility} onDismiss={closeModal}>
				{content}
			</Modal>
		</ModalContext.Provider>
	)
}

export default function useModalContext() {
	const context = useContext(ModalContext)
	if (!context) throw new Error('useModalContext must be used within the ModalProvider')
	return context
}
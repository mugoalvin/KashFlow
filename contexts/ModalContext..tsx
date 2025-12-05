import SelectCategory from "@/components/userInput/selectCategory";
import { MpesaParced } from "@/interface/mpesa";
import { createContext, ReactNode, useContext, useState } from "react";
import { Modal } from "react-native-paper";

type ShowModalParams = {
	visibility: boolean
	transaction?: MpesaParced
}

type ModalContextType = {
	// visibility: boolean
	closeModal: () => void
	showModal: ({ transaction, visibility }: ShowModalParams) => void
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)


export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [visibility, setVisibility] = useState<boolean>(false)
	const [transaction, setTransaction] = useState<MpesaParced>()

	const showModal = ({ transaction, visibility }: ShowModalParams) => {
		setTransaction(transaction)
		setVisibility(visibility)
	}

	const closeModal = () => {
		setVisibility(false)
	}

	return ( // @ts-ignore
		<ModalContext.Provider value={{ showModal, closeModal }}>
			{children}
			<Modal visible={visibility} onDismiss={closeModal}>
				<SelectCategory closeModal={closeModal} transaction={transaction!} />
			</Modal>
		</ModalContext.Provider>
	)
}

export default function useModalContext() {
	const context = useContext(ModalContext)
	if (!context) throw new Error('useModalContext must be used within the ModalProvider')
	return context
}
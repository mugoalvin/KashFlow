import MonthlyTransactionInfo from "@/components/information/monthlyTransactionInfo";
import Body from "@/components/views/body";
import ButtonGroup from "@/components/views/buttonGroup";

export type transactionButtonType = 'all' | 'moneyOut' | 'moneyIn'

const buttons = [
	{ title: "All", type: 'all' },
	{ title: "Money Out", type: 'moneyOut' },
	{ title: "Money In", type: 'moneyIn' },
];

export default function Transactions() {                        
	return (
		<Body> 
			{/* @ts-ignore */}
			<ButtonGroup buttons={buttons} />
			<MonthlyTransactionInfo />

		</Body>
	)
}
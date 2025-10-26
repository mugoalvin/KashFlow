import { desc } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { mpesaMessages } from "./sqlite";

export async function getBalance(db: ExpoSQLiteDatabase): Promise<number> {
	const balance: number =
		await db
			.select({ balance: mpesaMessages.balance, outstanding: mpesaMessages.outstanding })
			.from(mpesaMessages)
			.orderBy(desc(mpesaMessages.id))
			.limit(10)
			.then(balances => balances.find(balance => balance)?.balance || 0)
			.catch(() => 0)

	return balance
}
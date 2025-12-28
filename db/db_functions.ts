import { desc } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { mpesaMessages } from "./sqlite";

export async function getBalance(db: ExpoSQLiteDatabase): Promise<number> {
	return await db
		.select({ balance: mpesaMessages.balance, outstanding: mpesaMessages.outstanding })
		.from(mpesaMessages)
		.orderBy(desc(mpesaMessages.id))
		.limit(5)

		.then(rows =>
			rows.map(row =>
				row.balance != null && row.balance !== 0
					? row.balance
					: row.outstanding! * -1
			).at(0) ?? 0
		)
		.catch(() => 0)

}
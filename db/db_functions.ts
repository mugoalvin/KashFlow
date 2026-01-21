import { desc, eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { mpesaMessages, subCategoriesTable } from "./sqlite";

export async function getBalance(db: ExpoSQLiteDatabase): Promise<number> {
	const rows = await db
		.select({ balance: mpesaMessages.balance, outstanding: mpesaMessages.outstanding })
		.from(mpesaMessages)
		.orderBy(desc(mpesaMessages.id))
		.limit(5)

	if (rows.length > 0) {
		return rows.map(row =>
			row.balance != null && row.balance !== 0
				? row.balance
				: row.outstanding! * -1
		).at(0) ?? 0
	}

	return 0
}

export async function nullifyCategoryIdsInMpesaMessages(db: ExpoSQLiteDatabase, categoryIdToDelete: number): Promise<{ changes: number }> {
	return await db
		.update(mpesaMessages)
		.set({ categoryId: null })
		.where(eq(mpesaMessages.categoryId, categoryIdToDelete))
}

export async function deleteSubCategoriesUnderCategory(db: ExpoSQLiteDatabase, categoryIdToDelete: number) {
	try {
		await db
			.delete(subCategoriesTable)
			.where(eq(subCategoriesTable.categoryId, categoryIdToDelete))
	} catch (error) {
		console.error(`Error deleting subcategories for category ${categoryIdToDelete}:`, error);
		throw error;
	}
}

export async function fetchMpesaMessagesByCategory(db: ExpoSQLiteDatabase, categoryId: number) {
	try {
		return await db
			.selectDistinct({ counterparty: mpesaMessages.counterparty })
			.from(mpesaMessages)
			.where(eq(mpesaMessages.categoryId, categoryId))
			.orderBy(desc(mpesaMessages.id))

	} catch (error) {
		throw error
	}
}
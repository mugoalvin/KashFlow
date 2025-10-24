import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const DATABASE_NAME = 'kashflow.db'

const expoDb = openDatabaseSync(DATABASE_NAME)
export const sqliteDB = drizzle(expoDb)
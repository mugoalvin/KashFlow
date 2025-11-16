import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expoDb = openDatabaseSync(process.env.EXPO_PUBLIC_DB_FILE_NAME as string)
export const sqliteDB = drizzle(expoDb)
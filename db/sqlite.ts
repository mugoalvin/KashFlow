import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const mpesaMessages = sqliteTable('mpesaMessages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	counterparty: text('counterparty'),
	amount: integer('amount'),
	balance: integer('balance'),
	number: integer('number'),
	dueDate: text('dueDate'),
	message: text('message'),
	rawTime: text('rawTime'),
	parsedDate: text('parsedDate'),
	parsedTime: text('parsedTime'),
	account: text('account'),
	fee: integer('fee'),
	limit: integer('limit'),
	outstanding: integer('outstanding'),
	paid: integer('paid'),
	transactionCost: integer('transactionCost'),
	type: text('type')
})
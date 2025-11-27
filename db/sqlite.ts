import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const mpesaMessages = sqliteTable('mpesaMessages', {
	id: integer('id').primaryKey({ autoIncrement: false }),
	counterparty: text('counterparty'),
	amount: integer('amount'),
	balance: integer('balance'),
	categoryId: integer('categoryId'),
	number: integer('number'),
	dueDate: text('dueDate'),
	message: text('message'),
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

export const categoriesTable = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').unique(),
	icon: text('icons'),
	name: text('name')
})
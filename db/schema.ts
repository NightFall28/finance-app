import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from 'drizzle-orm';
import { z } from "zod";

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(), 
})

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(), 
})

export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", {mode: 'date'}).notNull(),

    // foreign keys
    accountId: text("account_id").references(() => accounts.id, {
        // when an account is deleted, delete all transactions associated with it
        onDelete: 'cascade',
    }).notNull(),

    categoryId: text("category_id").references(() => categories.id, {
        // when a category is deleted, set all transactions of that category uncategorized
        onDelete: 'set null',
    }),
})

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
})

export const accountsRelations = relations(accounts, ({many}) => ({
    transactions: many(transactions)
}))

export const categoriesRelations = relations(categories, ({many}) => ({
    transactions: many(transactions)
}))

export const transactionsRelations = relations(transactions, ({one}) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}))
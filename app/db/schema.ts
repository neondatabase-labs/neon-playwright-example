import { pgTable, text, bigint, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
});
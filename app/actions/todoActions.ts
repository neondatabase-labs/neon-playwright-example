'use server';

import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function addTodo(task: string) {
    await db.insert(todos).values({ task });
}

export async function getTodos() {
    return db.select().from(todos);
}

export async function toggleTodo(id: bigint, isComplete: boolean) {
    await db.update(todos).set({ isComplete }).where(eq(todos.id, id));
}

export async function deleteTodo(id: bigint) {
    await db.delete(todos).where(eq(todos.id, id));
}

export async function deleteAllTodos() {
    await db.delete(todos);
}
import { addTodo, toggleTodo, deleteTodo } from '@/app/actions/todoActions';
import { revalidatePath } from 'next/cache';

type Todo = {
    id: bigint;
    task: string;
    isComplete: boolean;
};

export async function TodoForm() {
    return (
        <form
            action={async (formData) => {
                'use server';
                await addTodo(formData.get('task') as string);
                revalidatePath('/');
            }}
            className="flex gap-2"
        >
            <input
                type="text"
                name="task"
                placeholder="New todo"
                className="flex-1 rounded-md border px-2 py-1"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 rounded-md px-3 py-1 text-white"
            >
                Add
            </button>
        </form>
    );
}

export function TodoList({ todos }: { todos: Todo[] }) {
    if (todos.length === 0) {
        return <p className="text-gray-500 mt-8 text-center">No todos yet. Add one above!</p>;
    }

    return (
        <ul className="mt-4 space-y-2">
            {todos.map((todo) => (
                <li
                    key={todo.id.toString()}
                    className="flex items-center justify-between border-b py-2"
                >
                    <span className={todo.isComplete ? 'text-gray-400 line-through' : ''}>
                        {todo.task}
                    </span>
                    <div className="flex gap-2">
                        <form
                            action={async () => {
                                'use server';
                                await toggleTodo(todo.id, !todo.isComplete);
                                revalidatePath('/');
                            }}
                        >
                            <button type="submit" className="text-green-500 hover:text-green-700 text-sm">
                                {todo.isComplete ? 'Undo' : 'Done'}
                            </button>
                        </form>
                        <form
                            action={async () => {
                                'use server';
                                await deleteTodo(todo.id);
                                revalidatePath('/');
                            }}
                        >
                            <button type="submit" className="text-red-500 hover:text-red-700 text-sm">
                                Delete
                            </button>
                        </form>
                    </div>
                </li>
            ))}
        </ul>
    );
}
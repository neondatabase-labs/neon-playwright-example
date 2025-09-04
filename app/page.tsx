import { getTodos } from '@/app/actions/todoActions';
import { TodoForm, TodoList } from '@/app/todos';

export default async function HomePage() {
  const todos = await getTodos();

  return (
    <main className="mx-auto max-w-lg p-6 pt-24">
      <h1 className="mb-4 text-2xl font-bold">My Todos</h1>
      <TodoForm />
      <TodoList todos={todos} />
    </main>
  );
}
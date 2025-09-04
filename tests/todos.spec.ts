import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app
        await fetch("http://localhost:3000/api/clear", { method: "POST" });
        await page.goto("http://localhost:3000");
    });

    test("should load the todo app page", async ({ page }) => {
        // Check that the main heading is visible
        await expect(page.locator("h1")).toHaveText("My Todos");

        // Check that the todo form is present
        await expect(page.locator('input[name="task"]')).toBeVisible();
        await expect(page.locator('button:has-text("Add")')).toHaveText("Add");
    });

    test("should display empty state when no todos exist", async ({ page }) => {
        // Check for the empty state message
        await expect(
            page.locator("text=No todos yet. Add one above!"),
        ).toBeVisible();
    });

    test("should add a new todo", async ({ page }) => {
        const todoText = "Test todo item";

        // Fill in the todo input
        await page.locator('input[name="task"]').fill(todoText);

        // Click the add button
        await page.locator('button:has-text("Add")').click();

        // Wait for the page to reload and check that the todo appears
        await expect(page.locator(`text=${todoText}`)).toBeVisible();

        // Verify the todo is not completed
        await expect(
            page.locator("li").filter({ hasText: todoText }).locator("span"),
        ).not.toHaveClass(/line-through/);
    });

    test("should mark a todo as complete", async ({ page }) => {
        const todoText = "Complete this task";

        // Add a todo first
        await page.locator('input[name="task"]').fill(todoText);
        await page.locator('button:has-text("Add")').click();

        // Click the "Done" button
        await page
            .locator("li")
            .filter({ hasText: todoText })
            .locator('button:has-text("Done")')
            .click();

        // Verify the todo is marked as complete (line-through style)
        await expect(
            page.locator("li").filter({ hasText: todoText }).locator("span"),
        ).toHaveClass(/line-through/);

        // Verify the button text changes to "Undo"
        await expect(
            page
                .locator("li")
                .filter({ hasText: todoText })
                .locator('button:has-text("Undo")'),
        ).toBeVisible();
    });

    test("should unmark a completed todo", async ({ page }) => {
        const todoText = "Undo this task";

        // Add and complete a todo
        await page.locator('input[name="task"]').fill(todoText);
        await page.locator('button:has-text("Add")').click();
        await page.locator('button:has-text("Done")').click();

        // Click the "Undo" button
        await page
            .locator("li")
            .filter({ hasText: todoText })
            .locator('button:has-text("Undo")')
            .click();

        // Verify the todo is no longer completed
        await expect(
            page.locator("li").filter({ hasText: todoText }).locator("span"),
        ).not.toHaveClass(/line-through/);

        // Verify the button text changes back to "Done"
        await expect(
            page
                .locator("li")
                .filter({ hasText: todoText })
                .locator('button:has-text("Done")'),
        ).toBeVisible();
    });

    test("should delete a todo", async ({ page }) => {
        const todoText = "Delete this task";

        // Add a todo
        await page.locator('input[name="task"]').fill(todoText);
        await page.locator('button:has-text("Add")').click();

        // Verify the todo exists
        await expect(page.locator(`text=${todoText}`)).toBeVisible();

        // Click the "Delete" button
        await page
            .locator("li")
            .filter({ hasText: todoText })
            .locator('button:has-text("Delete")')
            .click();

        // Verify the todo is removed
        await expect(page.locator(`text=${todoText}`)).not.toBeVisible();

        // Check for empty state message
        await expect(
            page.locator("text=No todos yet. Add one above!"),
        ).toBeVisible();
    });

    test("should handle multiple todos", async ({ page }) => {
        const todos = ["First task", "Second task", "Third task"];

        // Add multiple todos
        for (const todo of todos) {
            await page.locator('input[name="task"]').fill(todo);
            await page.locator('button:has-text("Add")').click();
        }

        // Verify all todos are displayed
        for (const todo of todos) {
            await expect(page.locator(`text=${todo}`)).toBeVisible();
        }

        // Mark the second todo as complete
        await page
            .locator("li")
            .filter({ hasText: todos[1] })
            .locator('button:has-text("Done")')
            .click();

        // Verify the second todo is completed
        await expect(page.locator(`text=${todos[1]}`)).toHaveClass(/line-through/);

        // Delete the first todo
        await page
            .locator("li")
            .filter({ hasText: todos[0] })
            .locator('button:has-text("Delete")')
            .click();

        // Verify the first todo is removed and others remain
        await expect(page.locator(`text=${todos[0]}`)).not.toBeVisible();
        await expect(page.locator(`text=${todos[1]}`)).toBeVisible();
        await expect(page.locator(`text=${todos[2]}`)).toBeVisible();
    });

    test("should persist todos across page reloads", async ({ page }) => {
        const todoText = "Persistent task";

        // Add a todo
        await page.locator('input[name="task"]').fill(todoText);
        await page.locator('button:has-text("Add")').click();

        // Verify the todo is added
        await expect(page.locator(`text=${todoText}`)).toBeVisible();

        // Reload the page
        await page.reload();

        // Verify the todo is still there
        await expect(page.locator(`text=${todoText}`)).toBeVisible();

        // Delete the todo
        await page
            .locator("li")
            .filter({ hasText: todoText })
            .locator('button:has-text("Delete")')
            .click();

        // Verify the todo is removed
        await expect(page.locator(`text=${todoText}`)).not.toBeVisible();

        // Check for empty state message
        await expect(
            page.locator("text=No todos yet. Add one above!"),
        ).toBeVisible();

        // Reload to verify empty state persists
        await page.reload();

        // Verify the empty state persists
        await expect(
            page.locator("text=No todos yet. Add one above!"),
        ).toBeVisible();
    });
});

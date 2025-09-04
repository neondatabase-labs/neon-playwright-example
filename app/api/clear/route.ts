import { deleteAllTodos } from "@/app/actions/todoActions";
import { NextResponse } from "next/server";

export async function POST() {
    await deleteAllTodos();
    return NextResponse.json({ message: "All todos deleted" });
}

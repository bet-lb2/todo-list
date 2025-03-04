import { Task } from "./task";

export function addNewTask(title, description, dueDate, priority) {
    return new Task(title, description, dueDate, priority);
}
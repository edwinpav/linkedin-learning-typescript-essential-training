interface Todo {
    id: number
    title: string
    status: Status
    completedOn?: Date
}

enum Status {
    Todo = "todo",
    InProgress = "in-progress",
    Done = "done"
}

const todoItems: Todo[] = [
    { id: 1, title: "Learn HTML", status: Status.Done, completedOn: new Date("2021-09-11") },
    { id: 2, title: "Learn TypeScript", status: Status.InProgress },
    { id: 3, title: "Write the best app in the world", status: Status.Todo },
]

function addTodoItem(todo: string): Todo {
    const id = getNextId(todoItems)

    const newTodo: Todo = {
        id,
        title: todo,
        status: Status.Todo,
    }

    todoItems.push(newTodo)

    return newTodo
}

// told to use generic type to define the parameter
// generic type can have anything but AT LEAT {id : number} property
function getNextId<T extends { id: number }>(items: T[]): number {
    return items.reduce((max, x) => x.id > max ? x.id : max, 0) + 1
}

const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app")

console.log(JSON.stringify(newTodo))

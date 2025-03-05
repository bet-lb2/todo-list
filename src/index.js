import "./styles.css";
import { Todo } from "./todo";

const addProjectBtn = document.getElementById("add-project-btn");
const addTodoBtn = document.getElementById("add-todo-btn");
const projects = document.getElementById("projects");
const todos = document.getElementById("todos");
const dialog = document.getElementById("dialog");

let projectsList = [];

function displayProjects() {
    projects.innerHTML = "";
    projectsList = getLocalStorage();
    projectsList.forEach((project, index) => {
        projects.innerHTML += `
        <button class="project" style="${project.isSelected === true ? "outline: 1px solid black;" : ""}" data-index="${index}">${project.name}</button>`;
    })

    document.querySelectorAll(".remove-project").forEach(removeBtn => {
        removeBtn.addEventListener("click", (e) => {
            const index = e.target.parentNode.dataset.index;
            projectsList.splice(index, 1);
            updateLocalStorage();
            displayProjects();
        })
    })

    document.querySelectorAll(".project").forEach(project => {
        project.addEventListener("click", (e) => {
            const index = Number(e.target.dataset.index);
            projectsList.forEach((project, projectListIndex) => {
                if (projectListIndex === index) {
                    project.isSelected = project.isSelected === true ? false : true;
                    return;
                }
                project.isSelected = false;
            })
            updateLocalStorage();
            if (projectsList.every(project => project.isSelected === false)) {
                displayAllTodos();
                return;
            }
            displayProjects();
            displayTodos(projectsList[index].todos);
        })
    })
}

function displayTodos(todosArr) {
    todos.innerHTML = "";
    todosArr.forEach((todo, index) => {
        todos.innerHTML += `
        <button data-index="${index}"><span style="border-left: 3px solid ${todo.priority === "low" ? "green" : todo.priority === "medium" ? "goldenrod" : "red"};">${todo.title}</span><span>${todo.dueDate === "" ? "No Date" : todo.dueDate}<button class="remove-todo">X</button></span></button>`
    })
    document.querySelectorAll(".remove-todo").forEach(removeTodoBtn => {
        removeTodoBtn.addEventListener("click", (e) => {
            const todoIndex = e.target.parentNode.parentNode.dataset.index;
            projectsList.forEach(project => {
                if (project.isSelected === true) {
                    project.todos.splice(todoIndex, 1);
                    updateLocalStorage();
                    displayTodos(project.todos);
                }
            })
        })
    })
}

function displayAllTodos() {
    if (projectsList.every(project => project.isSelected === false)) {
        todos.innerHTML = "";
        projectsList.forEach(project => {
            todos.innerHTML += `<div>${project.name}</div>`
            project.todos.forEach((todo, index) => {
                todos.innerHTML += `
                <button dta-index="${index}"><span style="border-left: 3px solid ${todo.priority === "low" ? "green" : todo.priority === "medium" ? "goldenrod" : "red"};">${todo.title}</span><span>${todo.dueDate === "" ? "No Date" : todo.dueDate}</span></button>`;
            })
        })
    }
}

function initializeIsSelected() {
    projectsList = projectsList.map(project => {
        return {
            ...project,
            isSelected: false
        }
    })
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("projectsList", JSON.stringify(projectsList));
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("projectsList"))
}

window.addEventListener("load", () => {
    if (localStorage.getItem("projectsList")) {
        projectsList = getLocalStorage();
        initializeIsSelected();
        displayProjects();
        displayAllTodos();
    }
})

addProjectBtn.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.innerHTML = `
    <div>
        <label for="project-name">Project Name:</label><br>
        <input id="project-name" type="text">
    </div>
    <div>
        <button id="confirm">Confirm</button>
        <button id="close">Close</button>
    </div>`
    document.getElementById("confirm").addEventListener("click", () => {
        const projectName = document.getElementById("project-name").value;
        projectsList.push({name: projectName, isSelected: false, todos: []});
        localStorage.clear();
        updateLocalStorage();
        displayProjects();
        dialog.close();
    })
    document.getElementById("close").addEventListener("click", () => {
        dialog.close();
    })
    dialog.showModal();
})

addTodoBtn.addEventListener("click", () => {
    if (projectsList.length < 1 ) {
        alert("Please create new project.");
        return;
    }
    if (!projectsList.some(project => project.isSelected === true)) {
        alert("Please select project which you want to add todo.");
        return;
    }
    const selectedProject = projectsList.filter(project => project.isSelected === true)[0];
    dialog.innerHTML = "";
    dialog.innerHTML = `
    <div>
        <label for="todo-title">Title:</label>
        <input type="text" id="todo-title">
    </div>
    <div>
        <label for="todo-description">Description:</label>
        <textarea id="todo-description"></textarea>
    </div>
    <div>
        <label for="todo-dueDate">Due date:</label>
        <input type="date" id="todo-dueDate">
    </div>
    <div>
        <label for="todo-priority">Priority</label>
        <select id="todo-priority">
            <option value="low" selected>Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
    </div>
    <div>
        <button id="confirm">Confirm</button>
        <button id="close">Close</button>
    </div>`;
    document.getElementById("confirm").addEventListener("click", () => {
        const todoTitle = document.getElementById("todo-title").value;
        const todoDescription = document.getElementById("todo-description").value;
        const todoDueDate = document.getElementById("todo-dueDate").value;
        const todoPriority = document.getElementById("todo-priority").value;
        if (todoTitle === "") {
            alert("Please enter your todo title.");
            return;
        }
        selectedProject.todos.push(new Todo(todoTitle, todoDescription, todoDueDate, todoPriority));
        updateLocalStorage();
        displayProjects();
        displayTodos(selectedProject.todos);
        dialog.close();
    })
    document.getElementById("close").addEventListener("click", () => {
        dialog.close();
    })
    dialog.showModal();
})
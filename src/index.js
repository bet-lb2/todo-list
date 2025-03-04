import "./styles.css";
// import { addNewProject } from "./addNewProject";
// import { addNewTask } from "./addNewTodo";
import { Project } from "./project";
import { Task } from "./task";
import { enIE } from "date-fns/locale";

const addProjectBtn = document.getElementById("add-project-btn");
const projects = document.getElementById("projects")
const addTaskBtn = document.getElementById("add-task-btn");
const tasks = document.getElementById("tasks");
const dialog = document.getElementById("dialog");

let todoList = [];

function displayProject() {
    projects.innerHTML = "";
    console.log(todoList)
    todoList.forEach((project, index) => {
        projects.innerHTML += `
        <button data-index="${index}">${project.getProjectName()}<button class="remove-project">X</button></button>`
    })
    document.querySelectorAll(".remove-project").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.parentNode.dataset.index;
            removeProject(index);
        })
    })
}

function addNewProject(projectName) {
    todoList.push(new Project(projectName));
    displayProject();
}

function removeProject(index) {
    todoList.splice(index, 1);
    displayProject();
}

addNewProject("All");
addNewProject("sample project");
addNewProject("sample project 2");
displayProject();

addProjectBtn.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.innerHTML = `
    <div>
        <label for="project-name">Project Name:</label><br>
        <input id="project-name">
    </div>
    <div class="buttons">
        <button id="confirm">Confirm</button>
        <button id="close">Close</button>
    </div>`;
    dialog.showModal();
    document.getElementById("confirm").addEventListener("click", () => {
        const projectName = document.getElementById("project-name").value;
        if (projectName === "") {
            alert("Enter your project name.");
            return;
        }
        addNewProject(projectName);
        dialog.close();
    })
    document.getElementById("close").addEventListener("click", () => {
        dialog.close();
    })
})

addTaskBtn.addEventListener("click", () => {
    dialog.innerHTML = "";
    dialog.innerHTML = `
    <div id="project-name" style="text-align: center;">${todoList[0].getProjectName()}</div>
    <div>
        <label for="task-title">Title:<br>
        <input id="task-title">
    </div>
    <div>
        <label for="task-description">Description:<br>
        <textarea id="task-description"></textarea>
    </div>
    <div>
        <label for="task-dueDate">Due Date:<br>
        <input id="task-due-date" type="date">
    </div>
    <div>
        <label for="task-priority">Priority:<br>
        <select id="task-priority">
            <option value="low" selected>Low</option>
            <option value="medium">Medium</option>
            <option value="hight">High</option>
        </select>
    </div>
    <div class="buttons">
        <button id="confirm">Confirm</button>
        <button id="close">Close</button>
    </div>`;
    dialog.showModal();
    document.getElementById("confirm").addEventListener("click", () => {
        const projectName = document.getElementById("project-name").textContent;
        const taskTitle = document.getElementById("task-title").value;
        const taskDescription = document.getElementById("task-description").value;
        const taskDueDate = document.getElementById("task-due-date").value;
        const taskPriority = document.getElementById("task-priority").value;
        todoList.forEach(project => {
            if (project.getProjectName() === projectName) {
                project.setTasks(new Task(taskTitle, taskDescription, taskDueDate, taskPriority));
                tasks.innerHTML = "";
                project.getTasks().forEach(task => {
                    tasks.innerHTML += `
                    <button><div>${task.title === "" ? "No title" : task.title}</div><div>${task.dueDate === "" ? "No Date" : task.dueDate}</div></button>`
                })
            }
        })
        dialog.close();
    })
    document.getElementById("close").addEventListener("click", () => {
        dialog.close();
    })
})
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
        <button class="project" style="${project.isSelected === true ? "outline: 1px solid black;" : ""}" data-index="${index}">${project.name}<button class="remove-project">X</button></button>`;
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
            displayProjects();
        })
    })
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
        displayProjects();
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
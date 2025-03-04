export class Project {
    tasks = [];
    constructor(name) {
        this.name = name;
    }

    getProjectName() {
        return this.name;
    }

    setTasks(task) {
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks;
    }
}
interface Task {
    name: string,
    done: boolean
};

let TASKS: Task[];
let taskListHTML: HTMLUListElement = document.querySelector('#taskList');
let taskInput: HTMLInputElement = document.querySelector('#taskInput');
let taskCounter: HTMLParagraphElement = document.querySelector('.info p');
let btnsTasks: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.info button');
let lis: NodeListOf<HTMLLIElement>;
let modal: HTMLDivElement = document.querySelector('.modal');

function getTasksFromOrigin(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
        TASKS = JSON.parse(localStorage.getItem('tasks'));

        if (TASKS) {
            resolve(TASKS);
            taskCounter.textContent = `Quedan ${TASKS.length} tareas`;
        } else {
            reject("No hay ninguna tarea");
        }
    });
}

function listTasks(dataArray: Task[]) {
    taskListHTML.innerHTML = '';
    for (let task of dataArray) {
        taskListHTML.innerHTML += `
        <li>
            <div>
                <input type="checkbox" ${(task.done) ? 'checked' : ''}>
                <span>${task.name}</span>
            </div>
            <span class="material-icons btn-delete">delete_outline</span>
        </li>
        `;
    }

    //Coger los checks y los delete buttons
    lis = document.querySelectorAll('#taskList li');
    console.log(lis);
}

function listAllTasks() {
    getTasksFromOrigin()
        .then(data => listTasks(data))
        .catch(error => taskListHTML.innerHTML = `<p>${error}</p>`);
}

function listPendingOrCompletedTasks(key: boolean) {
    getTasksFromOrigin()
        .then(data => {
            data = data.filter(value => value.done === key);
            listTasks(data);
        })
        .catch(error => taskListHTML.innerHTML = `<p>${error}</p>`);
}

function addTask(event: KeyboardEvent) {
    if (event.key === 'Enter' && taskInput.value !== '') {
        let newTask: Task = {
            name: taskInput.value,
            done: false
        };
        TASKS.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(TASKS));
        taskInput.value = '';
        listAllTasks();
    }
}

listAllTasks();

taskInput.addEventListener('keyup', addTask);
btnsTasks[0].addEventListener('click', listAllTasks);
btnsTasks[1].addEventListener('click', () => listPendingOrCompletedTasks(false));
btnsTasks[2].addEventListener('click', () => listPendingOrCompletedTasks(true));

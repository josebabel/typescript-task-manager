interface Task {
    id: number,
    name: string,
    done: boolean
};

enum Filter {
    All,
    Pending,
    Completed
}

let TASKS: Task[];
let taskListHTML: HTMLUListElement = document.querySelector('#taskList');
let taskInput: HTMLInputElement = document.querySelector('#taskInput');
let taskCounter: HTMLParagraphElement = document.querySelector('.info p');
let btnsTasks: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.info button');
let modal: HTMLDivElement = document.querySelector('.modal');
let yesBtn: HTMLButtonElement = document.querySelector('#yes-btn');
let noBtn: HTMLButtonElement = document.querySelector('#no-btn');

(() => {
    if(!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', '[]');
    } 
})();

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

        let newLi = document.createElement('li');
        let newDiv = document.createElement('div');
        let checkbox = document.createElement('input');
        let newSpan = document.createElement('span');
        let newDeleteBtn = document.createElement('span');

        checkbox.type = 'checkbox';
        (task.done) ? checkbox.checked = true : checkbox.checked = false;
        newDiv.appendChild(checkbox);

        newSpan.textContent = task.name;
        newDiv.appendChild(newSpan);

        newDeleteBtn.className = 'material-icons btn-delete';
        newDeleteBtn.textContent = 'delete_outline';
        
        newLi.appendChild(newDiv);
        newLi.appendChild(newDeleteBtn);

        taskListHTML.appendChild(newLi);

        newDeleteBtn.onclick = () => {
            modal.style.display = 'block';
            document.querySelector('.modal-content').textContent = task.name;   
        }

        checkbox.onchange = () => updateCheck(task);

    }
}

function filterTasks(filter: Filter) {

    if (filter === Filter.All) {
        btnsTasks.forEach(element => element.disabled = false);
        btnsTasks[0].disabled = true;

        getTasksFromOrigin()
            .then(data => listTasks(data))
            .catch(error => taskListHTML.innerHTML = `<p>${error}</p>`);

    } else if (filter === Filter.Pending) {
        btnsTasks.forEach(element => element.disabled = false);
        btnsTasks[1].disabled = true;

        getTasksFromOrigin()
            .then(data => {
                data = data.filter(value => value.done === false);
                listTasks(data);
            })
            .catch(error => taskListHTML.innerHTML = `<p>${error}</p>`);

    } else if (filter === Filter.Completed) {
        btnsTasks.forEach(element => element.disabled = false);
        btnsTasks[2].disabled = true;

        getTasksFromOrigin()
            .then(data => {
                data = data.filter(value => value.done === true);
                listTasks(data);
            })
            .catch(error => taskListHTML.innerHTML = `<p>${error}</p>`);
    }
}

function addTask(event: KeyboardEvent) {
    if (event.key === 'Enter' && taskInput.value !== '') {
        let newTask: Task = {
            id: TASKS.length + 1, 
            name: taskInput.value,
            done: false
        };
        TASKS.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(TASKS));
        taskInput.value = '';
        filterTasks(Filter.All);
    }
}

/* function removeTask(task:Task) {
    let index = TASKS.indexOf(task);
    console.log(index);
} */

function updateCheck(task:Task) {
    task.done = !task.done;
    localStorage.setItem('tasks', JSON.stringify(TASKS));
}

filterTasks(Filter.All);

taskInput.addEventListener('keyup', addTask);
btnsTasks[0].addEventListener('click', () => filterTasks(Filter.All));
btnsTasks[1].addEventListener('click', () => filterTasks(Filter.Pending));
btnsTasks[2].addEventListener('click', () => filterTasks(Filter.Completed));

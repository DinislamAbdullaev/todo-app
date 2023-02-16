// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach((task) => renderTask (task));


checkEmptyList();
 
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

// Функции
function addTask (event) {
    event.preventDefault(); // Отмена отправки формы 

    const taskText = taskInput.value; // Достаем текст задачи из поля ввода

    const newTask = {
        id:  Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    saveToLocalSrorage();

    renderTask (newTask);


    // Очищаем поле ввода и возвращаем на него фокус. 
    taskInput.value = ""
    taskInput.focus()

    checkEmptyList();
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;
   
     // Проверяем что клик был по кнопке удалить задачу
    const parenNode = event.target.closest('.list-group-item');  

    const id = Number(parenNode.id); // Определяем айди задачи

    // находим индекс задачи в массиве 
    tasks = tasks.filter((task) => task.id !== id)

    saveToLocalSrorage();

    parenNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    //Проверяем что клик ьыл Не по кнопке "задача выполнена"
    if (event.target.dataset.action !== "done") return;

    //Проверяем что клик был по кнопке задача выполнена 
    const parentNode = event.target.closest('.list-group-item');

    // Определяем id звдвчи 
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done


    saveToLocalSrorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
} 

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
    
}

function saveToLocalSrorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Разметка для новой задачи
    const taskHTML = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
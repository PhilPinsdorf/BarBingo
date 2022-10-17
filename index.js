let tasks = [];
let completed = [];

checkForData();
loadCompleted();

function setAllFalse() {
    completed = [];

    for(let i = 0; i < 16; i++) {
        completed.push(false);
    }

    saveCompleted();
}

function checkForData() {
    let data = window.localStorage.getItem('indexes');

    if(data == null) {
        generateNewTasks();
        return;
    }

    loadTasks(data);
}

function loadTasks(data) {
    tasks = []

    fetch('./database/tasks.json')
        .then((response) => response.json())
        .then((json) => {
                let indexes = JSON.parse(data);

                indexes.forEach(i => {
                    tasks.push(json.tasks[i]);
                })

                createGrid();
        });
}

function generateNewTasks() {
    tasks = []
    setAllFalse();

    fetch('./database/tasks.json')
        .then((response) => response.json())
        .then((json) => {
                let indexes = [];
                let jsonLength = json.tasks.length;

                while (indexes.length < 16) {
                    let index = getRandomInt(jsonLength);
                    if(!indexes.includes(index)){
                        indexes.push(index);
                    }
                }

                indexes.forEach(i => {
                    tasks.push(json.tasks[i]);
                })

                window.localStorage.setItem('indexes', JSON.stringify(indexes));

                createGrid();
        });
}

function createGrid() {
    let table = document.createElement('table');
    table.classList.add('table');
    let comp = JSON.parse(window.localStorage.getItem('completed'));

    for(let i = 0; i < 4; i++) {
        let tr = document.createElement('tr');
        for(let j = 0; j < 4; j++) {
            let td = document.createElement('td');
            let div = document.createElement('div');
            div.classList.add('content');
            div.classList.add((i*4 + j) + '');
            div.innerText = tasks[(i*4 + j)];

            if(comp[(i*4 + j)]) {
                div.classList.add('success');
            }

            div.setAttribute( "onClick", "javascript: succededTask(this);");
            td.appendChild(div);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.querySelector('.table-container').appendChild(table);
}

function succededTask(element) {
    element.classList.toggle('success')

    let list = [...element.classList];
    if(list.includes('success')){
        list.splice(list.indexOf('success'), 1);
    }
    list.splice(list.indexOf('content'), 1);

    completed[list[0]] = !completed[list[0]];

    saveCompleted();
}

function saveCompleted() {
    window.localStorage.setItem('completed', JSON.stringify(completed));
}

function loadCompleted() {
    if(window.localStorage.getItem('completed') != null){
        completed = JSON.parse(window.localStorage.getItem('completed'));
        return;
    }
    setAllFalse();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

document.querySelector('.generate').addEventListener('click', () => {
    document.querySelector('.table').remove();
    window.localStorage.removeItem('indexes');
    generateNewTasks();
});

document.querySelector('.print').addEventListener('click', () => {
    window.print();
});
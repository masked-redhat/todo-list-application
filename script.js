const addToOngoing = (title, text) => {
    let ongoings = JSON.parse(localStorage.getItem('ongoing'));
    let index = Object.keys(ongoings).length;
    let newTodo = { 'title': title, 'text': text };
    let toDO = {};
    toDO[index] = newTodo;
    ongoings = Object.assign(toDO, ongoings);
    localStorage.setItem('ongoing', JSON.stringify(ongoings));
}

const deleteFromOngoing = (index) => {
    let ongoings = JSON.parse(localStorage.getItem('ongoing'));
    delete ongoings[index];
    let newOngoings = {};
    let length = Object.keys(ongoings).length;
    let i = 0;
    for (const todo in ongoings) {
        newOngoings[i] = ongoings[todo];
        i++;
    }
    localStorage.setItem('ongoing', JSON.stringify(newOngoings));
}

const addToCompleted = (title, text) => {
    let completed = JSON.parse(localStorage.getItem('completed'));
    let index = Object.keys(completed).length;
    let newTodo = { 'title': title, 'text': text };
    let toDO = {};
    toDO[index] = newTodo;
    completed = Object.assign(toDO, completed);
    localStorage.setItem('completed', JSON.stringify(completed));
    deleteFromOngoing(index);
}

const askToDeleteAll = () => {
    return confirm('All your todos will be deleted. Are you sure?');
}

const createList = () => {
    localStorage.clear();
    localStorage.setItem('ongoing', '{}');
    localStorage.setItem('completed', '{}');

    ongoingTodos.textContent = '';
    completedTodos.textContent = '';

    addTodoBtn.disabled = false;
    addTodoBtn.click();
}

const loadFromLocalStorage = () => {
    let ongoing = localStorage.getItem('ongoing');
    let completed = localStorage.getItem('completed');
    if (ongoing == null || completed == null) {
        localStorage.setItem('ongoing', '{}');
        localStorage.setItem('completed', '{}');
        createList();
        return;
    }
    else if (ongoing == '{}') {
        createList();
    }
    [ongoing, completed] = [JSON.parse(ongoing), JSON.parse(completed)];
    for (const _ in ongoing) {
        let todo = getTodoWBtns(ongoing[_].title, ongoing[_].text, _);
        ongoingTodos.prepend(todo);
    }
    for (const _ in completed) {
        let todo = getTodo(completed[_].title, completed[_].text);
        completedTodos.prepend(todo);
    }
}

const getTodoForm = () => {
    let ongoings = JSON.parse(localStorage.getItem('ongoing'));
    let index = Object.keys(ongoings).length;
    delete ongoings;

    let form = document.createElement('form');
    form.className = 'todo';
    form.onsubmit = () => false;

    let div = document.createElement('div');
    div.className = 'content';
    div.innerHTML = `<input type='text' class='inputText' id='inputTitle' name='title' placeholder='Title...' tabindex=1></input><textarea type='text' class='inputText' id='inputText' name='text' placeholder='Descriptive text' tabindex=2></textarea>`;

    form.append(div);

    div = document.createElement('div');
    div.className = 'buttons';

    let btn1 = document.createElement('button');
    btn1.className = 'btn';
    btn1.tabIndex = 3;
    let img = document.createElement('img');
    img.className = 'icon';
    img.src = './icons/check.svg';
    img.alt = 'create todo';
    btn1.append(img);

    let btn2 = document.createElement('button');
    btn2.tabIndex = 4;
    btn2.className = 'btn';
    img = document.createElement('img');
    img.className = 'icon';
    img.src = './icons/delete.svg';
    img.alt = 'cancel todo';
    btn2.append(img);

    btn1.onclick = () => {
        let [title, text] = [document.getElementById('inputTitle').value, document.getElementById('inputText').value];
        if (title.trim() !== '') {
            let todo = getTodoWBtns(title, text, index);
            ongoingTodos.prepend(todo);
            addToOngoing(title, text);
        }
        ongoingTodos.removeChild(form);
        addTodoBtn.disabled = false;
        removeNoText();
    }

    btn2.onclick = () => {
        ongoingTodos.removeChild(form);
        addTodoBtn.disabled = false;
        checkAndAdd();
    }

    div.append(btn1);
    div.append(btn2);

    form.append(div);

    return form;
}

const checkAndAdd = () => {
    let ongoing = JSON.parse(localStorage.getItem('ongoing'));
    let len = Object.keys(ongoing).length;
    if (len == 0) {
        let todo = document.createElement('div');
        todo.id = 'todo';
        todo.textContent = 'No Ongoing Todos.';
        ongoingTodos.append(todo);
    }
}

const removeNoText = () => {
    try {
        let todo = document.getElementById('todo');
        ongoingTodos.removeChild(todo);
    } catch { }
}

const getTodoWBtns = (title, message, index) => {
    let article = document.createElement('article');
    article.className = 'todo';

    let div = document.createElement('div');
    div.className = 'content';
    div.innerHTML = `<h3>${title}</h3><p>${message}</p>`;

    article.append(div);

    div = document.createElement('div');
    div.className = 'buttons';

    let btn1 = document.createElement('button');
    btn1.className = 'btn';
    btn1.dataset.index = index;
    let img = document.createElement('img');
    img.className = 'icon';
    img.src = './icons/check.svg';
    img.alt = 'create todo';
    btn1.append(img);

    let btn2 = document.createElement('button');
    btn2.className = 'btn';
    btn2.dataset.index = index;
    img = document.createElement('img');
    img.className = 'icon';
    img.src = './icons/delete.svg';
    img.alt = 'cancel todo';
    btn2.append(img);

    btn1.onclick = () => {
        let [title, text] = [article.firstElementChild.firstElementChild.textContent, article.firstElementChild.lastElementChild.textContent];
        addToCompleted(title, text);
        completedTodos.prepend(getTodo(title, text));
        ongoingTodos.removeChild(article);
        checkAndAdd();
    }

    btn2.onclick = () => {
        deleteFromOngoing(btn2.dataset.index);
        ongoingTodos.removeChild(article);
        checkAndAdd();
    }

    div.append(btn1);
    div.append(btn2);

    article.append(div);

    return article;
}

const getTodo = (title, message) => {
    let article = document.createElement('article');
    article.className = 'todo';

    let div = document.createElement('div');
    div.className = 'content';
    div.innerHTML = `<h3>${title}</h3><p>${message}</p>`;

    article.append(div);

    return article
}

const createListBtn = document.getElementById('createList');

const addTodoBtn = document.getElementById('addTodo');

const ongoingTodos = document.querySelector('#ongoing > .todos');

const completedTodos = document.querySelector('#completed > .todos');

addTodoBtn.onclick = () => {
    let todo = getTodoForm();
    ongoingTodos.prepend(todo);
    document.getElementById('inputTitle').focus();
    addTodoBtn.disabled = true;
    removeNoText();
}

createListBtn.onclick = () => {
    if (!askToDeleteAll()) {
        return;
    }
    createList();
}

loadFromLocalStorage();
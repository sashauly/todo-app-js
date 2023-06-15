(function () {
  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }
  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    form.setAttribute('id', 'form-input');
    input.classList.add('form-control');
    input.setAttribute('id', 'input-text');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }
  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }
  function createTodoItem(task) {
    const item = document.createElement('li');

    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = task.name;
    if (task.done) {
      item.classList.toggle('list-group-item-success');
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }
  function createTodoApp(container, title = 'Список дел', listName) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const parseObject = JSON.parse(localStorage.getItem(title));

    if (parseObject) listName = Object.assign(listName, parseObject);
    if (listName) {
      for (const task of listName) {
        todoItem = createTodoItem(task);
        if (!task.id) {
          let date = new Date().getTime();
          task.id = date;
          date++;
        }
        todoList.append(todoItem.item);

        todoItem.doneButton.addEventListener('click', (e) => {
          if (!task.done) {
            task.done = true;
            e.target.parentNode.parentNode.classList.toggle('list-group-item-success');
            localStorage.setItem(title, JSON.stringify(listName));
          } else {
            task.done = false;
            e.target.parentNode.parentNode.classList.remove('list-group-item-success');
            localStorage.setItem(title, JSON.stringify(listName));
          }
        });

        todoItem.deleteButton.addEventListener('click', (e) => {
          if (confirm('Вы уверены?')) {
            listName.splice(listName.indexOf(task), 1);
            e.target.parentNode.parentNode.remove();
            localStorage.setItem(title, JSON.stringify(listName));
          }
        });
      }
    }

    todoItemForm.input.addEventListener('input', () => {
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
      } else {
        todoItemForm.button.disabled = false;
      }
    });

    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }
      const task = { id: new Date().getTime(), name: todoItemForm.input.value, done: false };
      const todoItem = createTodoItem(task);
      listName.push(task);
      localStorage.setItem(title, JSON.stringify(listName));
      todoItem.doneButton.addEventListener('click', () => {
        if (!task.done) {
          task.done = true;
          todoItem.item.classList.toggle('list-group-item-success');
          localStorage.setItem(title, JSON.stringify(listName));
        } else {
          task.done = false;
          todoItem.item.classList.remove('list-group-item-success');
          localStorage.setItem(title, JSON.stringify(listName));
        }
      });
      todoItem.deleteButton.addEventListener('click', () => {
        if (confirm('Вы уверены?')) {
          listName.splice(listName.indexOf(task), 1);
          todoItem.item.remove();
          localStorage.setItem(title, JSON.stringify(listName));
        }
      });

      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    });
  }
  window.createTodoApp = createTodoApp;
}());

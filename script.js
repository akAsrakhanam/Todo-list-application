const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskList = document.getElementById('taskList');
    let tasks = [];

    function addTask() {
      const taskName = taskInput.value.trim();
      const dueDate = dueDateInput.value;
      const priority = priorityInput.value;

      if (taskName === '') return;

      const task = {
        id: Date.now(),
        name: taskName,
        dueDate: dueDate,
        priority: priority,
        completed: false
      };

      tasks.push(task);
      renderTask(task);
      saveToLocalStorage();
      taskInput.value = '';
      dueDateInput.value = '';
      priorityInput.value = 'low';
    }

    function renderTask(task) {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
      <input type="checkbox" onchange="toggleComplete(${task.id})" ${task.completed ? 'checked' : ''}>
      <span>${task.name}</span>
      <span>Due Date: ${task.dueDate}</span>
      <span>Priority: ${task.priority}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      <button class="edit-btn" onclick="openEditTaskModal(${task.id})">Edit</button>
    `;

      if (task.priority === 'low') {
        taskItem.classList.add('low-priority');
      } else if (task.priority === 'medium') {
        taskItem.classList.add('medium-priority');
      } else if (task.priority === 'high') {
        taskItem.classList.add('high-priority');
      }

      if (task.completed) {
        taskItem.classList.add('completed');
      }
      taskList.appendChild(taskItem);
    }

    function deleteTask(id) {
      tasks = tasks.filter(task => task.id !== id);
      saveToLocalStorage();
      renderTasks();
    }

    function toggleComplete(id) {
      tasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      saveToLocalStorage();
      renderTasks();
    }

    function filterTasks(filterType) {
      let filteredTasks = [];
      switch (filterType) {
        case 'all':
          filteredTasks = tasks;
          break;
        case 'active':
          filteredTasks = tasks.filter(task => !task.completed);
          break;
        case 'completed':
          filteredTasks = tasks.filter(task => task.completed);
          break;
      }
      renderTasks(filteredTasks);
      const filterButtons = document.querySelectorAll('.filter-container button');
      filterButtons.forEach(button => {
        button.classList.toggle('active', button.innerText.toLowerCase() === filterType);
      });
    }

    function renderTasks(filteredTasks = tasks) {
      taskList.innerHTML = '';
      filteredTasks.forEach(task => renderTask(task));
    }

    function saveToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
      const storedTasks = localStorage.getItem('tasks');
      tasks = storedTasks ? JSON.parse(storedTasks) : [];
      renderTasks();
    }

    loadFromLocalStorage();

    let editingTaskId = null;

    function openEditTaskModal(taskId) {
      editingTaskId = taskId;
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        const editTaskNameInput = document.getElementById('editTaskNameInput');
        const editDueDateInput = document.getElementById('editDueDateInput');
        const editDescriptionInput = document.getElementById('editDescriptionInput');

        editTaskNameInput.value = task.name;
        editDueDateInput.value = task.dueDate;
        editDescriptionInput.value = task.description || '';

        const modal = document.getElementById('editTaskModal');
        modal.style.display = 'block';
      }
    }

    function closeEditTaskModal() {
      editingTaskId = null;
      const modal = document.getElementById('editTaskModal');
      modal.style.display = 'none';
    }

    function saveEditedTask() {
      if (editingTaskId !== null) {
        const editTaskNameInput = document.getElementById('editTaskNameInput');
        const editDueDateInput = document.getElementById('editDueDateInput');
        const editDescriptionInput = document.getElementById('editDescriptionInput');

        const editedTask = {
          name: editTaskNameInput.value.trim(),
          dueDate: editDueDateInput.value,
          description: editDescriptionInput.value.trim(),
        };

        if (editedTask.name === '') {
          alert('Task name cannot be empty.');
          return;
        }
        tasks = tasks.map(task => {
          if (task.id === editingTaskId) {
            return { ...task, ...editedTask };
          }
          return task;
        });

        saveToLocalStorage();
        renderTasks();
        closeEditTaskModal();
      }
    }

   
  
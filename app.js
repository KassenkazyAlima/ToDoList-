// app.js

// Class for a Todo Item
class Todo {
    constructor(title, description, dueDate, priority, notes = '', completed = false) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}

// Class for a Project
class Project {
    constructor(name) {
        this.id = Date.now();
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodos() {
        return this.todos;
    }
}

// Application state
let projects = loadFromLocalStorage();
let currentProject = null;

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load data from localStorage
function loadFromLocalStorage() {
    const data = localStorage.getItem('projects');
    return data ? JSON.parse(data) : [];
}

// Render Projects
// Updated renderProjects function
function renderProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = ''; // Clear existing list
    projects.forEach(project => {
        const li = document.createElement('li');
        li.classList.add('project-item');
        li.textContent = project.name;

        // Create Delete X Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-x');
        deleteBtn.textContent = 'X';
        deleteBtn.onclick = () => deleteProject(project.id);
        
        // Add Delete X button to the project list item
        li.appendChild(deleteBtn);
        
        // Handle project click to select it
        li.onclick = () => setCurrentProject(project);

        // Append the project to the project list
        projectList.appendChild(li);
    });
}

// Delete Project
function deleteProject(projectId) {
    projects = projects.filter(project => project.id !== projectId);
    saveToLocalStorage();
    renderProjects();
    clearCurrentProject();
}


// Set the current selected project
function setCurrentProject(project) {
    currentProject = project;
    renderTodos();
}

// Clear the current project
function clearCurrentProject() {
    currentProject = null;
    renderTodos();
}

// Render Todos for the current selected project
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    if (!currentProject) return;

    currentProject.getTodos().forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('todo-item', todo.priority + '-priority');
        li.textContent = `${todo.title} - Due: ${todo.dueDate}`;
        li.onclick = () => showTodoDetails(todo);
        if (todo.completed) {
            li.classList.add('completed');
        }
        todoList.appendChild(li);
    });
}

// Show Todo Details
function showTodoDetails(todo) {
    const todoDetail = document.getElementById('todoDetail');
    document.getElementById('todoTitleDetail').textContent = todo.title;
    document.getElementById('todoDescriptionDetail').textContent = todo.description;
    document.getElementById('todoDueDateDetail').textContent = todo.dueDate;
    document.getElementById('todoPriorityDetail').textContent = todo.priority;
    todoDetail.style.display = 'block';

    document.getElementById('completeTodo').onclick = () => {
        todo.toggleCompletion();
        saveToLocalStorage();
        renderTodos();
        renderProjects();
        showTodoDetails(todo); // Refresh the details view
    };

    document.getElementById('deleteTodo').onclick = () => {
        currentProject.removeTodo(todo.id);
        saveToLocalStorage();
        renderTodos();
        renderProjects();
        todoDetail.style.display = 'none';
    };
}

// Add New Project
document.getElementById('newProjectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    const newProject = new Project(projectName);
    projects.push(newProject);
    saveToLocalStorage();
    renderProjects();
    document.getElementById('projectName').value = ''; // Clear input
});

// Add New Todo
document.getElementById('newTodoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const dueDate = document.getElementById('todoDueDate').value;
    const priority = document.getElementById('todoPriority').value;

    if (!currentProject) return;

    const newTodo = new Todo(title, description, dueDate, priority);
    currentProject.addTodo(newTodo);
    saveToLocalStorage();
    renderTodos();
    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
    document.getElementById('todoDueDate').value = '';
});

// Initial rendering
renderProjects();

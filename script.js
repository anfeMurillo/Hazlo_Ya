document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const taskTitleInput = document.getElementById('task-title-input'); // Entrada para el título de la tarea
    const taskDescInput = document.getElementById('task-desc-input'); // Entrada para la descripción de la tarea
    const addTaskBtn = document.getElementById('add-task-btn'); // Botón para agregar una tarea
    const taskList = document.getElementById('task-list'); // Lista donde se mostrarán las tareas
    const filterAllBtn = document.getElementById('filter-all'); // Botón para mostrar todas las tareas
    const filterActiveBtn = document.getElementById('filter-active'); // Botón para mostrar tareas activas
    const filterCompletedBtn = document.getElementById('filter-completed'); // Botón para mostrar tareas completadas

    // --- Estado ---
    let tasks = []; // Aquí se guardan todas las tareas
    let currentFilter = 'all'; // Filtro actual: 'all', 'active', 'completed'

    // --- Funciones ---

    // RF6: Cargar tareas desde el LocalStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks'); // Obtener tareas guardadas
        if (storedTasks) {
            tasks = JSON.parse(storedTasks); // Convertirlas de texto a un arreglo
        }
        renderTasks(); // Mostrar las tareas en la pantalla
    }

    // RF6: Guardar tareas en el LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar las tareas como texto
    }

    // Mostrar las tareas según el filtro actual
    function renderTasks() {
        taskList.innerHTML = ''; // Limpiar la lista actual

        // Filtrar las tareas
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') {
                return !task.completed; // Mostrar solo las tareas activas
            } else if (currentFilter === 'completed') {
                return task.completed; // Mostrar solo las tareas completadas
            }
            return true; // Mostrar todas las tareas si el filtro es 'all'
        });

        // Actualizar el estilo del botón del filtro activo
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (currentFilter === 'all') filterAllBtn.classList.add('active');
        else if (currentFilter === 'active') filterActiveBtn.classList.add('active');
        else if (currentFilter === 'completed') filterCompletedBtn.classList.add('active');

        if (filteredTasks.length === 0) {
            // Mostrar un mensaje si no hay tareas que coincidan con el filtro
            const emptyMsg = document.createElement('li');
            emptyMsg.textContent = 'No hay tareas en esta categoría.';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#888';
            emptyMsg.style.marginTop = '20px';
            taskList.appendChild(emptyMsg);
            return;
        }

        // Crear y agregar los elementos de las tareas
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`; // Agregar clase según el estado
            li.dataset.id = task.id; // Guardar el ID de la tarea

            // Título de la tarea (se puede hacer clic para ver la descripción)
            const titleSpan = document.createElement('span');
            titleSpan.className = 'task-title';
            titleSpan.textContent = task.title;
            titleSpan.addEventListener('click', () => showDescription(task.id)); // Mostrar descripción al hacer clic

            li.appendChild(titleSpan);

            // Botones de acción
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            // Botón para completar o alternar estado (corazón) - RF3
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            // Usar corazón sólido (fas) si está completada, regular (far) si está activa
            completeBtn.innerHTML = `<i class="${task.completed ? 'fas' : 'far'} fa-heart"></i>`;
            completeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se active el evento de clic en el elemento li
                toggleComplete(task.id);
            });
            actionsDiv.appendChild(completeBtn);

            

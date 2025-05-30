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
            // Botón para editar (lápiz) - RF2
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se active el evento de clic en el elemento li
                editTask(task.id);
            });
            actionsDiv.appendChild(editBtn);

            // Botón para eliminar (basura) - RF4
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se active el evento de clic en el elemento li
                deleteTask(task.id);
            });
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    }

    // RF1: Agregar una nueva tarea
    function addTask() {
        const title = taskTitleInput.value.trim(); // Obtener el título de la tarea
        const description = taskDescInput.value.trim(); // Obtener la descripción de la tarea (opcional)

        if (title === '') {
            alert('El título de la tarea no puede estar vacío.'); // Mostrar alerta si el título está vacío
            return;
        }

        const newTask = {
            id: Date.now().toString(), // Crear un ID único usando la fecha actual
            title: title,
            description: description,
            completed: false // Nueva tarea comienza como no completada
        };

        tasks.push(newTask); // Agregar la nueva tarea al arreglo
        saveTasks(); // Guardar las tareas en el LocalStorage
        renderTasks(); // Mostrar las tareas actualizadas

        // Limpiar los campos de entrada
        taskTitleInput.value = '';
        taskDescInput.value = '';
    }

    // RF3: Alternar el estado de completado de una tarea
    function toggleComplete(id) {
        const taskIndex = tasks.findIndex(task => task.id === id); // Buscar la tarea por su ID
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed; // Cambiar el estado de completado
            saveTasks(); // Guardar los cambios
            renderTasks(); // Volver a mostrar las tareas
        }
    }

    // RF2: Editar el título y la descripción de una tarea
    function editTask(id) {
        const taskIndex = tasks.findIndex(task => task.id === id); // Buscar la tarea por su ID
        if (taskIndex > -1) {
            const task = tasks[taskIndex];

            const newTitle = prompt('Ingrese el nuevo título de la tarea:', task.title); // Pedir nuevo título
            if (newTitle !== null) {
                const newDescription = prompt('Ingrese la nueva descripción de la tarea:', task.description); // Pedir nueva descripción

                if (newDescription !== null) {
                    tasks[taskIndex].title = newTitle.trim() === '' ? task.title : newTitle.trim(); // Mantener el título anterior si el nuevo está vacío
                    tasks[taskIndex].description = newDescription.trim(); // Permitir descripción vacía
                    saveTasks(); // Guardar los cambios
                    renderTasks(); // Volver a mostrar las tareas
                }
            }
        }
    }

    // RF4: Eliminar una tarea
    function deleteTask(id) {
        if (confirm('¿Está seguro de que desea eliminar esta tarea?')) { // Confirmar antes de eliminar
            tasks = tasks.filter(task => task.id !== id); // Eliminar la tarea del arreglo
            saveTasks(); // Guardar los cambios
            renderTasks(); // Volver a mostrar las tareas
        }
    }

    // RF5: Cambiar el filtro
    function setFilter(filter) {
        currentFilter = filter; // Cambiar el filtro actual
        renderTasks(); // Volver a mostrar las tareas según el nuevo filtro
    }

    // Mostrar una alerta con la descripción de la tarea
    function showDescription(id) {
        const task = tasks.find(task => task.id === id); // Buscar la tarea por su ID
        if (task) {
            alert(`Descripción de "${task.title}":\n\n${task.description || '(Sin descripción)'}`); // Mostrar la descripción o un mensaje si no hay
        }
    }

    // --- Escuchadores de eventos ---
    addTaskBtn.addEventListener('click', addTask); // Escuchar clic en el botón para agregar tarea

    // Permitir agregar tarea con la tecla Enter en el campo de título
    taskTitleInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evitar que se envíe un formulario si estuviera en uno
            addTask(); // Agregar la tarea
        }
    });

    // Escuchadores para los botones de filtro - RF5
    filterAllBtn.addEventListener('click', () => setFilter('all')); // Mostrar todas las tareas
    filterActiveBtn.addEventListener('click', () => setFilter('active')); // Mostrar tareas activas
    filterCompletedBtn.addEventListener('click', () => setFilter('completed')); // Mostrar tareas completadas

    // --- Carga inicial ---
    loadTasks(); // Cargar las tareas al iniciar la página
});

            

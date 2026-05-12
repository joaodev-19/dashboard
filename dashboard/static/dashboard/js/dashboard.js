import { getFormData } from "./form.js";
import { postTask, fetchTasks, fetchTaskById, deleteTask, updateStatusTask, updateTask } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        form: document.querySelector('#task-form'),
        taskList: document.querySelector('#task-list'),

        total: document.querySelector('#total-tasks'),
        pending: document.querySelector('#pending-tasks'),
        completed: document.querySelector('#completed-tasks'),

        filterStatus: document.querySelector('#filter-status'),

        editModal: document.querySelector('#editTaskModal'),
        editTaskForm: document.querySelector('#edit-task-form')
    }

    const actions = {
        'toggle': async (button) => {
            const id = button.dataset.id;
            const status = button.dataset.status === 'PE' ? 'DN' : 'PE';
            await updateStatusTask(id, status);
        },
        'delete': async (button) => {
            const id = button.dataset.id;
            if (!id) return;
            await deleteTask(id);
        },
    }

    async function renderDashboard() {
        const filters = elements.filterStatus.value;
        const tasks = await fetchTasks(filters);

        if (tasks && Array.isArray(tasks)) {
            if (elements.total) {
                elements.total.innerText = tasks.length;
                elements.pending.innerText = tasks.filter(t => t.status === 'PE').length;
                elements.completed.innerText = tasks.filter(t => t.status === 'DN').length;
            }

            elements.taskList.innerHTML = tasks.map(task => {
                const isDone = task.status === 'DN';
                const buttonClass = isDone ? 'btn-outline-warning' : 'btn-outline-success';
                const buttonIcon = isDone ? '⟲' : '✓';
                const badgeClass = isDone ? 'bg-success' : 'bg-primary';

                return `
                    <div class="card task-card urgency-${task.urgency} p-3 mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${task.title}</strong>
                                <br>
                                <small class="text-muted">Entrega: ${new Date(task.due_date).toLocaleDateString()}</small>
                            </div>
                            <div class="actions">
                                <button class="btn btn-sm ${buttonClass}"
                                        data-action="toggle" 
                                        data-id="${task.id}"
                                        data-status=${task.status}>
                                        ${buttonIcon}
                                </button>
                                <button class="btn btn-sm btn-outline-primary"
                                        data-action="edit" data-id="${task.id}"
                                        data-bs-toggle="modal" data-bs-target="#editTaskModal">
                                        🖊
                                </button>
                                <button class="btn btn-sm btn-outline-danger"
                                        data-action="delete" data-id="${task.id}">
                                        X
                                </button>
                            </div>
                            <span class="badge ${badgeClass}">${task.status}</span>
                        </div>
                    </div>    
                `;
            }).join('');
        }
    }

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newTask = getFormData(elements.form);
        const sucess = await postTask(newTask);

        if (sucess) {
            elements.form.reset();
            await renderDashboard();
        }
    });

    elements.editTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const taskId = document.getElementById('edit-task-id').value;
        const updatedData = {
            title: document.querySelector('#edit-title').value,
            description: document.querySelector('#edit-description').value,
            status: document.querySelector('#edit-status').value,
            due_date: document.querySelector('#edit-due-date').value
        }

        const success = await updateTask(taskId, updatedData);

        if (success){
            const modalInstance = bootstrap.Modal.getInstance(elements.editModal) || new bootstrap.Modal(elements.editModal);
            modalInstance.hide();

            await renderDashboard();
        }
    })

    elements.taskList.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;

        if (!actions[action]) return;

        await actions[action](button);
        renderDashboard();
    });

    elements.filterStatus.addEventListener('change', () => {
        renderDashboard();
    });

    elements.editModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        if (!button) return;

        const taskId = button.dataset.id;
        if (!taskId) return;

        const task = await fetchTaskById(taskId);
        if (task) {
            document.getElementById('edit-task-id').value = task.id;
            document.getElementById('edit-title').value = task.title;
    
            if(document.getElementById('edit-description')) {
                document.getElementById('edit-description').value = task.description;
            }
            
            if (task.due_date) {
                document.getElementById('edit-due-date').value = task.due_date.slice(0, 16);
            }
        }

    })

    renderDashboard();
});
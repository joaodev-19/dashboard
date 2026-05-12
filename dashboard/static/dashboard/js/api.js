function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export async function postTask(task){
    if (Object.keys(task).length === 0 && task.constructor === Object) return;

    try{
        const response = await fetch('api/tasks/', {
            method: 'POST',                         // método http
            headers: {
                'Content-Type': 'application/json', // indica que corpo é json
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(task) // objeto enviado
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`Erro na API: ${response.status}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Erro na requisição:", error.message);
        throw error;
    }
}

export async function fetchTaskById(id){
    if (!id) return;

    try{
        const url = `api/tasks/${id}`;
        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok){
            console.error(`Erro na API: ${response.status}`);
            return [];
        }
        return data;
    } catch (error){
        console.error("Erro na requisição:", error.message);
        throw error;
    }
}

export async function fetchTasks(status = ''){
    try{
        const url = `api/tasks/${status ? '?status=' + status : ''}`;
        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok){
            console.error(`Erro na API: ${response.status}`);
            return [];
        }

        return data;
    } catch (error){
        console.error("Erro na requisição:", error.message);
        throw error;
    }
}

export async function deleteTask(taskId){
    if (!taskId) return;

    try{
        const url = `api/tasks/${taskId}/`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        });

        if (response.status === 204) return true;

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro no servidor:", errorData);
            return false;
        }

        return true;
    } catch (error){
        console.error("Erro na requisição:", error.message);
        throw error;
    }
}

export async function updateStatusTask(taskId, newStatus){
    if (!taskId || !newStatus) return;

    try{
        const url = `api/tasks/${taskId}/`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ status: newStatus })
        })
    } catch (error){
        console.error(`Erro na requisição:`, error.message);
        throw error;
    }
}

export async function updateTask(taskId, newTask){
    if (!taskId || Object.keys(newTask).length === 0 && newTask.constructor === Object) return;

    try{
        const url = `api/tasks/${taskId}/`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(newTask)
        })

        if (response.ok){
            return await response.json();
        } else {
            const errorData = await response.json();
            console.error("Erro de validação:", errorData);
            return false;
        }
    } catch (error){
        console.error(`Erro na requisição:`, error.message);
        return false;
    }
}
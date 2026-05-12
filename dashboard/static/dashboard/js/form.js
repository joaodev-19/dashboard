export function getFormData(form){
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData);
    return dados;
}

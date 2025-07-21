document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';

    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const recordsContainer = document.getElementById('recordsContainer');
    const userInfo = document.getElementById('userInfo');

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const uploadForm = document.getElementById('uploadForm');

    const logoutButton = document.getElementById('logoutButton');
    const fetchDatasetsButton = document.getElementById('fetchDatasetsButton');

    const datasetsList = document.getElementById('datasetsList');
    const recordsList = document.getElementById('recordsList');


    let authToken = localStorage.getItem('authToken');

    const apiFetch = async (endpoint, options = {}) => {
        const url = `${API_URL}${endpoint}`;
        const headers = { ...options.headers };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Erro ${response.status}`);
            }
            return data;
        } catch (error) {
            showAlert(error.message, 'error');
            console.error('API Fetch Error:', endpoint, error);
            return null; 
        }
    };

    const updateUI = () => {
        if (authToken) {
            authSection.classList.add('hidden');
            userSection.classList.remove('hidden');
            fetchAuthenticatedUser();
            fetchDatasets();
        } else {
            authSection.classList.remove('hidden');
            userSection.classList.add('hidden');
            recordsContainer.classList.add('hidden');
            userInfo.textContent = '';
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    };

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            nome: e.target.registerName.value,
            email: e.target.registerEmail.value,
            senha: e.target.registerPassword.value,
        });
        const result = await apiFetch('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        
        if (result) {
            showAlert('Usuário registrado com sucesso! Faça o login.', 'success');
            registerForm.reset();
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            email: e.target.loginEmail.value,
            senha: e.target.loginPassword.value,
        });
        const data = await apiFetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        
        if (data) { 
            authToken = data.token;
            localStorage.setItem('authToken', authToken);

            if (data.user.role === 'USER') {
                window.location.href = '/chat.html';
            } else {
                updateUI();
            }
        }
    });

    logoutButton.addEventListener('click', () => {
        authToken = null;
        localStorage.removeItem('authToken');
        window.location.href = '/'; 
    });

    const fetchAuthenticatedUser = async () => {
        const user = await apiFetch('/auth/me');
        if (user) {
            userInfo.textContent = `Logado como: ${user.nome} (${user.role})`;
        } else {
            logoutButton.click();
        }
    };

    const fetchDatasets = async () => {
        const datasets = await apiFetch('/datasets');
        if (!datasets) return; 
        datasetsList.innerHTML = '';
        if (datasets.length === 0) {
            datasetsList.innerHTML = '<li>Nenhum dataset encontrado.</li>';
            return;
        }
        datasets.forEach(d => {
            const li = document.createElement('li');
            li.className = 'p-2 border-b cursor-pointer hover:bg-gray-50';
            li.textContent = `ID: ${d.id} - ${d.nome} (${new Date(d.criadoEm).toLocaleDateString()})`;
            li.onclick = () => fetchRecords(d.id, d.nome);
            datasetsList.appendChild(li);
        });
    };

    const fetchRecords = async (datasetId, datasetName) => {
        const records = await apiFetch(`/datasets/${datasetId}/records`);
        if (!records) return;

        document.getElementById('recordsTitle').textContent = `Registros do Dataset: ${datasetName}`;
        recordsList.innerHTML = '';
        if (records.length === 0) {
            recordsList.innerHTML = '<li>Nenhum registro encontrado para este dataset.</li>';
        } else {
             records.forEach(r => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(r.dadosJson);
                recordsList.appendChild(li);
            });
        }
        recordsContainer.classList.remove('hidden');
    };
    
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.fileInput.files[0]);

        const result = await apiFetch('/datasets/upload', { method: 'POST', body: formData });

        if (result) {
            showAlert('Arquivo enviado com sucesso!', 'success');
            fetchDatasets();
            uploadForm.reset();
        }
    });

    fetchDatasetsButton.addEventListener('click', fetchDatasets);

    updateUI();
}); 
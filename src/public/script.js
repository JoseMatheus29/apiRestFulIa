document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';

    // Elementos da UI
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const queriesSection = document.getElementById('queriesSection');
    const recordsContainer = document.getElementById('recordsContainer');
    const userInfo = document.getElementById('userInfo');
    const apiResponse = document.getElementById('apiResponse');

    // Formulários
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const uploadForm = document.getElementById('uploadForm');
    const queryForm = document.getElementById('queryForm');

    // Botões
    const logoutButton = document.getElementById('logoutButton');
    const fetchDatasetsButton = document.getElementById('fetchDatasetsButton');
    const fetchQueriesButton = document.getElementById('fetchQueriesButton');

    // Listas
    const datasetsList = document.getElementById('datasetsList');
    const recordsList = document.getElementById('recordsList');
    const queriesList = document.getElementById('queriesList');
    const queryDatasetSelect = document.getElementById('queryDatasetSelect');


    let authToken = localStorage.getItem('authToken');

    // Função genérica para chamadas à API
    const apiFetch = async (endpoint, options = {}) => {
        const url = `${API_URL}${endpoint}`;
        const headers = { ...options.headers };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();
            
            apiResponse.textContent = JSON.stringify(data, null, 2);

            if (!response.ok) {
                throw new Error(data.message || 'Erro na API');
            }
            return data;
        } catch (error) {
            apiResponse.textContent = `Erro: ${error.message}`;
            console.error('API Fetch Error:', error);
            throw error;
        }
    };

    // --- LÓGICA DE UI ---
    const updateUI = () => {
        if (authToken) {
            authSection.classList.add('hidden');
            userSection.classList.remove('hidden');
            queriesSection.classList.remove('hidden');
            fetchAuthenticatedUser();
            fetchDatasets();
            fetchQueries();
        } else {
            authSection.classList.remove('hidden');
            userSection.classList.add('hidden');
            queriesSection.classList.add('hidden');
            recordsContainer.classList.add('hidden');
            userInfo.textContent = '';
            // Sempre mostrar login por padrão
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    };

    // --- AUTENTICAÇÃO ---
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
        await apiFetch('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        alert('Usuário registrado com sucesso! Faça o login.');
        registerForm.reset();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const body = JSON.stringify({
                email: e.target.loginEmail.value,
                senha: e.target.loginPassword.value,
            });
            const data = await apiFetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            updateUI();
        } catch (error) {
            alert('Falha no login. Verifique suas credenciais.');
        }
    });

    logoutButton.addEventListener('click', () => {
        authToken = null;
        localStorage.removeItem('authToken');
        updateUI();
    });

    const fetchAuthenticatedUser = async () => {
        try {
            const user = await apiFetch('/auth/me');
            userInfo.textContent = `Logado como: ${user.nome} (${user.email})`;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
        }
    };

    // --- DATASETS ---
    const fetchDatasets = async () => {
        try {
            const datasets = await apiFetch('/datasets');
            datasetsList.innerHTML = '';
            queryDatasetSelect.innerHTML = '<option value="">Selecione um Dataset</option>';
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

                const option = document.createElement('option');
                option.value = d.id;
                option.textContent = d.nome;
                queryDatasetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao buscar datasets:', error);
        }
    };

    const fetchRecords = async (datasetId, datasetName) => {
        try {
            const records = await apiFetch(`/datasets/${datasetId}/records`);
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
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
        }
    };
    
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.fileInput.files[0]);

        try {
            await apiFetch('/datasets/upload', { method: 'POST', body: formData });
            alert('Arquivo enviado com sucesso!');
            fetchDatasets();
            uploadForm.reset();
        } catch (error) {
             alert('Falha no upload. Verifique o console para mais detalhes.');
        }
    });

    fetchDatasetsButton.addEventListener('click', fetchDatasets);

    // --- QUERIES ---
    const fetchQueries = async () => {
        try {
            const queries = await apiFetch('/queries');
            queriesList.innerHTML = '';
            if (queries.length === 0) {
                queriesList.innerHTML = '<li>Nenhum histórico de consulta.</li>';
                return;
            }
            queries.forEach(q => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>P:</strong> ${q.pergunta} <br> <strong>R:</strong> ${q.resposta}`;
                queriesList.appendChild(li);
            });
        } catch (error) {
             console.error('Erro ao buscar queries:', error);
        }
    };
    
    queryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const body = JSON.stringify({
                pergunta: e.target.queryInput.value,
                datasetId: parseInt(e.target.queryDatasetSelect.value),
            });
            await apiFetch('/queries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
            alert('Query enviada com sucesso!');
            fetchQueries();
            queryForm.reset();
        } catch (error) {
            alert('Falha ao enviar query.');
        }
    });

    fetchQueriesButton.addEventListener('click', fetchQueries);

    // --- INICIALIZAÇÃO ---
    updateUI();
}); 
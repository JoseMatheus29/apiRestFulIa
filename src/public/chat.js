document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';
    const authToken = localStorage.getItem('authToken');

    // Elementos do Chat
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const datasetSelect = document.getElementById('chatDatasetSelect');
    const logoutButton = document.getElementById('logoutButton');

    if (!authToken) {
        // Usa a função de alerta para mostrar o erro
        showAlert('Você não está autenticado. Faça login no <a href="/index.html" class="font-bold underline">painel de admin</a>.', 'error');
        chatForm.classList.add('hidden');
        return;
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    });

    // Função genérica para chamadas à API
    const apiFetch = async (endpoint, options = {}) => {
        const url = `${API_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na API');
        }
        return response.json();
    };

    // Adicionar mensagem na tela
    const addMessage = (sender, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        if (sender === 'user') {
            messageDiv.className = 'p-3 rounded-lg bg-blue-500 text-white self-end max-w-xs break-words';
        } else {
            messageDiv.className = 'p-3 rounded-lg bg-gray-200 text-gray-700 self-start max-w-xs break-words';
        }
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    };

    // Carregar datasets no select
    const loadDatasets = async () => {
        try {
            const datasets = await apiFetch('/datasets');
            datasetSelect.innerHTML = '<option value="">Selecione um dataset...</option>';
            datasets.forEach(d => {
                const option = document.createElement('option');
                option.value = d.id;
                option.textContent = d.nome;
                datasetSelect.appendChild(option);
            });
        } catch (error) {
            showAlert(`Erro ao carregar documentos: ${error.message}`, 'error');
        }
    };

    // Lidar com o envio do formulário
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = chatInput.value.trim();
        const datasetId = datasetSelect.value;

        if (!question || !datasetId) {
            showAlert('Por favor, selecione um documento e faça uma pergunta.', 'info');
            return;
        }

        addMessage('user', question);
        chatInput.value = '';

        try {
            const body = JSON.stringify({ pergunta: question, datasetId: parseInt(datasetId) });
            const queryResponse = await apiFetch('/queries', { method: 'POST', body });
            addMessage('bot', queryResponse.resposta);
        } catch (error) {
            showAlert(`Ocorreu um erro: ${error.message}`, 'error');
        }
    });

    // Inicialização
    loadDatasets();
}); 
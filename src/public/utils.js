function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const colors = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    };

    const alertDiv = document.createElement('div');
    alertDiv.className = `p-4 border-l-4 ${colors[type] || colors.info} rounded-r-lg shadow-md transition-transform transform-gpu`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `<p class="font-bold">${type.charAt(0).toUpperCase() + type.slice(1)}</p><p>${message}</p>`;

    container.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
} 
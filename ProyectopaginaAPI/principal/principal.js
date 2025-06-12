document.addEventListener('DOMContentLoaded', () => {
    // Guardia de ruta
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../base/index.html';
        return;
    }

    // Bienvenida y logout (Aquí también se limpia la sesión completa)
    document.getElementById('welcome-message').textContent = `Hola, ${loggedInUser.username}`;
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear(); // Esto borra TODO, incluidas las preguntas
        window.location.href = '../base/index.html';
    });

    const categorySelect = document.getElementById('category');
    const generatorForm = document.getElementById('trivia-generator-form');

    // --- Cargar categorías de la API ---
    async function loadCategories() {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const data = await response.json();
            data.trivia_categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            alert('No se pudieron cargar las categorías. Inténtalo más tarde.');
        }
    }

    // --- Manejar el envío del formulario ---
    generatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // **CAMBIO IMPORTANTE: Borra las preguntas anteriores antes de generar nuevas**
        sessionStorage.removeItem('triviaQuestions');
        
        const params = new URLSearchParams();
        params.append('amount', document.getElementById('amount').value);
        
        const category = document.getElementById('category').value;
        if (category) params.append('category', category);
        
        const difficulty = document.getElementById('difficulty').value;
        if (difficulty) params.append('difficulty', difficulty);

        const type = document.getElementById('type').value;
        if (type) params.append('type', type);

        window.location.href = `../preguntas/preguntas.html?${params.toString()}`;
    });

    loadCategories();
});
document.addEventListener('DOMContentLoaded', async () => {
    // Guardia de ruta
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = '../base/index.html';
        return;
    }

    const loadingMessage = document.getElementById('loading-message');
    const container = document.getElementById('questions-list-container');
    const createNewTriviaLink = document.getElementById('create-new-trivia-link');

    // **CAMBIO IMPORTANTE: Lógica para borrar la sesión de preguntas**
    createNewTriviaLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Borramos solo las preguntas para empezar de nuevo
        sessionStorage.removeItem('triviaQuestions');
        window.location.href = '../principal/principal.html';
    });

    // **LÓGICA MEJORADA PARA CARGAR PREGUNTAS**
    const storedQuestions = JSON.parse(sessionStorage.getItem('triviaQuestions'));

    if (storedQuestions) {
        // Si ya hay preguntas en la sesión (ej. al volver de responder), simplemente muéstralas
        loadingMessage.style.display = 'none';
        displayQuestionsList(storedQuestions);
    } else {
        // Si no hay preguntas, entonces sí dependemos de la URL para generarlas por primera vez
        const params = new URLSearchParams(window.location.search);
        if (!params.has('amount')) {
            // Si no hay preguntas Y tampoco hay parámetros, es un error -> ir a la página principal
            window.location.href = '../principal/principal.html';
            return;
        }

        try {
            const response = await fetch(`https://opentdb.com/api.php?${params.toString()}`);
            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error('No se pudieron obtener las preguntas con esos criterios. Intenta con menos preguntas o criterios diferentes.');
            }
            
            sessionStorage.setItem('triviaQuestions', JSON.stringify(data.results));
            loadingMessage.style.display = 'none';
            displayQuestionsList(data.results);

        } catch (error) {
            loadingMessage.textContent = `Error: ${error.message}`;
        }
    }

    function displayQuestionsList(questions) {
        container.innerHTML = ''; // Limpiar
        questions.forEach((question, index) => {
            const item = document.createElement('a');
            item.href = `../responder/responder.html?q=${index}`;
            item.className = 'question-item';
            item.textContent = `Pregunta ${index + 1}: ${decode(question.category)}`;
            
            if (question.answered) {
                item.classList.add('answered');
                item.classList.add(question.isCorrect ? 'correct' : 'incorrect');
            }

            container.appendChild(item);
        });
    }
});

function decode(str) {
    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}
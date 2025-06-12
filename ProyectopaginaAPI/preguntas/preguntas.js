document.addEventListener('DOMContentLoaded', async () => {
    // Guardia de ruta
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = '../base/index.html';
        return;
    }

    const loadingMessage = document.getElementById('loading-message');
    const container = document.getElementById('questions-list-container');
    const createNewTriviaLink = document.getElementById('create-new-trivia-link');

    createNewTriviaLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('triviaQuestions');
        window.location.href = '../principal/principal.html';
    });

    const storedQuestions = JSON.parse(sessionStorage.getItem('triviaQuestions'));

    if (storedQuestions) {
        loadingMessage.style.display = 'none';
        displayQuestionsList(storedQuestions);
    } else {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('amount')) {
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

    // ===================================================================
    // NUEVO: Función para calcular y mostrar la puntuación
    // ===================================================================
    function updateScore(questions) {
        const correctAnswersSpan = document.getElementById('correct-answers');
        const totalQuestionsSpan = document.getElementById('total-questions');

        // Contamos las respuestas que han sido marcadas como correctas
        const correctCount = questions.filter(q => q.answered && q.isCorrect).length;
        const totalCount = questions.length;

        correctAnswersSpan.textContent = correctCount;
        totalQuestionsSpan.textContent = totalCount;
    }

    function displayQuestionsList(questions) {
        // --- NUEVO: Llamamos a la función para actualizar el marcador ---
        updateScore(questions);

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
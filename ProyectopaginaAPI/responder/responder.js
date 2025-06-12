document.addEventListener('DOMContentLoaded', () => {
    // Guardia de ruta y carga de datos
    if (!sessionStorage.getItem('loggedInUser')) {
        // RUTA CORREGIDA: Salir de 'responder' (../) y entrar a 'base'
        window.location.href = '../base/index.html';
        return;
    }
    const allQuestions = JSON.parse(sessionStorage.getItem('triviaQuestions'));
    const params = new URLSearchParams(window.location.search);
    const questionIndex = parseInt(params.get('q'));

    if (allQuestions === null || isNaN(questionIndex)) {
        // RUTA CORREGIDA: Salir de 'responder' (../) y entrar a 'principal'
        window.location.href = '../principal/principal.html';
        return;
    }

    const question = allQuestions[questionIndex];

    const categoryEl = document.getElementById('category');
    const questionTextEl = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const backBtn = document.getElementById('back-to-list-btn');

    categoryEl.textContent = decode(question.category);
    questionTextEl.textContent = decode(question.question);

    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);

    answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.innerHTML = decode(answer);
        button.addEventListener('click', () => handleAnswer(button, answer));
        answersContainer.appendChild(button);
    });

    function handleAnswer(button, selectedAnswer) {
        Array.from(answersContainer.children).forEach(btn => btn.disabled = true);

        const isCorrect = selectedAnswer === question.correct_answer;
        
        allQuestions[questionIndex].answered = true;
        allQuestions[questionIndex].isCorrect = isCorrect;
        sessionStorage.setItem('triviaQuestions', JSON.stringify(allQuestions));

        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        feedbackContainer.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto.';
        feedbackContainer.className = isCorrect ? 'correct' : 'incorrect';

        if (!isCorrect) {
            Array.from(answersContainer.children).forEach(btn => {
                if (btn.innerHTML === decode(question.correct_answer)) {
                    btn.classList.add('correct');
                }
            });
        }
        
        backBtn.style.display = 'block';
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function decode(str) {
    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}
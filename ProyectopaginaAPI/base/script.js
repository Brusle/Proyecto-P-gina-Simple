document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los formularios y enlaces
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // --- Lógica para cambiar entre formularios ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // --- Lógica de Registro ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!username || !email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('El correo electrónico ya está registrado.');
        } else {
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            registerForm.reset();
            showLoginLink.click();
        }
    });

    // --- Lógica de Login ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            // RUTA CORREGIDA: Salir de 'base' (../) y entrar a 'principal'
            window.location.href = '../principal/principal.html';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    });
});
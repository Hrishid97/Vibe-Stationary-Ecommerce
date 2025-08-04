document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const msg = document.getElementById('form-message');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const data = {
                username: registerForm.querySelector('[name="username"]')?.value.trim() || '',
                email: registerForm.querySelector('[name="email"]')?.value.trim() || '',
                password: registerForm.querySelector('[name="password"]')?.value || '',
                confirmPassword: registerForm.querySelector('[name="confirm_password"]')?.value || ''
            };

            // Validate fields
            if (!data.username || !data.email || !data.password || !data.confirmPassword) {
                showMessage('Please fill in all fields', true);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Please enter a valid email address', true);
                return;
            }

            // Validate password match
            if (data.password !== data.confirmPassword) {
                showMessage('Passwords do not match', true);
                return;
            }

            // Validate password strength (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(data.password)) {
                showMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number', true);
                return;
            }

            // Check if email exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === data.email)) {
                showMessage('Email already registered', true);
                return;
            }

            // Check if username exists
            if (users.some(u => u.username === data.username)) {
                showMessage('Username already taken', true);
                return;
            }

            // Save user
            users.push({
                username: data.username,
                email: data.email,
                password: data.password
            });
            localStorage.setItem('users', JSON.stringify(users));

            // Show success
            showMessage('Registration successful! Redirecting to login...', false);
            registerForm.reset();

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Helper function to show messages
    function showMessage(text, isError = false) {
        if (!msg) return;
        
        msg.textContent = text;
        msg.style.color = isError ? '#d32f2f' : '#388e3c';
        msg.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
        msg.style.display = 'block';
        msg.style.padding = '10px';
        msg.style.marginTop = '10px';
        msg.style.borderRadius = '4px';
    }
});

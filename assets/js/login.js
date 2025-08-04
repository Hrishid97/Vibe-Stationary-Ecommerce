document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const msg = document.getElementById('form-message');

    if (loginForm) {
        // Initialize message styling
        if (msg) {
            msg.style.display = 'none';
            msg.style.marginTop = '10px';
            msg.style.padding = '10px';
            msg.style.borderRadius = '4px';
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const username = loginForm.username.value.trim();
            const password = loginForm.password.value;

            // Validate fields
            if (!username || !password) {
                showMessage('Please fill in all fields.', true);
                return;
            }

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === password
            );

            if (!user) {
                showMessage('Invalid username/email or password.', true);
                return;
            }

            // Login successful
            localStorage.setItem('loggedInUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));

            showMessage('Login successful! Redirecting...', false);
            loginForm.reset();

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
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
    }
});

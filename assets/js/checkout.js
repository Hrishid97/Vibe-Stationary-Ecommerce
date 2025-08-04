document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const msg = document.getElementById('form-message');

    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check if cart is empty
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Pre-fill email if user is logged in
    if (checkoutForm && loggedInUser.email) {
        const emailInput = checkoutForm.querySelector('[name="email"]');
        if (emailInput) {
            emailInput.value = loggedInUser.email;
        }
    }

    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const name = checkoutForm.querySelector('[name="name"]')?.value.trim();
            const email = checkoutForm.querySelector('[name="email"]')?.value.trim();
            const address = checkoutForm.querySelector('[name="address"]')?.value.trim();

            // Basic validation
            if (!name || !email || !address) {
                showMessage('Please fill in all fields', true);
                return;
            }

            // Create simple order
            const order = {
                id: 'ORD' + Date.now(),
                name,
                email,
                address,
                items: cart,
                date: new Date().toISOString()
            };

            // Save order
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            localStorage.removeItem('cart');

            // Show success message
            showMessage('Order placed successfully! Redirecting to homepage...', false);

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
        msg.style.padding = '10px';
        msg.style.marginTop = '10px';
        msg.style.borderRadius = '4px';
    }
});

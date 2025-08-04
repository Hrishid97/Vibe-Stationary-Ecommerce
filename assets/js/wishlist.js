// Get wishlist from localStorage
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to update the visual state of wishlist buttons
function updateWishlistButtonState(btn, productId) {
    if (wishlist.includes(productId)) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

// Function to add a product to wishlist
function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

// Function to remove a product from wishlist
function removeFromWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

// Function to render the wishlist page
function renderWishlist() {
    const list = document.getElementById('wishlist-list');
    if (!list) return;
    
    list.innerHTML = '';
    let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlistItems.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-wishlist-message';
        emptyMessage.innerHTML = `
            <h3>Your wishlist is empty</h3>
            <p>Add items to your wishlist by clicking the heart icon on products</p>
            <a href="index.html" class="btn">Continue Shopping</a>
        `;
        list.appendChild(emptyMessage);
        return;
    }

    // Convert wishlist array to object with quantity (like cart)
    let wishlistObj = {};
    wishlistItems.forEach(name => {
        wishlistObj[name] = 1; // Each item appears once in wishlist
    });

    Object.keys(wishlistObj).forEach(name => {
        let card = Array.from(document.querySelectorAll('.product-card')).find(card => {
            let productName = card.querySelector('.card-title a')?.textContent?.trim();
            if (!productName) productName = card.querySelector('.card-title')?.textContent?.trim();
            return productName === name;
        });

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.padding = '15px';
        li.style.margin = '10px 0';
        li.style.backgroundColor = '#fff';
        li.style.borderRadius = '8px';
        li.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

        // Product name
        const nameEl = document.createElement('span');
        nameEl.textContent = name;
        nameEl.style.flex = '1';
        li.appendChild(nameEl);

        // Price (if available)
        let priceValue = 'N/A';
        if (!card) {
            // Try to get price from product_list.html if available
            const allCards = Array.from(document.querySelectorAll('.product-card'));
            for (const c of allCards) {
                let productName = c.querySelector('.card-title a')?.textContent?.trim();
                if (!productName) productName = c.querySelector('.card-title')?.textContent?.trim();
                if (productName === name) {
                    const priceData = c.querySelector('.card-price');
                    priceValue = priceData?.getAttribute('value') || 'N/A';
                    break;
                }
            }
        } else {
            const priceData = card.querySelector('.card-price');
            priceValue = priceData?.getAttribute('value') || 'N/A';
        }

        const priceEl = document.createElement('span');
        priceEl.textContent = ' - Price: ' + priceValue;
        priceEl.style.marginLeft = '10px';
        li.appendChild(priceEl);

        // Add to Cart button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.style.marginLeft = '10px';
        addToCartBtn.className = 'btn-cart';
        addToCartBtn.onclick = function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!cart.includes(name)) {
                cart.push(name);
                localStorage.setItem('cart', JSON.stringify(cart));
                addToCartBtn.textContent = 'Added!';
                setTimeout(() => {
                    addToCartBtn.textContent = 'Add to Cart';
                }, 1000);
            }
        };
        li.appendChild(addToCartBtn);

        // Remove button (styled like cart's remove button)
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.style.background = 'none';
        removeBtn.style.color = '#d32f2f';
        removeBtn.style.boxShadow = 'none';
        removeBtn.style.border = 'none';
        removeBtn.innerHTML = '<ion-icon name="trash-outline" style="font-size:1.5em;vertical-align:middle;"></ion-icon>';
        removeBtn.onclick = function() {
            removeFromWishlist(name);
            renderWishlist();
        };
        li.appendChild(removeBtn);

        list.appendChild(li);
    });
}

// Initialize wishlist functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wishlist buttons on product pages
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.querySelector('.card-title')?.textContent?.trim() ||
                         card.querySelector('.card-title a')?.textContent?.trim();
        
        if (!productId) return;

        const wishlistBtn = card.querySelector('button.card-action-btn ion-icon[name="heart-outline"]')?.closest('button');
        if (wishlistBtn) {
            updateWishlistButtonState(wishlistBtn, productId);
            
            wishlistBtn.addEventListener('click', () => {
                if (wishlist.includes(productId)) {
                    removeFromWishlist(productId);
                } else {
                    addToWishlist(productId);
                }
                updateWishlistButtonState(wishlistBtn, productId);
            });
        }
    });

    // Render wishlist if we're on the wishlist page
    renderWishlist();
});

'use strict';



/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}



/**
 * header & go top btn active on page scroll
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 80) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});


// Wishlist and Cart Functionality
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateIconState(btn, arr, productId) {
  if (arr.includes(productId)) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}

function getProductId(card) {
  let productId = card.querySelector('.card-title a')?.textContent?.trim();
  if (!productId) {
    productId = card.querySelector('.card-title')?.textContent?.trim();
  }
  return productId;
}

function addToWishlist(productId) {
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
}

function addToCart(productId) {
  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = getProductId(card);
    if (!productId) return;

    // Find wishlist and cart buttons by icon name
    const wishlistBtn = Array.from(card.querySelectorAll('button.card-action-btn')).find(btn => btn.querySelector('ion-icon[name="heart-outline"]'));
    const cartBtn = Array.from(card.querySelectorAll('button.card-action-btn')).find(btn => btn.querySelector('ion-icon[name="cart-outline"]'));

    if (wishlistBtn) {
      updateIconState(wishlistBtn, wishlist, productId);
      wishlistBtn.addEventListener('click', () => {
        const idx = wishlist.indexOf(productId);
        if (idx === -1) {
          addToWishlist(productId);
        } else {
          wishlist.splice(idx, 1);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        updateIconState(wishlistBtn, wishlist, productId);
      });
    }

    if (cartBtn) {
      updateIconState(cartBtn, cart, productId);
      cartBtn.addEventListener('click', () => {
        const idx = cart.indexOf(productId);
        if (idx === -1) {
          addToCart(productId);
        } else {
          cart.splice(idx, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        updateIconState(cartBtn, cart, productId);
      });
    }
  });
});

// cart rendering function
// This function renders the cart items in the cart.html page
// It reads the cart from localStorage, creates list items for each product,
// and allows users to change quantities or remove items.
// It also tries to fetch product prices from the product cards on the page.
// If a product card is not found, it attempts to get the price from the product_list.html page if available.
// The function dynamically creates list items with product name, price, quantity controls,
// and buttons to remove the item or proceed to checkout.
// It also handles quantity changes and updates the cart in localStorage accordingly.
// The rendered cart items are displayed in a list with the product name, price, quantity input
function renderCart() {
  const list = document.getElementById('cart-list');
  if (!list) return;
  list.innerHTML = '';
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  // Convert cart array to object with quantity
  let cartObj = {};
  cartItems.forEach(name => {
    cartObj[name] = (cartObj[name] || 0) + 1;
  });
  Object.keys(cartObj).forEach(name => {
    let card = Array.from(document.querySelectorAll('.product-card')).find(card => {
      let productName = card.querySelector('.card-title a')?.textContent?.trim();
      if (!productName) productName = card.querySelector('.card-title')?.textContent?.trim();
      return productName === name;
    });
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    // Product name
    const nameEl = document.createElement('span');
    nameEl.textContent = name;
    li.appendChild(nameEl);
    // Price
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
    // Quantity controls
    const qtyLabel = document.createElement('span');
    qtyLabel.textContent = ' Qty: ';
    qtyLabel.style.marginLeft = '10px';
    li.appendChild(qtyLabel);
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = 1;
    qtyInput.value = cartObj[name];
    qtyInput.style.width = '50px';
    qtyInput.style.marginLeft = '4px';
    qtyInput.onchange = function() {
      let newQty = parseInt(qtyInput.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      // Update cart in localStorage
      cartItems = cartItems.filter(item => item !== name);
      for (let i = 0; i < newQty; i++) cartItems.push(name);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
    };
    li.appendChild(qtyInput);
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.style.marginLeft = '0';
    removeBtn.style.background = 'none'; // Remove background
    removeBtn.style.color = '#d32f2f'; // Keep icon color red
    removeBtn.style.boxShadow = 'none'; // Remove shadow
    removeBtn.style.border = 'none';
    removeBtn.innerHTML = '<ion-icon name="trash-outline" style="font-size:1.5em;vertical-align:middle;"></ion-icon>';
    removeBtn.onclick = function() {
      cartItems = cartItems.filter(item => item !== name);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
    };
    // Buy button
    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Buy';
    buyBtn.style.marginLeft = 'auto';
    buyBtn.className = 'btn-buy';
    buyBtn.onclick = function() {
      window.location.href = 'checkout.html';
    };
    // Align remove button just before buy button
    li.appendChild(removeBtn);
    li.appendChild(buyBtn);
    list.appendChild(li);
  });
}
document.addEventListener('DOMContentLoaded', renderCart);

// Wishlist rendering function
function renderWishlist() {
  const list = document.getElementById('wishlist-list');
  if (!list) return;
  
  list.innerHTML = '';
  const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  wishlistItems.forEach(name => {
    // Try to find the product card to get additional details
    let card = Array.from(document.querySelectorAll('.product-card')).find(card => {
      let productName = card.querySelector('.card-title a')?.textContent?.trim();
      if (!productName) productName = card.querySelector('.card-title')?.textContent?.trim();
      return productName === name;
    });

    const li = document.createElement('li');
    li.className = 'product-item';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
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

    // Price if available
    if (card) {
      const priceData = card.querySelector('.card-price');
      if (priceData) {
        const priceEl = document.createElement('span');
        priceEl.textContent = priceData.getAttribute('value') || 'N/A';
        priceEl.style.marginLeft = '20px';
        priceEl.style.marginRight = '20px';
        li.appendChild(priceEl);
      }
    }

    // Add to Cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.className = 'btn-cart';
    addToCartBtn.style.marginRight = '10px';
    addToCartBtn.onclick = function() {
      addToCart(name);
      // Optional: Show feedback
      addToCartBtn.textContent = 'Added!';
      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
      }, 1000);
    };
    li.appendChild(addToCartBtn);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.innerHTML = '<ion-icon name="trash-outline" style="font-size:1.5em;vertical-align:middle;"></ion-icon>';
    removeBtn.style.background = 'none';
    removeBtn.style.border = 'none';
    removeBtn.style.color = '#d32f2f';
    removeBtn.style.cursor = 'pointer';
    removeBtn.onclick = function() {
      const idx = wishlistItems.indexOf(name);
      if (idx !== -1) {
        wishlistItems.splice(idx, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        renderWishlist(); // Re-render the list
      }
    };
    li.appendChild(removeBtn);

    list.appendChild(li);
  });

  // Show empty state if no items
  if (wishlistItems.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Your wishlist is empty';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '20px';
    list.appendChild(emptyMsg);
  }
}

document.addEventListener('DOMContentLoaded', renderWishlist);



// =====================
// Login & Register Logic
// =====================
document.addEventListener('DOMContentLoaded', function() {
  function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.style.color = isError ? '#d32f2f' : '#388e3c';
    element.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
    element.style.display = 'block';
    element.style.padding = '10px';
    element.style.marginTop = '10px';
    element.style.borderRadius = '4px';
  }

  // Find register form - try both ID and class
  const registerForm = document.querySelector('form#register-form.login-form');
  console.log('Looking for register form...');
  console.log('By ID:', document.querySelector('#register-form'));
  console.log('By class:', document.querySelector('.login-form'));
  if (registerForm) {
    console.log('Register form found');
    
    // Get the message element that's already in the form
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) {
        console.error('Message div not found');
        return;
    }
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted');

      // Get form values directly
      const data = {
        username: registerForm.querySelector('[name="username"]')?.value || '',
        email: registerForm.querySelector('[name="email"]')?.value || '',
        password: registerForm.querySelector('[name="password"]')?.value || '',
        confirmPassword: registerForm.querySelector('[name="confirm_password"]')?.value || ''
      };
      console.log('Form data:', data);
      
      // Get message element
      const msg = messageDiv; // Using the already found message element
      msg.style.display = 'block';
      msg.style.padding = '10px';
      msg.style.margin = '10px 0';
      msg.style.borderRadius = '4px';
      
      // Validate
      if (!data.username || !data.email || !data.password || !data.confirmPassword) {
        msg.textContent = 'Please fill in all fields';
        msg.style.color = '#d32f2f';
        msg.style.backgroundColor = '#ffebee';
        return;
      }
      
      if (data.password !== data.confirmPassword) {
        msg.textContent = 'Passwords do not match';
        msg.style.color = '#d32f2f';
        msg.style.backgroundColor = '#ffebee';
        return;
      }
      
      // Check if email exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.some(u => u.email === data.email)) {
        msg.textContent = 'Email already registered';
        msg.style.color = '#d32f2f';
        msg.style.backgroundColor = '#ffebee';
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
      msg.textContent = 'Registration successful! Redirecting to login...';
      msg.style.color = '#388e3c';
      msg.style.backgroundColor = '#e8f5e9';
      
      // Redirect
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    });
  } else {
    console.log('Register form not found');
  }
  
  // Login Logic
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const msg = document.getElementById('form-message');
    if (msg) {
      msg.style.display = 'none';
      msg.style.marginTop = '10px';
      msg.style.padding = '10px';
      msg.style.borderRadius = '4px';
    }
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value;
      if (!username || !password) {
        msg.textContent = 'Please fill in all fields.';
        msg.style.color = '#d32f2f';
        msg.style.display = 'block';
        return;
      }
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
      if (!user) {
        msg.textContent = 'Invalid username/email or password.';
        msg.style.color = '#d32f2f';
        msg.style.display = 'block';
        return;
      }
      localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, email: user.email }));
      msg.textContent = 'Login successful! Redirecting...';
      msg.style.color = '#388e3c';
      msg.style.backgroundColor = '#e8f5e9';
      msg.style.display = 'block';
      loginForm.reset();
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    });
  }
});

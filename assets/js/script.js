'use strict';



/* navbar toggle*/

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



// cart rendering function

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
    removeBtn.style.color = '#eb5050ff'; // Keep icon color red
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
    removeBtn.style.color = '#f55959ff';
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




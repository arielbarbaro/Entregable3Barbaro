let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('view-cart').textContent = `Ver Carrito (${cartCount})`;
}


function addToCart(event) {
    const productId = event.target.getAttribute('data-id');
    const quantityInput = document.querySelector(`.quantity[data-id="${productId}"]`);
    const quantity = parseInt(quantityInput.value);
    
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        
        productExists.quantity += quantity;
    } else {
        
        cart.push({ id: productId, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}


function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; 
    if (cart.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    let total = 0;
    let productsProcessed = 0;

    
    cart.forEach(item => {
        fetch('data/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    total += product.price * item.quantity;
                    const cartItem = document.createElement('div');
                    cartItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="cart-item-thumbnail" />
                        <p>${product.name} - ${product.price} € x ${item.quantity}</p>
                        <p>Subtotal: ${(product.price * item.quantity).toFixed(2)} €</p>
                        <button data-id="${product.id}" class="remove">Eliminar</button>
                    `;
                    cartList.appendChild(cartItem);
                }

                productsProcessed++;

                
                if (productsProcessed === cart.length) {
                    const totalDiv = document.createElement('div');
                    totalDiv.innerHTML = `<strong>Total: ${total.toFixed(2)} €</strong>`;
                    cartList.appendChild(totalDiv);

                    const buyButton = document.createElement('button');
                    buyButton.textContent = 'Comprar';
                    buyButton.addEventListener('click', completePurchase);
                    cartList.appendChild(buyButton);

                    
                    const removeButtons = document.querySelectorAll('.remove');
                    removeButtons.forEach(button => {
                        button.addEventListener('click', removeFromCart);
                    });
                }
            });
    });
}


function removeFromCart(event) {
    const productId = event.target.dataset.id;
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart(); 
}


function completePurchase() {
    alert('Gracias por tu compra!');
    cart = []; 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart(); }
document.addEventListener('DOMContentLoaded', updateCartCount);

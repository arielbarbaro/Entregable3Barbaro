let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar la cantidad de productos en el carrito
function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('view-cart').textContent = `Ver Carrito (${cartCount})`;
}

// Agregar producto al carrito con cantidad
function addToCart(event) {
    const productId = event.target.getAttribute('data-id');
    const quantityInput = document.querySelector(`.quantity[data-id="${productId}"]`);
    const quantity = parseInt(quantityInput.value);
    
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        // Si el producto ya está en el carrito, sumar la cantidad
        productExists.quantity += quantity;
    } else {
        // Si no está en el carrito, agregarlo con la cantidad seleccionada
        cart.push({ id: productId, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Mostrar el contenido del carrito con miniaturas
function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Limpiar el carrito antes de mostrarlo

    if (cart.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    let total = 0;
    let productsProcessed = 0;

    // Cargar productos del carrito
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

                // Mostrar total y botón de compra cuando todos los productos estén cargados
                if (productsProcessed === cart.length) {
                    const totalDiv = document.createElement('div');
                    totalDiv.innerHTML = `<strong>Total: ${total.toFixed(2)} €</strong>`;
                    cartList.appendChild(totalDiv);

                    const buyButton = document.createElement('button');
                    buyButton.textContent = 'Comprar';
                    buyButton.addEventListener('click', completePurchase);
                    cartList.appendChild(buyButton);

                    // Añadir eventos para eliminar productos
                    const removeButtons = document.querySelectorAll('.remove');
                    removeButtons.forEach(button => {
                        button.addEventListener('click', removeFromCart);
                    });
                }
            });
    });
}

// Eliminar producto del carrito
function removeFromCart(event) {
    const productId = event.target.dataset.id;
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart(); // Actualizar la visualización del carrito
}

// Completar la compra
function completePurchase() {
    alert('Gracias por tu compra!');
    cart = []; // Vaciar el carrito
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart(); // Actualizar la visualización del carrito
}

// Actualizar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', updateCartCount);

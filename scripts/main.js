document.addEventListener('DOMContentLoaded', () => {

    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(products => {
            const productList = document.getElementById('product-list');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" />
                    <h3>${product.name}</h3>
                    <p>${product.price} €</p>
                    <input type="number" value="1" min="1" class="quantity" data-id="${product.id}" />
                    <button data-id="${product.id}">Agregar al Carrito</button>
                `;
                productList.appendChild(productDiv);
            });

            
            const buttons = document.querySelectorAll('.product button');
            buttons.forEach(button => {
                button.addEventListener('click', addToCart);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    
    document.getElementById('view-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'block';
        displayCart(); // Mostrar el contenido del carrito
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });
});

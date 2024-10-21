document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    fetchProducts();
});


let productList = [];


function initializeCart() {
    const cartCountElement = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}


async function fetchProducts() {
    try {
        const response = await fetch('/data/products.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const products = await response.json();
        productList = products;
        renderProducts(products);
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}


function renderProducts(products) {
    const container = document.getElementById('shop-products');
    container.innerHTML = ''; 
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('item-card');

        productCard.innerHTML = `
            <img class="card-img" src="${product.image}" alt="${product.name}">
            <h4 class="card-title">${product.name}</h4>
            <p class="card-price">$${product.price}</p>
            <button class="add-to-cart">Agregar al carrito</button>
        `;
        container.appendChild(productCard);

        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => addToCart(product));
    });
}


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} se agregó al carrito.`);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalCount;
    localStorage.setItem('cartCount', totalCount);
}


function showToast(message) {
    Toastify({
        text: message,
        duration: 1000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
    }).showToast();
}

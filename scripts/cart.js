document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartSummary();
    setupDeliveryOptionChange();
    loadDeliveryOption();
    setupCheckoutButton();
});


function setupCheckoutButton() {
    const checkoutButton = document.getElementById('cart-checkout');
    checkoutButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) { 
            window.location.href = 'checkout.html';
        } else {
            Toastify({
                text: "El carrito está vacío, agrega productos antes de finalizar la compra.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#ff5f5f",
                  },
            }).showToast();
        }
    });
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-message">El carrito está vacío <i class="bi bi-cart-x"></i></p>
                                        <a  class="empty-cart-redirect"href="shop.html"> Volver a la tienda <i class="bi bi-arrow-90deg-left"></i></a>    `;
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-description">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-ingredients">${item.ingredients}</p>
                <span class="item-price">$${item.price}</span>
            </div>
            <button>
                <span class="decrease-quantity" data-index="${index}">-</span>
                <span class="item-quantity">${item.quantity}</span>
                <span class="increase-quantity" data-index="${index}">+</span>
            </button>
            <i class="bi bi-trash" data-index="${index}"></i>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    setupCartEventListeners();
}

function setupCartEventListeners() {
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const deleteButtons = document.querySelectorAll('.bi-trash');

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            updateQuantity(index, 1);
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            updateQuantity(index, -1);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            deleteItemFromCart(index);
        });
    });
}


function deleteItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deletedItem = cart.splice(index, 1)[0]; 
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartSummary();

    Toastify({
        text: `Eliminaste ${deletedItem.name} del carrito`,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        style: {
            background: "#ff5f5f",
          },
    }).showToast();
}


function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;

    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartSummary(); 
}


function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.querySelector('.resume-subtotal span');
    const totalElement = document.querySelector('.resume-total span');
    const itemCountElement = document.querySelector('.cart-resume h3 span');

    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemCount += item.quantity;
    });


    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + calculateDeliveryCost()).toFixed(2)}`;
    itemCountElement.textContent = `(${itemCount})`;
}

function setupDeliveryOptionChange() {
    const deliveryOptionSelect = document.getElementById('deliveryOption');
    deliveryOptionSelect.addEventListener('change', () => {
        updateDeliveryOption();
        updateCartSummary();
    });
}

function updateDeliveryOption() {
    const deliveryOptionSelect = document.getElementById('deliveryOption');
    const selectedOption = deliveryOptionSelect.value;
    localStorage.setItem('deliveryOption', selectedOption);

    const deliveryCostElement = document.querySelector('.resume-delivery span');
    const deliveryCostText = document.querySelector('.resume-delivery h5');
    if (selectedOption === 'pickup') {
        deliveryCostText.textContent = 'PickUp';
        deliveryCostElement.textContent = 'Gratis';
    } else if (selectedOption === 'delivery') {
        deliveryCostText.textContent = 'Delivery';
        deliveryCostElement.textContent = '$180';
    }
}


function calculateDeliveryCost() {
    const deliveryOption = localStorage.getItem('deliveryOption');
    return deliveryOption === 'delivery' ? 180 : 0;
}


function initializeCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalCount = 0;

    cart.forEach(item => {
        totalCount += item.quantity;
    });

    cartCountElement.textContent = totalCount;
}

function loadDeliveryOption() {
    const savedOption = localStorage.getItem('deliveryOption');
    const deliveryOptionSelect = document.getElementById('deliveryOption');
    if (savedOption) {
        deliveryOptionSelect.value = savedOption;
        updateDeliveryOption();
    }
}

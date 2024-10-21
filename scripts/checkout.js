document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutItems();
    updateCheckoutSummary();
    setupFormSubmission();
    updateDeliveryInfo();


});

function renderCheckoutItems() {
    const checkoutItemsContainer = document.querySelector('.checkout-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    checkoutItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="checkout-item-description">
                <h3>${item.name}</h3>
                <p>Cant: <span>${item.quantity}</span></p>
            </div>
            <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItemsContainer.appendChild(itemElement);
    });
}

function updateCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.querySelector('.checkout-products span');
    const deliveryElement = document.querySelector('.checkout-delivery span');
    const ivaElement = document.querySelector('.checkout-iva span');
    const totalElement = document.querySelector('.checkout-total span');

    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliveryCost = getDeliveryCost();
    let iva = (subtotal + deliveryCost) * 0.22;
    let total = subtotal + deliveryCost + iva;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    deliveryElement.textContent = deliveryCost > 0 ? `$${deliveryCost.toFixed(2)}` : 'Gratis';
    ivaElement.textContent = `$${iva.toFixed(2)}`;

    totalElement.textContent = `$${total.toFixed(2)}`;
}

function setupFormSubmission() {
    const checkoutForm = document.querySelector('.checkout form');
    const checkoutBtn = document.querySelector('#checkout-btn');

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar el envío del formulario

        // Validar formulario
        if (!validateForm()) {
            showToast('Por favor, complete todos los campos obligatorios.', 'error');
            return;
        }

        saveOrderDetails();

        showToast('Pedido completado exitosamente.', 'success');
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 2000);
    });
}

function validateForm() {
    const clientName = document.querySelector('#client-name').value.trim();
    const clientEmail = document.querySelector('#client-email').value.trim();
    const clientPhone = document.querySelector('#client-phone').value.trim();
    const deliveryDate = document.querySelector('#delivery-date').value.trim();
    const deliveryAddress = document.querySelector('#delivery-address').value.trim();

    return clientName && clientEmail && clientPhone && deliveryDate && deliveryAddress;
}

function saveOrderDetails() {
    const clientName = document.querySelector('#client-name').value.trim();
    const clientEmail = document.querySelector('#client-email').value.trim();
    const clientPhone = document.querySelector('#client-phone').value.trim();
    const deliveryDate = document.querySelector('#delivery-date').value.trim();
    const deliveryAddress = document.querySelector('#delivery-address').value.trim();
    const deliveryNotes = document.querySelector('#delivery-notes').value.trim();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = getDeliveryCost();
    const iva = (subtotal + deliveryCost) * 0.22;
    const total = subtotal + deliveryCost + iva;

    const orderDetails = {
        clientName,
        clientEmail,
        clientPhone,
        deliveryDate,
        deliveryAddress,
        deliveryNotes,
        subtotal,
        deliveryCost,
        iva,
        total
    };

    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
}

function updateDeliveryInfo() {
    const deliveryOption = localStorage.getItem("deliveryOption") || "pickup";
    const deliverySpan = document.querySelector(".checkout-delivery span");
    const deliveryLabel = document.querySelector(".checkout-delivery h5");
    const deliveryAddressInput = document.getElementById("delivery-address");


    if (deliveryOption === "pickup") {
        deliveryLabel.textContent = "PickUp";
        deliverySpan.textContent = "Gratis";
        deliveryAddressInput.disabled = true;
        deliveryAddressInput.value = "Dirección PickUp - Zum Felde 2160b"
    } else if (deliveryOption === "delivery") {
        deliveryLabel.textContent = "Delivery";
        deliverySpan.textContent = "$180";
        deliveryAddressInput.disabled = false;
    }
    updateCheckoutSummary();
}

function getDeliveryCost() {
    const deliveryOption = localStorage.getItem("deliveryOption") || "pickup";
    return deliveryOption === "delivery" ? 180 : 0;
}

function showToast(message, type) {
    Toastify({
        text: message,
        duration: 1000,
        gravity: 'top',
        position: 'right',
        backgroundColor: type === 'success' ? 'green' : 'red',
        stopOnFocus: true,
    }).showToast();
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); 
    actualizarAnioActual();
});

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalCount;
    localStorage.setItem('cartCount', totalCount);
}

function actualizarAnioActual() {
    const currentYearElement = document.getElementById('current-year');
    const currentYear = new Date().getFullYear(); 
    currentYearElement.textContent = currentYear;
}



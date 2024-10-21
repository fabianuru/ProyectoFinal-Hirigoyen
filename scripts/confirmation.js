document.addEventListener("DOMContentLoaded", () => {
    setupBackToHome();
});

function setupBackToHome() {
    const backToHomeLink = document.getElementById('back-to-home');
    backToHomeLink.addEventListener('click', (e) => {
        e.preventDefault();

        const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || {};
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const orders = {
            orderDetails,
            cart
        };

        localStorage.setItem('orders', JSON.stringify(orders));

        localStorage.removeItem('orderDetails');
        localStorage.removeItem('cart');

        window.location.href = '/index.html';
    });
}

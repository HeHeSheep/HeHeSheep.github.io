document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // 恢復購物車數據
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x `;
            const input = document.createElement('input');
            input.type = 'number';
            input.value = item.quantity;
            input.min = 1;
            input.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (isNaN(newQuantity) || newQuantity <= 0 || e.target.value.trim() === '') {
                    cart.splice(cart.indexOf(item), 1); // 移除該項目
                } else {
                    item.quantity = newQuantity;
                }
                localStorage.setItem('cart', JSON.stringify(cart)); // 保存更新後的購物車數據
                loadCart();
            });
            li.appendChild(input);
            cartItems.appendChild(li);
            total += item.price * item.quantity;
        });
        totalPrice.textContent = `$${total.toFixed(2)}`;
    }

    // 更新購物車數據
    function updateCart() {
        const cart = [];
        cartItems.querySelectorAll('li').forEach(li => {
            const [name, priceQuantity] = li.textContent.split(' - $');
            const [price, quantity] = priceQuantity.split(' x ');
            cart.push({ name, price: parseFloat(price), quantity: parseInt(quantity) });
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // 添加到購物車
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            const quantity = parseInt(this.previousElementSibling.value);
            if (isNaN(quantity) || quantity <= 0) {
                alert('請輸入有效的數量');
                return;
            }
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.name === product);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name: product, price: price, quantity: quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        });
    });

    // 添加 checkout 按鈕的點擊事件監聽器
    const checkoutButton = document.getElementById('checkout');
    checkoutButton.addEventListener('click', function() {
        alert('Proceeding to checkout!');
    });

    // 初始化購物車
    window.addEventListener('pageshow', loadCart); // 確保在返回上一頁時重新加載購物車數據
    loadCart();
});
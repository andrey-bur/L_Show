// Данные корзины из localStorage
let cartItems = [];
let currentDeliveryCost = 500;
let discount = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
    updateProgress();
});

// Загрузка корзины
function loadCart() {
    const saved = localStorage.getItem('wineCart');
    if (saved) {
        cartItems = JSON.parse(saved);
        renderSummary();
    } else {
        // Если корзина пуста, перенаправляем на главную
        window.location.href = 'index.html';
    }
}

// Рендер итогов
function renderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const itemsCount = document.getElementById('itemsCount');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryCostEl = document.getElementById('deliveryCost');
    const totalEl = document.getElementById('totalAmount');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');

    // Товары
    summaryItems.innerHTML = cartItems.map(item => `
        <div class="summary-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-item-info">
                <div class="summary-item-title">${item.name}</div>
                <div class="summary-item-meta">${item.categoryName} • ${item.quantity} шт.</div>
                <div class="summary-item-price">${(item.price * item.quantity).toLocaleString()} ₽</div>
            </div>
        </div>
    `).join('');

    // Подсчеты
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + currentDeliveryCost - discount;

    itemsCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    subtotalEl.textContent = subtotal.toLocaleString() + ' ₽';
    deliveryCostEl.textContent = currentDeliveryCost === 0 ? 'Бесплатно' : currentDeliveryCost.toLocaleString() + ' ₽';
    
    if (discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = '-' + discount.toLocaleString() + ' ₽';
    } else {
        discountRow.style.display = 'none';
    }
    
    totalEl.textContent = total.toLocaleString() + ' ₽';
}

// Event Listeners
function setupEventListeners() {
    // Способы доставки
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.delivery-card').forEach(card => {
                card.classList.remove('active');
            });
            e.target.closest('.delivery-card').classList.add('active');

            const value = e.target.value;
            const addressForm = document.getElementById('addressForm');
            const pickupPoints = document.getElementById('pickupPoints');
            
            if (value === 'courier') {
                currentDeliveryCost = 500;
                addressForm.style.display = 'block';
                pickupPoints.style.display = 'none';
            } else if (value === 'pickup') {
                currentDeliveryCost = 0;
                addressForm.style.display = 'none';
                pickupPoints.style.display = 'block';
            } else if (value === 'express') {
                currentDeliveryCost = 1500;
                addressForm.style.display = 'block';
                pickupPoints.style.display = 'none';
            }
            
            renderSummary();
            updateProgress();
        });
    });

    // Способы оплаты
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-card').forEach(card => {
                card.classList.remove('active');
            });
            e.target.closest('.payment-card').classList.add('active');

            const cardForm = document.getElementById('cardForm');
            if (e.target.value === 'card') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
            updateProgress();
        });
    });

    // Промокод
    const promoToggle = document.getElementById('promoToggle');
    const promoForm = document.getElementById('promoForm');
    
    promoToggle.addEventListener('click', () => {
        promoToggle.classList.toggle('active');
        promoForm.style.display = promoForm.style.display === 'none' ? 'block' : 'none';
    });

    // Валидация карты
    setupCardValidation();

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
            if (value.length >= 6) formatted += '-' + value.substring(6, 8);
            if (value.length >= 8) formatted += '-' + value.substring(8, 10);
            e.target.value = formatted;
        }
    });
}

// Валидация карты
function setupCardValidation() {
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');

    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        e.target.value = formatted;
        
        const display = document.getElementById('cardNumberDisplay');
        display.textContent = formatted || '•••• •••• •••• ••••';
    });

    cardHolder.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
        document.getElementById('cardHolderDisplay').textContent = e.target.value || 'IVAN IVANOV';
    });

    cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        document.getElementById('cardExpiryDisplay').textContent = value || 'MM/YY';
    });

    cardCvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Применение промокода
function applyPromo() {
    const code = document.getElementById('promoCode').value.toUpperCase();
    const btn = document.querySelector('.apply-btn');
    
    if (code === 'WINE20') {
        discount = 5000;
        btn.textContent = 'Применено!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.textContent = 'Применить';
            btn.style.background = '';
        }, 2000);
    } else {
        btn.textContent = 'Неверный код';
        btn.style.background = '#f44336';
        setTimeout(() => {
            btn.textContent = 'Применить';
            btn.style.background = '';
        }, 2000);
    }
    renderSummary();
}

// Обновление прогресса
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');
    
    let progress = 33;
    
    const contactFilled = document.getElementById('firstName').value && 
                         document.getElementById('phone').value;
    const deliverySelected = document.querySelector('input[name="delivery"]:checked');
    const paymentSelected = document.querySelector('input[name="payment"]:checked');

    if (contactFilled) progress = 33;
    if (deliverySelected) progress = 66;
    if (paymentSelected) progress = 100;

    progressFill.style.width = progress + '%';

    steps.forEach((step, index) => {
        if ((index + 1) * 33 <= progress) {
            step.classList.add('active');
            if ((index + 1) * 33 < progress) {
                step.classList.add('completed');
            }
        }
    });
}

// Отправка заказа
function submitOrder() {
    const btn = document.getElementById('submitOrder');
    const originalText = btn.innerHTML;
    
    // Валидация
    const required = ['firstName', 'lastName', 'phone'];
    let valid = true;
    
    required.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value) {
            el.style.borderColor = '#f44336';
            valid = false;
        } else {
            el.style.borderColor = '';
        }
    });

    if (!valid) {
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Имитация отправки
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Оформление...';
    
    setTimeout(() => {
        // Генерация номера заказа
        const orderNum = '#' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('orderNumber').textContent = orderNum;
        
        // Очистка корзины
        localStorage.removeItem('wineCart');
        
        // Показ модалки
        document.getElementById('successModal').classList.add('active');
        
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 2000);
}

// Закрытие модалки
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('successModal')) {
        e.target.classList.remove('active');
    }
});
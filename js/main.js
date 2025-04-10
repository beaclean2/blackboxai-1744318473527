// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    toast.textContent = 'Item added to cart!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length.toString();
    }

    // Update cart items if we're on the order page
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cartItems && emptyCart) {
        if (cart.length === 0) {
            emptyCart.classList.remove('hidden');
            cartItems.classList.add('hidden');
        } else {
            emptyCart.classList.add('hidden');
            cartItems.classList.remove('hidden');
            
            // Clear existing items
            cartItems.innerHTML = '';
            
            // Add each cart item
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item border-b border-gray-200 py-4';
                itemElement.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                            <div class="ml-4">
                                <h3 class="text-lg font-bold">${item.name}</h3>
                                <p class="text-gray-600">Classic size</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="flex items-center mr-6">
                                <button class="quantity-btn bg-gray-200 px-3 py-1 rounded-l" onclick="updateQuantity(${index}, -1)">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="w-12 text-center border-y border-gray-200 py-1" onchange="updateQuantity(${index}, this.value - ${item.quantity})">
                                <button class="quantity-btn bg-gray-200 px-3 py-1 rounded-r" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <span class="text-xl font-bold text-red-600 mr-6">${item.price}</span>
                            <button class="text-gray-400 hover:text-red-600" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            // Update total price
            updateTotal();
        }
    }
}

function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateTotal() {
    const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + deliveryFee + tax;

    // Update summary section if it exists
    const summarySection = document.querySelector('.order-summary');
    if (summarySection) {
        summarySection.innerHTML = `
            <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-bold">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Delivery Fee</span>
                <span class="font-bold">$${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-bold">$${tax.toFixed(2)}</span>
            </div>
            <div class="border-t border-gray-200 pt-4 mt-4">
                <div class="flex justify-between">
                    <span class="text-lg font-bold">Total</span>
                    <span class="text-lg font-bold text-red-600">$${total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.querySelector('.md\\:flex.space-x-6');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Add to Cart Button Functionality
document.querySelectorAll('button').forEach(button => {
    if (button.textContent.trim() === 'Add to Cart') {
        button.addEventListener('click', function(e) {
            const card = e.target.closest('.bg-white.rounded-lg');
            if (card) {
                const name = card.querySelector('h3').textContent;
                const price = card.querySelector('.text-xl.font-bold.text-red-600').textContent;
                
                addToCart({
                    name,
                    price,
                    quantity: 1
                });

                // Show success message
                alert('Added to cart!');
            }
        });
    }
});

// Form Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

// Error Handling
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = element.parentNode.querySelector('.text-red-500');
    if (existingError) {
        existingError.remove();
    }
    
    element.parentNode.appendChild(errorDiv);
    element.classList.add('border-red-500');
}

function clearError(element) {
    const errorDiv = element.parentNode.querySelector('.text-red-500');
    if (errorDiv) {
        errorDiv.remove();
    }
    element.classList.remove('border-red-500');
}

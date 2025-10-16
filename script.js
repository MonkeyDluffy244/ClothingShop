// Mock Data
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        price: 29.99,
        originalPrice: 39.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        category: "men",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Gray"],
        description: "Premium cotton t-shirt for everyday comfort. Perfect for casual wear and layering.",
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        category: "men",
        sizes: ["30x32", "32x32", "34x32"],
        colors: ["Blue", "Black"],
        description: "Comfortable slim fit jeans with stretch technology for all-day comfort.",
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Summer Floral Dress",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        category: "women",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Floral", "Blue", "Pink"],
        description: "Light and beautiful floral dress perfect for summer occasions.",
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Winter Jacket",
        price: 129.99,
        originalPrice: 159.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        category: "men",
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Green"],
        description: "Warm winter jacket with waterproof coating and insulated lining.",
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: "Casual Blouse",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1564257577817-d0e6f97dd03c?w=400",
        category: "women",
        sizes: ["XS", "S", "M"],
        colors: ["White", "Beige", "Blue"],
        description: "Elegant casual blouse suitable for office wear and casual outings.",
        inStock: true,
        featured: false
    },
    {
        id: 6,
        name: "Sports Shorts",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
        category: "unisex",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray", "Blue"],
        description: "Breathable sports shorts designed for active lifestyle and workouts.",
        inStock: true,
        featured: true
    },
    {
        id: 7,
        name: "Leather Jacket",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        category: "men",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Brown"],
        description: "Premium leather jacket with classic design and superior craftsmanship.",
        inStock: true,
        featured: true
    },
    {
        id: 8,
        name: "Evening Gown",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        category: "women",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Red", "Navy"],
        description: "Elegant evening gown for special occasions and formal events.",
        inStock: true,
        featured: false
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentPriceRange = [0, 200];
let currentSort = 'name';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    loadAllProducts();
    updateCartCount();
    updateCartDisplay();
    
    // Set up price slider
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    priceSlider.addEventListener('input', function() {
        priceValue.textContent = this.value;
        currentPriceRange = [0, parseInt(this.value)];
        filterAndSortProducts();
    });
});

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update active nav link
    if (pageId === 'home') {
        document.querySelector('.nav-link').classList.add('active');
    } else if (pageId === 'products') {
        document.querySelectorAll('.nav-link')[1].classList.add('active');
    }
    
    // Close cart if open
    document.getElementById('cart-overlay').classList.remove('active');
}

// Product Display Functions
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    const featuredProducts = products.filter(product => product.featured);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.originalPrice ? `<span class="discount-badge">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
                ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
                <button class="view-details-button" onclick="viewProductDetail(${product.id})">Quick View</button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-prices">
                    ${product.originalPrice ? `
                        <span class="current-price">$${product.price}</span>
                        <span class="original-price">$${product.originalPrice}</span>
                    ` : `
                        <span class="current-price">$${product.price}</span>
                    `}
                </div>
                <p class="product-category">${product.category}</p>
            </div>
        </div>
    `).join('');
}

function loadAllProducts() {
    filterAndSortProducts();
}

function filterAndSortProducts() {
    const productsGrid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    const productsCount = document.getElementById('products-count');
    
    let filteredProducts = products.filter(product => {
        const categoryMatch = currentFilter === 'all' || product.category === currentFilter;
        const priceMatch = product.price >= currentPriceRange[0] && product.price <= currentPriceRange[1];
        return categoryMatch && priceMatch;
    });
    
    // Sort products
    filteredProducts.sort((a, b) => {
        switch (currentSort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    // Update product count
    productsCount.textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
    } else {
        productsGrid.style.display = 'grid';
        noProducts.style.display = 'none';
        
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.originalPrice ? `<span class="discount-badge">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
                    ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
                    <button class="view-details-button" onclick="viewProductDetail(${product.id})">Quick View</button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-prices">
                        ${product.originalPrice ? `
                            <span class="current-price">$${product.price}</span>
                            <span class="original-price">$${product.originalPrice}</span>
                        ` : `
                            <span class="current-price">$${product.price}</span>
                        `}
                    </div>
                    <p class="product-category">${product.category}</p>
                </div>
            </div>
        `).join('');
    }
}

function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
    
    filterAndSortProducts();
}

function sortProducts() {
    const sortSelect = document.getElementById('sort-select');
    currentSort = sortSelect.value;
    filterAndSortProducts();
}

function viewProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const detailContent = document.getElementById('product-detail-content');
    detailContent.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}" class="detail-image">
        </div>
        <div class="product-detail-info">
            <h1 class="detail-title">${product.name}</h1>
            <div class="detail-prices">
                ${product.originalPrice ? `
                    <span class="detail-current-price">$${product.price}</span>
                    <span class="detail-original-price">$${product.originalPrice}</span>
                    <span class="detail-discount">Save $${(product.originalPrice - product.price).toFixed(2)}</span>
                ` : `
                    <span class="detail-current-price">$${product.price}</span>
                `}
            </div>
            <p class="detail-description">${product.description}</p>
            
            <div class="detail-option">
                <label class="option-label">Size:</label>
                <div class="option-buttons" id="size-buttons">
                    ${product.sizes.map(size => `
                        <button class="option-button" onclick="selectSize('${size}')">${size}</button>
                    `).join('')}
                </div>
            </div>

            <div class="detail-option">
                <label class="option-label">Color:</label>
                <div class="option-buttons" id="color-buttons">
                    ${product.colors.map(color => `
                        <button class="option-button" onclick="selectColor('${color}')">${color}</button>
                    `).join('')}
                </div>
            </div>

            <div class="detail-option">
                <label class="option-label">Quantity:</label>
                <div class="quantity-control">
                    <button class="quantity-button" onclick="changeQuantity(-1)">-</button>
                    <span class="quantity" id="product-quantity">1</span>
                    <button class="quantity-button" onclick="changeQuantity(1)">+</button>
                </div>
            </div>

            <button class="add-to-cart-button" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <div class="product-features">
                <div class="feature-item">
                    <strong>Free Shipping</strong> on orders over $100
                </div>
                <div class="feature-item">
                    <strong>Easy Returns</strong> within 30 days
                </div>
                <div class="feature-item">
                    <strong>Secure Payment</strong> guaranteed
                </div>
            </div>
        </div>
    `;
    
    // Reset selection state
    window.selectedSize = '';
    window.selectedColor = '';
    window.productQuantity = 1;
    
    showPage('product-detail');
}

function selectSize(size) {
    window.selectedSize = size;
    
    // Update button states
    document.querySelectorAll('#size-buttons .option-button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent === size) {
            button.classList.add('active');
        }
    });
}

function selectColor(color) {
    window.selectedColor = color;
    
    // Update button states
    document.querySelectorAll('#color-buttons .option-button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent === color) {
            button.classList.add('active');
        }
    });
}

function changeQuantity(change) {
    window.productQuantity = Math.max(1, (window.productQuantity || 1) + change);
    document.getElementById('product-quantity').textContent = window.productQuantity;
}

// Cart Management Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (!window.selectedSize || !window.selectedColor) {
        showNotification('Please select size and color');
        return;
    }
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: window.selectedSize,
        color: window.selectedColor,
        quantity: window.productQuantity || 1
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    showNotification('✓ Added to cart successfully!');
    
    // Close product detail and show cart
    setTimeout(() => {
        showPage('products');
        toggleCart();
    }, 1500);
}

function removeFromCart(productId, size, color) {
    cart = cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartItemQuantity(productId, size, color, change) {
    const itemIndex = cart.findIndex(item => 
        item.id === productId && item.size === size && item.color === color
    );
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = `(${cartCount})`;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button class="continue-shopping-button" onclick="toggleCart()">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-details">Size: ${item.size} | Color: ${item.color}</p>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-button" onclick="updateCartItemQuantity(${item.id}, '${item.size}', '${item.color}', -1)">-</button>
                        <span class="cart-quantity">${item.quantity}</span>
                        <button class="cart-quantity-button" onclick="updateCartItemQuantity(${item.id}, '${item.size}', '${item.color}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-remove-button" onclick="removeFromCart(${item.id}, '${item.size}', '${item.color}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartFooter.style.display = 'block';
    }
}

function toggleCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    cartOverlay.classList.toggle('active');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
                                           }

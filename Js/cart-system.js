// This code handles the display of products on the prebuilt PC page, the product detail page, and the cart system.
// Prebuilt PC products data
const products = [
    {
        id: 1,
        mainImage: "../Foto/budget-prebuilt-gaming-pc-white.png",
        thumbnails: [
            "../Foto/budget-white-thumbnail-1.png",
            "../Foto/thumbnail-benchmarks-RX6600.png",
        ],
        name: "Glacier 800",
        price: "€999.99",
        rating: 4.3,
        description: "This is our most budget friendly option, for a white gaming pc. With this budget black gaming pc you can comformbly play in 1080p with medium settings. Click on the other picktures to see our benchmarks.",
        specs: [
            {
                cpu: "AMD Ryzen 5 5500",
                gpu: "RX 6600 8 GB",
                ram: "16GB DDR4 RAM",
                storage: "1TB NVMe SSD",
                cooler: "120mm fan Air Cooler",
                psu: "650W Power Supply"
            }
        ]
    }, {
        id: 2,
        mainImage: "../Foto/budget-prebuilt-gaming-pc-black.png",
        thumbnails: [
            "../Foto/budget-black-thumbnail-1.png",
            "../Foto/budget-black-thumbnail-2.png",
            "../Foto/thumbnail-benchmarks-RX6600.png"
        ],
        name: "Shadow Bolt",
        price: "€899.99",
        rating: 4.1,
        description: "This is our most budget friendly option. With this budget black gaming pc you can comformbly play in 1080p with medium settings. Click on the other picktures to see our benchmarks.",
        specs: [
            {
                cpu: "AMD Ryzen 5 5500",
                gpu: "RX 6600 8 GB",
                ram: "16GB DDR4 RAM",
                storage: "1TB NVMe SSD",
                cooler: "Wraith Stealth Cooler",
                psu: "550W Power Supply"
            }
        ]
    }, {
        id: 3,
        mainImage: "../Foto/prebuild-pc-mr-white.jpg",
        thumbnails: [
            "../Foto/mid-range-white-thumbnail-1.jpg",
            "../Foto/mid-range-white-thumbnail-2.jpg",
            "../Foto/mid-range-white-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RX7700XT.png"
        ],
        name: "IceBreaker X14",
        price: "€1799.99",
        rating: 4.5,
        description: "This is our mid-range option, for a white gaming pc. With this mid-range white gaming pc you can comformbly play in 1440p with high settings. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 5 9600x",
                gpu: "AMD RX 7700 XT 12 GB",
                ram: "32GB DDR5 RAM",
                storage: "2TB NVMe SSD",
                cooler: "240mm AIO",
                psu: "750W Power Supply"
            }
        ]
    }, {
        id: 4,
        mainImage: "../Foto/prebuilt-pc-mr-black.jpg",
        thumbnails: [
            "../Foto/mid-range-black-thumbnail-1.jpg",
            "../Foto/mid-range-black-thumbnail-2.jpg",
            "../Foto/mid-range-black-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RX7700XT.png"
        ],
        name: "PhantomCore",
        price: "€1699.99",
        rating: 4.4,
        description: "This is our mid-range option, for a black gaming pc. With this mid-range black gaming pc you can comformbly play in 1440p with high settings. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 5 9600x",
                gpu: "AMD RX 7700 XT 12 GB",
                ram: "32GB DDR5 RAM",
                storage: "2TB NVMe SSD",
                cooler: "240mm AIO",
                psu: "750W Power Supply"
            }
        ]
    }, {
        id: 5,
        mainImage: "../Foto/high-end-prebuilt-gaming-pc-white.png",
        thumbnails: [
            "../Foto/high-end-white-thumbnail-1.jpg",
            "../Foto/high-end-white-thumbnail-2.jpg",
            "../Foto/high-end-white-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RTX5080.png"
        ],
        name: "FrostTitan C5",
        price: "€3699.99",
        rating: 4.8,
        description: "This is our high-end option, for a white gaming pc. With this high-end white gaming pc you can play 1440p in super high fps or 4k medium to high settings. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 7 7800X3D",
                gpu: "NVIDIA GeForce RTX 5080",
                ram: "64GB DDR5 RAM",
                storage: "2TB NVMe SSD",
                cooler: "360mm AIO",
                psu: "850W Power Supply"
            }
        ]
    }, {
        id: 6,
        mainImage: "../Foto/high-end-prebuilt-gaming-pc-black.jpg",
        thumbnails: [
            "../Foto/high-end-black-thumbnail-1.jpg",
            "../Foto/high-end-black-thumbnail-2.jpg",
            "../Foto/high-end-black-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RTX5080.png"
        ],
        name: "ShadowForce V2",
        price: "€3599.99",
        rating: 4.6,
        description: "This is our high-end option, for a black gaming pc. With this high-end black gaming pc you can play 1440p in super high fps or 4k medium to high settings. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 7 7800X3D",
                gpu: "NVIDIA GeForce RTX 5080",
                ram: "64GB DDR5 RAM",
                storage: "2TB NVMe SSD",
                cooler: "240mm AIO",
                psu: "850W Power Supply"
            }
        ]
    }, {
        id: 7,
        mainImage: "../Foto/ultra-high-end-prebuilt-gaming-pc-white.jpg",
        thumbnails: [
            "../Foto/ultra-high-end-white-thumbnail-1.jpg",
            "../Foto/ultra-high-end-white-thumbnail-2.jpg",
            "../Foto/ultra-high-end-white-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RTX5090.png"
        ],
        name: "Whiteout Ultra V3",
        price: "€5399.99",
        rating: 4.9,
        description: "This is our ultra high-end option, for a white gaming pc. This ultra-high-end pc is only for the pc enthousiast, it delivers very good performance in 4k ultra. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 7 9800X3D",
                gpu: "NVIDIA GeForce RTX 5090",
                ram: "96GB DDR5 RAM",
                storage: "4TB NVMe SSD",
                cooler: "360mm AIO",
                psu: "1000W Power Supply"
            }
        ]
    }, {
        id: 8,
        mainImage: "../Foto/ultra-high-end-prebuilt-gaming-pc-black.png",
        thumbnails: [
            "../Foto/ultra-high-end-black-thumbnail-1.jpg",
            "../Foto/ultra-high-end-black-thumbnail-2.jpg",
            "../Foto/ultra-high-end-black-thumbnail-3.jpg",
            "../Foto/thumbnail-benchmarks-RTX5090.png"
        ],
        name: "Nightfall Titan",
        price: "€5299.99",
        rating: 4.7,
        description: "This is our ultra high-end option, for a black gaming pc. This ultra-high-end pc is only for the pc enthousiast, it delivers very good performance in 4k ultra. Click on the other picktures to see different angles of the pc.",
        specs: [
            {
                cpu: "AMD Ryzen 7 9800X3D",
                gpu: "NVIDIA GeForce RTX 5090",
                ram: "96GB DDR5 RAM",
                storage: "4TB NVMe SSD",
                cooler: "Custom Water Loop",
                psu: "1000W Power Supply"
            }
        ]
    }
];

// Puts amount of stars relative to the rating
function getStarIcons(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += '<i class="fas fa-star"></i>';
        } else if (rating >= i - 0.5) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}
//price format
let EURO = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
});

// The whole cart system and product display system
// This code handles the display of products on the prebuilt PC page, the product detail page, and the cart system.
const productContainer = document.querySelector(".prebuilt-list");
const isProductDetailPage = window.location.pathname.includes("prebuilt-pc-detail.html");
const isCartPage = document.querySelector(".cart");

if (productContainer) {
    displayProducts();
} else if (isProductDetailPage) {
    displayProductDetail();
} else if (isCartPage) {
    displayCart();
}

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("prebuilt-pc-card");
        productCard.innerHTML = `
            <div class="prebuilt-pc-image">
                <img src="${product.mainImage}">
            </div>
            <h3 class="title">${product.name}</h3>
        `;
        productContainer.appendChild(productCard);

        const prebuiltPcImage = productCard.querySelector(".prebuilt-pc-image img");
        prebuiltPcImage.addEventListener("click", () => {
            sessionStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = "prebuilt-pc-detail.html";
        });
    });
}

function displayProductDetail() {
    const productData = JSON.parse(sessionStorage.getItem('selectedProduct'));

    const titleEL = document.querySelector(".title");
    const priceEL = document.querySelector(".price");
    const descriptionEL = document.querySelector(".description");
    const specsTitleEL = document.querySelector(".specs-title");
    const specsListEL = document.querySelector(".specs");
    const mainImageEL = document.querySelector(".main-img");
    const thumbnailsEL = document.querySelector(".thumbnail-list");
    const addToCartButton = document.querySelector(".buy-button");
    const ratingEL = document.querySelector(".rating");

    function updateProductDisplay(product) {
        if (!product) {
            console.error("Product data is not available.");
            return;
        }

        mainImageEL.innerHTML = `<img src="${product.mainImage}">`;

        thumbnailsEL.innerHTML = "";
        const allThumbnails = [product.mainImage, ...product.thumbnails];
        allThumbnails.forEach(thumbnail => {
            const thumbnailImg = document.createElement("img");
            thumbnailImg.src = thumbnail;

            thumbnailsEL.appendChild(thumbnailImg);

            thumbnailImg.addEventListener("click", () => {
                mainImageEL.innerHTML = `<img src="${thumbnail}">`;
            });
        });

        specsListEL.innerHTML = "";
        product.specs.forEach(spec => {
            const specItem = document.createElement("li");
            specItem.innerHTML = `
                <span>Cpu:</span> ${spec.cpu}<br>
                <span>Gpu:</span> ${spec.gpu}<br>
                <span>Ram:</span> ${spec.ram}<br>
                <span>Storage:</span> ${spec.storage}<br>
                <span>Cooler:</span> ${spec.cooler}<br>
                <span>Power Supply:</span> ${spec.psu}
            `;
            specsListEL.appendChild(specItem);
        });

        // Dynamische rating
        if (ratingEL) {
            ratingEL.innerHTML = `
                ${getStarIcons(product.rating)}
                <span>(${product.rating})</span>
            `;
        }
    }
    
    if (titleEL) titleEL.textContent = productData.name;
    if (priceEL) priceEL.textContent = productData.price;
    if (descriptionEL) descriptionEL.textContent = productData.description;

    updateProductDisplay(productData);

    if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {
            addToCart(productData);
        });
    }
}

function addToCart(product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.mainImage,
            quantity: 1
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge();
}

function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const cartItemContainer = document.querySelector(".cart-items");
    const subtotalEl = document.querySelector(".subtotal");
    const grandTotalEl = document.querySelector(".grand-total");

    cartItemContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemContainer.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = "€0.00";
        grandTotalEl.textContent = "€0.00";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace("€", "")) * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
        <div class="product">
            ${
                item.image === "wrench"
                ? `<i class="fa-solid fa-wrench"></i>`
                : `<img src="${item.image}">`
            }
            <div class="item-detail">
                <p class="item-detail-heading">${item.name}</p>
                ${
                    item.image === "wrench" && item.parts
                    ? `<ul class="custom-parts">
                        ${Object.entries(item.parts).map(([key, part]) => part ? `<li><span class="custom-part-key">${key.toUpperCase()}:</span> <span class="custom-part-value">${part.name}</span></li>` : '').join('')}
                    </ul>`
                    : ''
                }
            </div>
        </div>
        <span class="price">${item.price}</span>
        <div class="quantity">
            <input type="number" value="${item.quantity}" min="1" data-index="${index}">
        </div>
        <span class="total-price">€${itemTotal.toFixed(2)}</span>
        <button class="remove" data-index="${index}">
            <i class="fa fa-x"></i>
        </button>
        `;

        cartItemContainer.appendChild(cartItem);
    });

    subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    grandTotalEl.textContent = `€${subtotal.toFixed(2)}`;

    removeCartItem();
    updateCartQuantity();
}

function removeCartItem() {
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function() {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartQuantity() {
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", function() {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector(".cart-item-count");

    if (badge) {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.style.display = "block";
        } else {
            badge.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const popup = document.getElementById('checkout-popup');
    const popupClose = document.querySelector('.checkout-popup-close');
    const popupOk = document.querySelector('.checkout-popup-ok');

    if (checkoutBtn && popup) {
        checkoutBtn.addEventListener('click', function() {
            // Show popup
            popup.classList.add('active');
            // Empty the cart
            sessionStorage.removeItem('cart');
            displayCart();
            if (typeof updateCartBadge === "function") updateCartBadge();
        });
    }
    // Close popup on OK
    [popupClose, popupOk].forEach(btn => {
        if (btn) btn.addEventListener('click', function() {
            popup.classList.remove('active');
        });
    });
});

updateCartBadge();
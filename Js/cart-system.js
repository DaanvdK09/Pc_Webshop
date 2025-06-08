// Hier is Bram nog mee bezig, maar ik moet nog ffe bedenken hoe ik de specs erbij ga zetten
const products = [
    {
        id: 1,
        image: "../Foto/budget-prebuilt-gaming-pc-white.png",
        name: "Glacier 800",
        price: "€899.99",
        cpu: "AMD Ryzen 5 5500",
        gpu: "NVIDIA GeForce RTX 4060",
        ram: "16GB DDR4 RAM",
        storage: "1TB NVMe SSD",
        cooler: "120mm fan Air Cooler",
        psu: "650W Power Supply"
    }, {
        id: 2,
        image: "../Foto/budget-prebuilt-gaming-pc-black.png",
        name: "BlackBeast Lite",
        price: "€799.99",
        cpu: "AMD Ryzen 5 5500",
        gpu: "NVIDIA GeForce RTX 4060",
        ram: "16GB DDR4 RAM",
        storage: "1TB NVMe SSD",
        cooler: "Stock AMD cooler",
        psu: "650W Power Supply"
    }, {
        id: 3,
        image: "../Foto/prebuild-pc-mr-white.jpg",
        name: "IceBreaker X14",
        price: "€1399.99",
        cpu: "AMD Ryzen 5 9600x",
        gpu: "AMD RX 7700 XT 12 GB",
        ram: "32GB DDR5 RAM",
        storage: "2TB NVMe SSD",
        cooler: "240mm AIO",
        psu: "750W Power Supply"
    }, {
        id: 4,
        image: "../Foto/prebuilt-pc-mr-black.jpg",
        name: "PhantomCore",
        price: "€1399.99",
        cpu: "AMD Ryzen 5 9600x",
        gpu: "AMD RX 7700 XT 12 GB",
        ram: "32GB DDR5 RAM",
        storage: "2TB NVMe SSD",
        cooler: "240mm AIO",
        psu: "750W Power Supply"
    }, {
        id: 5,
        image: "../Foto/high-end-prebuilt-gaming-pc-white.png",
        name: "FrostTitan C5",
        price: "€2899.99",
        cpu: "AMD Ryzen 7 7800X3D",
        gpu: "NVIDIA GeForce RTX 5080",
        ram: "64GB DDR5 RAM",
        storage: "2TB NVMe SSD",
        cooler: "360mm AIO",
        psu: "850W Power Supply"
    }, {
        id: 6,
        image: "../Foto/high-end-prebuilt-gaming-pc-black.jpg",
        name: "ShadowForce V2",
        price: "€2799.99",
        cpu: "AMD Ryzen 7 7800X3D",
        gpu: "NVIDIA GeForce RTX 5080",
        ram: "64GB DDR5 RAM",
        storage: "2TB NVMe SSD",
        cooler: "360mm AIO",
        psu: "850W Power Supply"
    }, {
        id: 7,
        image: "../Foto/ultra-high-end-prebuilt-gaming-pc-white.jpg",
        name: "Whiteout Ultra V3",
        price: "€4399.99",
        cpu: "AMD Ryzen 7 9800X3D",
        gpu: "NVIDIA GeForce RTX 5090",
        ram: "96GB DDR5 RAM",
        storage: "4TB NVMe SSD",
        cooler: "360mm AIO",
        psu: "1000W Power Supply"
    }, {
        id: 8,
        image: "../Foto/ultra-high-end-prebuilt-gaming-pc-black.png",
        name: "Darkflow Domination Max",
        price: "€4299.99",
        cpu: "AMD Ryzen 7 9800X3D",
        gpu: "NVIDIA GeForce RTX 5090",
        ram: "96GB DDR5 RAM",
        storage: "4TB NVMe SSD",
        cooler: "Custom Water Loop",
        psu: "1000W Power Supply"
    }
];

const productContainer = document.querySelector(".prebuilt-list");

if (productContainer) {
    displayProducts();
}

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("prebuilt-pc-card");
        productCard.innerHTML = `
            <div class="prebuilt-pc-image">
                <img src="${product.image}">
            </div>
            <h3 class="title">${product.name}</h3>
            <h5>${product.price}</h5> 
            `;
            productContainer.appendChild(productCard);

            const prebuiltPcImage = productCard.querySelector(".prebuilt-pc-image img");
            prebuiltPcImage.addEventListener("click", () => {
                sessionStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = "prebuilt-pc-detail.html";
            });
    });
}
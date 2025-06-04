// Hier is Bram nog mee bezig, maar ik moet nog ffe bedenken hoe ik de specs erbij ga zetten
const products = [{
    image: '../Foto/budget-prebuilt-gaming-pc-white.png',
    name: 'Glacier 800',
    priceCents: 89999
}, {
    image: '../Foto/budget-prebuilt-gaming-pc-black.png',
    name: 'BlackBeast Lite',
    priceCents: 79999
}, {
    image: '../Foto/prebuild-pc-mr-white.jpg',
    name: 'IceBreaker X14',
    priceCents: 139999
}, {
    image: '../Foto/prebuilt-pc-mr-black.jpg',
    name: 'PhantomCore',
    priceCents: 139999
}, {
    image: '../Foto/high-end-prebuilt-gaming-pc-white.png',
    name: 'FrostTitan C5',
    priceCents: 289999
}, {
    image: '../Foto/high-end-prebuilt-gaming-pc-black.png',
    name: 'ShadowForce V2',
    priceCents: 279999
}, {
    image: '../Foto/ultra-high-end-prebuilt-gaming-pc-white.png',
    name: 'Whiteout Ultra V3',
    priceCents: 439999
}, {
    image: '../Foto/ultra-high-end-prebuilt-gaming-pc-black.png',
    name: 'Darkflow Domination Max',
    priceCents: 429999
}]

let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
    <div class="prebuilt-pc-card col-6">
                <img src="${product.image}" style="width: 65%;">
                <h3>${product.name}</h3>
                <div class="specs-menu">
                    <div class="specs-toggle">
                        <span class="spects-toggle-text">Specs</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                        <ul class="specs-list">
                            <li class="spec">AMD Ryzen 5 5500</li>
                            <li class="spec">NVIDIA GeForce RTX 4060</li>
                            <li class="spec">16GB DDR4 RAM</li>
                            <li class="spec">1TB NVMe SSD</li>
                            <li class="spec">120mm fan Air Cooler</li>
                            <li class="spec">650W Power Supply</li>
                        </ul>
                </div>
                <h5>€${product.priceCents / 100}</h5>
                <button class="buy-button">Add to cart</button>
    </div>
    `;
});
console.log(productsHTML);
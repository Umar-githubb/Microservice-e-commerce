const PRODUCT_API = 'http://localhost:8081/products';
const ORDER_API = 'http://localhost:8082/orders';

// Product icon mapping
const productIcons = {
    'Whey Protein Gold': 'bi-lightning-charge-fill',
    'Mass Gainer 3XL': 'bi-trophy-fill',
    'Serious Mass': 'bi-fire',
    'Pre-Workout Energizer': 'bi-heart-pulse-fill',
    'BCAA Recovery': 'bi-stars',
    'Creatine Monohydrate': 'bi-shield-fill-check'
};

// Load Products
async function loadProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = '<div class="col-12"><div class="loading-spinner"></div></div>';

    try {
        const response = await axios.get(PRODUCT_API);
        const products = response.data;
        list.innerHTML = '';

        products.forEach((p) => {
            const icon = productIcons[p.name] || 'bi-capsule';
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';

            col.innerHTML = `
                <div class="product-card">
                    <div class="product-icon">
                        <i class="bi ${icon}"></i>
                    </div>
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-id">ID: ${p.id}</p>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <span class="product-stock">Stock: ${p.stock}</span>
                </div>
            `;
            list.appendChild(col);
        });
    } catch (error) {
        list.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Failed to load products. Is the Product Service running?
                </div>
            </div>`;
        console.error(error);
    }
}

// Place Order
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

    const productId = document.getElementById('productId').value;
    const quantity = document.getElementById('quantity').value;
    const resultDiv = document.getElementById('orderResult');
    resultDiv.innerHTML = '';

    try {
        const response = await axios.post(ORDER_API, {
            productId: parseInt(productId),
            quantity: parseInt(quantity)
        });

        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Order Placed Successfully!</strong><br>
                Order ID: ${response.data.id} • Total: $${response.data.totalAmount.toFixed(2)}
            </div>
        `;

        // Refresh product list to show updated stock
        await loadProducts();

        // Reset form
        e.target.reset();
        document.getElementById('quantity').value = 1;

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                Order Failed: ${errorMessage}
            </div>
        `;
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Input validation/UX
document.getElementById('quantity').addEventListener('change', (e) => {
    if (e.target.value < 1) e.target.value = 1;
});

// Initial Load
document.addEventListener('DOMContentLoaded', loadProducts);

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const feedbackTextArea = document.getElementById("feedbackText");
    const submitFeedbackBtn = document.getElementById("submitFeedback");
    const cartBadge = document.getElementById('cart-badge');
    const cartBtn = document.getElementById('cartBtn');
    const productList = document.getElementById("product-list");
    const productInfo = document.getElementById("product-info");
    const modal = document.getElementById("myModal");

    let cartItems = [];

    searchInput.addEventListener("input", searchProducts);
    submitFeedbackBtn.addEventListener("click", submitFeedback);
    cartBtn.addEventListener("click", showCart);

    // Fetch products and display initially
    fetchProducts();

    function fetchProducts() {
        fetch("http://localhost:5000/products")
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        fetch("http://localhost:5000/products")
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => 
                    product.name.toLowerCase().includes(searchTerm)
                );
                displayProducts(filteredProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        productList.innerHTML = ''; 
        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
                <div class="product-item">
                    <h3>${product.name}</h3>
                    <img src="${product.image_link}" alt="${product.name}">
                    <p>Brand: ${product.brand}</p>
                    <p>Price: ${product.price} USD</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productList.appendChild(productItem);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const productId = event.target.dataset.productId;
        if (!cartItems.includes(productId)) {
            cartItems.push(productId);
            updateCart();
            alert(`Product with ID ${productId} added to cart.`);
        } else {
            alert("Product is already in the cart.");
        }
    }

    function updateCart() {
        if (cartBadge) {
            cartBadge.textContent = cartItems.length;
        }
    }

    function showCart() {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        fetch("http://localhost:5000/products")
            .then(response => response.json())
            .then(data => {
                const cartProducts = data.filter(product => 
                    cartItems.includes(product.id.toString())
                );

                if (cartProducts.length === 0) {
                    alert("No products found in your cart.");
                } else {
                    productInfo.innerHTML = '';
                    cartProducts.forEach((product, index) => {
                        const productContainer = document.createElement('div');
                        productContainer.innerHTML = `
                            <div class="product-item">
                                <img src="${product.image_link}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">
                                <p>Name: ${product.name}</p>
                                <p>Brand: ${product.brand}</p>
                                <p>Price: ${product.price} USD</p>
                                <button class="remove-btn" data-index="${index}">Remove</button>
                            </div>
                        `;
                        productInfo.appendChild(productContainer);
                    });

                    document.querySelectorAll('.remove-btn').forEach(button => {
                        button.addEventListener('click', removeProductFromCart);
                    });

                    modal.style.display = "block";
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            });
    }

    function removeProductFromCart(event) {
        const index = event.target.dataset.index;
        cartItems.splice(index, 1);
        updateCart();
        showCart();
    }

    function submitFeedback() {
        const feedbackText = feedbackTextArea.value.trim();
        if (feedbackText !== '') {
            alert("Feedback submitted successfully");
            feedbackTextArea.value = '';
        } else {
            alert('Please enter your feedback.');
        }
    }
});
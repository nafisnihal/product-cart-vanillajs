let cart = [];

// Initialize selected color and size
document.addEventListener("DOMContentLoaded", () => {
  // Automatically select the first color
  const firstColor = document.querySelector("[data-thumbnail]");
  if (firstColor) {
    firstColor.classList.add("outline");
    const mainThumbnail = document.getElementById("main-thumbnail");
    mainThumbnail.src = firstColor.getAttribute("data-thumbnail");
  }

  // Automatically select the first size
  const firstSize = document.querySelector(".size-button");
  if (firstSize) {
    selectedSize = firstSize.getAttribute("data-size");
    firstSize.classList.add("border-blue-600", "bg-gray-100");
  }
});

// Change main thumbnail and update selected color
document.querySelectorAll("[data-thumbnail]").forEach((button) => {
  button.addEventListener("click", (e) => {
    const newThumbnail = e.target.getAttribute("data-thumbnail");
    const mainThumbnail = document.getElementById("main-thumbnail");
    mainThumbnail.src = newThumbnail;

    // Update active button
    document.querySelectorAll("[data-thumbnail]").forEach((btn) => {
      btn.classList.remove("outline");
    });
    e.target.classList.add("outline");
  });
});

// Select size
let selectedSize = null;
document.querySelectorAll(".size-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    selectedSize = e.target.getAttribute("data-size");

    // Update active button
    document.querySelectorAll(".size-button").forEach((btn) => {
      btn.classList.remove("border-blue-600", "bg-gray-100");
    });
    e.target.classList.add("border-blue-600", "bg-gray-100");
  });
});

// Update quantity
function updateQuantity(change) {
  const quantityInput = document.getElementById("quantity");
  const newValue = Math.max(1, parseInt(quantityInput.value) + change);
  quantityInput.value = newValue;
}

// Add to cart
document.getElementById("add-to-cart").addEventListener("click", () => {
  const name = document.getElementById("name").innerText;
  const mainThumbnail = document.getElementById("main-thumbnail").src;
  const quantity = parseInt(document.getElementById("quantity").value);
  const color = document
    .querySelector("[data-thumbnail].outline")
    ?.getAttribute("data-color");
  const selectedSizeElement = document.querySelector(
    ".size-button.border-blue-600"
  );
  const size = selectedSizeElement?.getAttribute("data-size");
  const price = parseInt(
    selectedSizeElement?.innerText.match(/\$(\d+)/)?.[1] || 0
  );

  if (!color || !size) {
    alert("Please select a color and size.");
    return;
  }

  cart.push({
    thumbnail: mainThumbnail,
    name,
    color,
    size,
    quantity,
    price: price * quantity,
  });
  updateCartUI();
});

// Update cart UI to display as a table
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  cartCount.innerText = cart.length;

  const checkoutButton = document.getElementById("checkout-button");
  if (cart.length > 0) {
    checkoutButton.classList.remove("hidden");
  } else {
    checkoutButton.classList.add("hidden");
  }
}

// Open cart modal
document.getElementById("checkout-button").addEventListener("click", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  if (cart.length > 0) {
    // Create table structure
    const table = document.createElement("table");
    table.className = "min-w-full table-auto border-collapse";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create table headers
    thead.innerHTML = `
      <tr class="text-gray-500 border-b">
        <th class="text-start py-2">Item</th>
        <th class="text-center py-2 px-4">Color</th>
        <th class="text-center py-2 px-4">Size</th>
        <th class="text-center py-2 px-4">Qnt</th>
        <th class="text-end py-2">Price</th>
      </tr>
    `;

    // Append table headers to table
    table.appendChild(thead);

    // Add table rows for each item in the cart
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.className = "border-b group";

      row.innerHTML = `
        <td class="py-4">
          <div class="flex items-center gap-5"> 
            
            <img src="${item.thumbnail}" class="w-10 h-10 rounded" />
            <p>${item.name}</p>
            <button
                onclick="removeItemFromCart(${index})"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-500 opacity-0 group-hover:opacity-100">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

            </button>
          </div>
        </td>
        <td class="text-center py-4">${item.color}</td>
        <td class="text-center py-4">${item.size}</td>
        <td class="text-center py-4">${item.quantity}</td>
        <td class="text-end py-4">$${item.price}</td>
      `;
      tbody.appendChild(row);
    });

    // Append the body of the table to the table
    table.appendChild(tbody);

    // Calculate total price and quantity in the last row
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Create total row
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
      <td class="text-start py-6 font-bold" colspan="3">Total</td>
      <td class="text-center py-6 font-bold">${totalQuantity}</td>
      <td class="text-end py-6 font-bold">$${totalPrice}</td>
      <td></td>
    `;
    tbody.appendChild(totalRow);

    // Add the table to the modal content
    cartItemsContainer.appendChild(table);
  } else {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  }

  // Display the modal
  document.getElementById("cart-modal").classList.remove("hidden");
});

// Function to remove item from the cart
function removeItemFromCart(index) {
  cart.splice(index, 1); // Remove the item from the cart array
  updateCartUI(); // Update cart icon count and visibility
  document.getElementById("checkout-button").click(); // Refresh modal content
}

// Close modal
function closeModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

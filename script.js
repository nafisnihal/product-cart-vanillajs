let cart = [];

// Initialize selected color and size
document.addEventListener("DOMContentLoaded", () => {
  // Automatically select the first color
  const firstColor = document.querySelector("[data-thumbnail]");
  if (firstColor) {
    firstColor.classList.add("border-white", "border-double", "border-4");
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
      btn.classList.remove("border-white", "border-double", "border-4");
    });
    e.target.classList.add("border-white", "border-double", "border-4");
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
    .querySelector("[data-thumbnail].border-white")
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
        <th class="text-center py-2">Color</th>
        <th class="text-center py-2">Size</th>
        <th class="text-center py-2">Qnt</th>
        <th class="text-end py-2">Price</th>
      </tr>
    `;

    // Append table headers to table
    table.appendChild(thead);

    // Add table rows for each item in the cart
    cart.forEach((item) => {
      const row = document.createElement("tr");
      row.className = "border-b";

      row.innerHTML = `
        <td class="py-4"><div class="flex items-center gap-5"> <img src="${item.thumbnail}" class="w-10 h-10 rounded" /> <p>${item.name}</p> </div></td>
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
    `;
    tbody.appendChild(totalRow);

    // Add the table to the modal content
    cartItemsContainer.appendChild(table);
  }

  // Display the modal
  document.getElementById("cart-modal").classList.remove("hidden");
});

// Close modal
function closeModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

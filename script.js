// Data objects
let products = {};
let purchaseRecords = [];
let salesRecords = [];

// Load data from localStorage if available
function loadData() {
  const storedProducts = localStorage.getItem("products");
  const storedPurchases = localStorage.getItem("purchaseRecords");
  const storedSales = localStorage.getItem("salesRecords");

  if (storedProducts) {
    products = JSON.parse(storedProducts);
  }
  if (storedPurchases) {
    purchaseRecords = JSON.parse(storedPurchases);
  }
  if (storedSales) {
    salesRecords = JSON.parse(storedSales);
  }
}

// Save current data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));
  localStorage.setItem("salesRecords", JSON.stringify(salesRecords));
}

// Update sale form dropdown with available products
function updateSaleProductOptions() {
  const saleProductSelect = document.getElementById("saleProduct");
  saleProductSelect.innerHTML = ""; // Clear existing options
  for (let productName in products) {
    const option = document.createElement("option");
    option.value = productName;
    option.textContent = productName;
    saleProductSelect.appendChild(option);
  }
}

// Update Inventory Table
function updateStockTable() {
  const stockTable = document.getElementById("stockTable");
  stockTable.innerHTML = "";
  for (let productName in products) {
    const product = products[productName];
    const available = product.totalStock - product.sold;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${productName}</td>
      <td>${product.totalStock}</td>
      <td>${product.sold}</td>
      <td>${available}</td>
    `;
    stockTable.appendChild(row);
  }
}

// Update Purchase Records Table
function updatePurchaseTable() {
  const purchaseTable = document.getElementById("purchaseTable");
  purchaseTable.innerHTML = "";
  purchaseRecords.forEach(record => {
    const totalCost = record.quantity * record.price;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.product}</td>
      <td>${record.date}</td>
      <td>${record.quantity}</td>
      <td>${record.price}</td>
      <td>${totalCost}</td>
    `;
    purchaseTable.appendChild(row);
  });
}

// Update Sales Records Table
function updateSalesTable() {
  const salesTable = document.getElementById("salesTable");
  salesTable.innerHTML = "";
  salesRecords.forEach(record => {
    const totalPrice = record.quantity * record.price;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.product}</td>
      <td>${record.customer}</td>
      <td>${record.date}</td>
      <td>${record.quantity}</td>
      <td>${record.price}</td>
      <td>${totalPrice}</td>
    `;
    salesTable.appendChild(row);
  });
}

// Event listener for purchase form submission
document.getElementById("purchaseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const product = document.getElementById("purchaseProduct").value.trim();
  const date = document.getElementById("purchaseDate").value;
  const quantity = parseInt(document.getElementById("purchaseQuantity").value);
  const price = parseFloat(document.getElementById("purchasePrice").value);

  if (!product) {
    alert("Please enter a product name.");
    return;
  }

  // Agar product exist karta hai to totalStock update karein, warna new entry banayein.
  if (products[product]) {
    products[product].totalStock += quantity;
  } else {
    products[product] = { totalStock: quantity, sold: 0 };
  }

  // Purchase record add karein.
  purchaseRecords.push({
    product: product,
    date: date,
    quantity: quantity,
    price: price
  });

  // UI update
  updateStockTable();
  updatePurchaseTable();
  updateSaleProductOptions();

  // Save data to localStorage
  saveDataToLocalStorage();

  // Form reset
  document.getElementById("purchaseForm").reset();
});

// Event listener for sale form submission
document.getElementById("saleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const product = document.getElementById("saleProduct").value;
  const customer = document.getElementById("customer").value.trim();
  const date = document.getElementById("saleDate").value;
  const quantity = parseInt(document.getElementById("saleQuantity").value);
  const price = parseFloat(document.getElementById("salePrice").value);

  if (!products[product]) {
    alert("Selected product does not exist.");
    return;
  }
  // Check available stock
  if (products[product].sold + quantity > products[product].totalStock) {
    alert("Not enough stock available!");
    return;
  }

  // Update sold quantity
  products[product].sold += quantity;

  // Add sales record
  salesRecords.push({
    product: product,
    customer: customer,
    date: date,
    quantity: quantity,
    price: price
  });

  // UI update
  updateStockTable();
  updateSalesTable();

  // Save data to localStorage
  saveDataToLocalStorage();

  // Form reset
  document.getElementById("saleForm").reset();
});

// Load data from localStorage and initialize UI on page load
loadData();
updateStockTable();
updatePurchaseTable();
updateSalesTable();
updateSaleProductOptions();
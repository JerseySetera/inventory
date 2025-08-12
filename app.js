// app.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQBfQIEc0ZbsW9QiK7WpiG_PkRQu50ZRg",
    authDomain: "my-invetory-app.firebaseapp.com",
    projectId: "my-invetory-app",
    storageBucket: "my-invetory-app.firebasestorage.app",
    messagingSenderId: "1026270826884",
    appId: "1:1026270826884:web:3d7ee7abdf7f8c90b84dd1",
    measurementId: "G-QRDHDZ93DK",
    databaseURL: "https://my-invetory-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error-message');
    const logoutBtn = document.getElementById('logout-btn');
    // New POS elements
    const openPosBtn = document.getElementById('open-pos-btn');
    const posModal = document.getElementById('pos-modal');
    const posModalCloseBtn = document.getElementById('pos-modal-close-btn');
    const posSearchInput = document.getElementById('pos-search-input');
    const posProductList = document.getElementById('pos-product-list');
    const posCartItems = document.getElementById('pos-cart-items');
    const posSubtotal = document.getElementById('pos-subtotal');
    const posTax = document.getElementById('pos-tax');
    const posTotal = document.getElementById('pos-total');
    const posCancelBtn = document.getElementById('pos-cancel-btn');
    const posCheckoutBtn = document.getElementById('pos-checkout-btn');
    // New Print element
    const printBtn = document.getElementById('print-btn');
    // New Deleted Items elements
    const deletedItemsBtn = document.getElementById('deleted-items-btn');
    const deletedItemsModal = document.getElementById('deleted-items-modal');
    const deletedItemsModalCloseBtn = document.getElementById('deleted-items-modal-close-btn');
    const deletedItemsList = document.getElementById('deleted-items-list');
    const noDeletedItemsMessage = document.getElementById('no-deleted-items');


    // Existing inventory elements
    const itemForm = document.getElementById('item-form');
    const itemNameInput = document.getElementById('item-name');
    const itemSkuInput = document.getElementById('item-sku');
    const itemDescriptionInput = document.getElementById('item-description');
    const itemQuantityInput = document.getElementById('item-quantity');
    const itemLocationInput = document.getElementById('item-location');
    const itemSupplierInput = document.getElementById('item-supplier');
    const itemCostInput = document.getElementById('item-cost');
    const itemPriceInput = document.getElementById('item-price');
    const tableBody = document.getElementById('inventory-table-body');
    const searchInput = document.getElementById('search-input');
    const formButton = document.getElementById('form-button');
    const formTitle = document.getElementById('form-title');
    const emptyState = document.getElementById('empty-state');
    const cancelButton = document.getElementById('cancel-button');
    const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
    const deleteModalConfirmBtn = document.getElementById('delete-modal-confirm');
    const deleteModalCancelBtn = document.getElementById('delete-modal-cancel');
    const totalItemsCard = document.getElementById('total-items-card');
    const totalValueCard = document.getElementById('total-value-card');
    const lowStockCard = document.getElementById('low-stock-card');
    const totalRevenueCard = document.getElementById('total-revenue-card');
    const totalProfitCard = document.getElementById('total-profit-card');
    const monthlyProfitCard = document.getElementById('monthly-profit-card');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const importModal = document.getElementById('import-modal');
    const importSubmitBtn = document.getElementById('import-submit-btn');
    const importCancelBtn = document.getElementById('import-cancel-btn');
    const csvFileInput = document.getElementById('csv-file-input');
    const salesModal = document.getElementById('sales-modal');
    const salesItemName = document.getElementById('sales-item-name');
    const salesQuantityInput = document.getElementById('sales-quantity-input');
    const salesModalConfirmBtn = document.getElementById('sales-modal-confirm');
    const salesModalCancelBtn = document.getElementById('sales-modal-cancel');
    const salesErrorMessage = document.getElementById('sales-error-message');
    
    const lowStockThreshold = 10;
    const salesTaxRate = 0.10; // 10% tax rate

    // --- State Variables ---
    let inventory = [];
    let editIndex = -1;
    let deleteIndex = -1;
    let salesIndex = -1;
    let totalRevenue = 0;
    let totalProfit = 0;
    let salesHistory = [];
    let userRole = null;
    let cart = [];
    // New Deleted Items History state variable
    let deletedItemsHistory = [];


    // --- Authentication State Listener ---
    onAuthStateChanged(auth, async user => {
        if (user) {
            const idTokenResult = await user.getIdTokenResult(true);
            userRole = idTokenResult.claims.role;

            if (userRole === 'admin' || userRole === 'superadmin') {
                loginContainer.classList.add('hidden');
                appContainer.classList.remove('hidden');
                loadInventory();
                renderInventory();
                if (userRole === 'superadmin') {
                    deletedItemsBtn.classList.remove('hidden');
                } else {
                    deletedItemsBtn.classList.add('hidden');
                }
            } else {
                alert("You do not have the necessary permissions to access this application.");
                await signOut(auth);
            }
        } else {
            loginContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
            inventory = [];
            totalRevenue = 0;
            totalProfit = 0;
            salesHistory = [];
            userRole = null;
        }
    });

    // --- Authentication Event Handlers ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value.toLowerCase();
        const password = loginPasswordInput.value;
        loginError.classList.add('hidden');

        try {
            const usernameRef = ref(database, 'usernames/' + username);
            const snapshot = await get(usernameRef);
            const email = snapshot.val();

            if (!email) {
                loginError.textContent = 'Invalid username or password.';
                loginError.classList.remove('hidden');
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            loginError.textContent = 'Login failed. Please check your username and password.';
            loginError.classList.remove('hidden');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("You have been successfully logged out.");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    });

    // --- Deleted Items History Functions ---
    const renderDeletedItems = () => {
        deletedItemsList.innerHTML = '';
        if (deletedItemsHistory.length === 0) {
            noDeletedItemsMessage.classList.remove('hidden');
        } else {
            noDeletedItemsMessage.classList.add('hidden');
            deletedItemsHistory.forEach((item, index) => {
                const deletedItemDiv = document.createElement('div');
                deletedItemDiv.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
                deletedItemDiv.innerHTML = `
                    <div>
                        <h5 class="font-semibold text-gray-800">${item.name}</h5>
                        <p class="text-sm text-gray-500">SKU: ${item.sku} | Deleted: ${item.deletionDate}</p>
                    </div>
                    <button class="restore-item-btn bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition" data-index="${index}">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                `;
                deletedItemsList.appendChild(deletedItemDiv);
            });
        }
    };

    deletedItemsBtn.addEventListener('click', () => {
        if (userRole === 'superadmin') {
            deletedItemsModal.classList.remove('hidden');
            renderDeletedItems();
        } else {
            alert("You do not have permission to access deleted items history.");
        }
    });

    deletedItemsModalCloseBtn.addEventListener('click', () => {
        deletedItemsModal.classList.add('hidden');
    });

    deletedItemsList.addEventListener('click', (e) => {
        const target = e.target.closest('.restore-item-btn');
        if (target) {
            const index = parseInt(target.dataset.index);
            const itemToRestore = deletedItemsHistory.splice(index, 1)[0];
            
            inventory.push(itemToRestore);
            
            saveInventory();
            renderInventory();
            renderDeletedItems();
            alert(`Item "${itemToRestore.name}" restored successfully.`);
        }
    });

    // --- POS Functions ---
    const renderPosProducts = (searchTerm = '') => {
        posProductList.innerHTML = '';
        const filteredItems = inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredItems.length === 0) {
            posProductList.innerHTML = '<p class="text-gray-500 text-center py-4">No products found.</p>';
            return;
        }

        filteredItems.forEach((item, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
            productCard.innerHTML = `
                <div>
                    <h5 class="font-semibold text-gray-800">${item.name}</h5>
                    <p class="text-sm text-gray-500">SKU: ${item.sku} | In Stock: ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-green-600">$${parseFloat(item.price).toFixed(2)}</span>
                    <button class="add-to-cart-btn bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed" data-index="${index}" ${item.quantity === 0 ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            posProductList.appendChild(productCard);
        });
    };

    const renderCart = () => {
        posCartItems.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            posCartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Cart is empty.</p>';
            posCheckoutBtn.disabled = true;
        } else {
            posCheckoutBtn.disabled = false;
        }

        cart.forEach((cartItem, index) => {
            const itemTotal = cartItem.quantity * cartItem.price;
            subtotal += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('flex', 'items-center', 'space-x-2', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
            cartItemDiv.innerHTML = `
                <div class="flex-grow">
                    <h5 class="font-semibold text-gray-800">${cartItem.name}</h5>
                    <p class="text-sm text-gray-500">$${parseFloat(cartItem.price).toFixed(2)} each</p>
                </div>
                <div class="flex items-center space-x-2">
                    <input type="number" min="1" max="${inventory[cartItem.inventoryIndex].quantity}" value="${cartItem.quantity}" class="cart-quantity-input w-16 text-center border rounded-md p-1" data-index="${index}">
                    <span class="font-bold text-gray-800">$${itemTotal.toFixed(2)}</span>
                    <button class="remove-from-cart-btn text-red-600 hover:text-red-800 transition" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            posCartItems.appendChild(cartItemDiv);
        });

        const taxAmount = subtotal * salesTaxRate;
        const totalAmount = subtotal + taxAmount;
        
        posSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        posTax.textContent = `$${taxAmount.toFixed(2)}`;
        posTotal.textContent = `$${totalAmount.toFixed(2)}`;
    };

    const addToCart = (inventoryIndex) => {
        const item = inventory[inventoryIndex];
        const existingCartItem = cart.find(cartItem => cartItem.inventoryIndex === inventoryIndex);

        if (existingCartItem) {
            if (existingCartItem.quantity + 1 <= item.quantity) {
                existingCartItem.quantity += 1;
            } else {
                alert(`Cannot add more than ${item.quantity} of ${item.name} to the cart.`);
            }
        } else {
            cart.push({
                ...item,
                quantity: 1,
                inventoryIndex: inventoryIndex
            });
        }
        renderCart();
    };

    const updateCartQuantity = (cartIndex, newQuantity) => {
        if (newQuantity <= 0) return;
        
        const cartItem = cart[cartIndex];
        const inventoryItem = inventory[cartItem.inventoryIndex];

        if (newQuantity > inventoryItem.quantity) {
            alert(`Cannot set quantity higher than available stock (${inventoryItem.quantity}).`);
            cartItem.quantity = inventoryItem.quantity;
        } else {
            cartItem.quantity = newQuantity;
        }
        renderCart();
    };

    const removeFromCart = (cartIndex) => {
        cart.splice(cartIndex, 1);
        renderCart();
    };

    const processSale = () => {
        if (cart.length === 0) {
            alert('The cart is empty.');
            return;
        }

        for (const cartItem of cart) {
            const inventoryItem = inventory[cartItem.inventoryIndex];
            if (cartItem.quantity > inventoryItem.quantity) {
                alert(`Cannot process sale. Insufficient stock for ${inventoryItem.name}.`);
                return;
            }
        }

        let totalSaleSubtotal = 0;
        let totalSaleProfit = 0;

        for (const cartItem of cart) {
            const inventoryItem = inventory[cartItem.inventoryIndex];
            
            inventoryItem.quantity -= cartItem.quantity;
            
            const itemRevenue = cartItem.quantity * cartItem.price;
            const itemProfit = cartItem.quantity * (cartItem.price - inventoryItem.cost);
            
            totalSaleSubtotal += itemRevenue;
            totalSaleProfit += itemProfit;

            salesHistory.push({
                date: new Date().toISOString(),
                quantity: cartItem.quantity,
                revenue: itemRevenue,
                profit: itemProfit
            });
        }

        const taxAmount = totalSaleSubtotal * salesTaxRate;
        const totalSaleAmount = totalSaleSubtotal + taxAmount;
        
        totalRevenue += totalSaleAmount;
        totalProfit += totalSaleProfit;

        cart = [];
        saveInventory();
        renderInventory();
        posModal.classList.add('hidden');
        alert(`Sale processed successfully! Total: $${totalSaleAmount.toFixed(2)}`);
    };

    openPosBtn.addEventListener('click', () => {
        if (userRole === 'admin' || userRole === 'superadmin') {
            cart = [];
            renderPosProducts();
            renderCart();
            posModal.classList.remove('hidden');
        } else {
            alert("You do not have permission to use the POS system.");
        }
    });

    posModalCloseBtn.addEventListener('click', () => {
        posModal.classList.add('hidden');
    });

    posCancelBtn.addEventListener('click', () => {
        posModal.classList.add('hidden');
    });

    posCheckoutBtn.addEventListener('click', processSale);

    posSearchInput.addEventListener('input', (e) => {
        renderPosProducts(e.target.value);
    });

    posProductList.addEventListener('click', (e) => {
        const target = e.target.closest('.add-to-cart-btn');
        if (target) {
            const index = parseInt(target.dataset.index);
            addToCart(index);
        }
    });

    posCartItems.addEventListener('click', (e) => {
        const target = e.target.closest('.remove-from-cart-btn');
        if (target) {
            const index = parseInt(target.dataset.index);
            removeFromCart(index);
        }
    });
    
    posCartItems.addEventListener('change', (e) => {
        const target = e.target.closest('.cart-quantity-input');
        if (target) {
            const index = parseInt(target.dataset.index);
            const newQuantity = parseInt(target.value);
            if (!isNaN(newQuantity)) {
                updateCartQuantity(index, newQuantity);
            }
        }
    });


    deletedItemsBtn.addEventListener('click', () => {
        if (userRole === 'superadmin') {
            deletedItemsModal.classList.remove('hidden');
            renderDeletedItems();
        } else {
            alert("You do not have permission to access deleted items history.");
        }
    });

    deletedItemsModalCloseBtn.addEventListener('click', () => {
        deletedItemsModal.classList.add('hidden');
    });

    deletedItemsList.addEventListener('click', (e) => {
        const target = e.target.closest('.restore-item-btn');
        if (target) {
            const index = parseInt(target.dataset.index);
            const itemToRestore = deletedItemsHistory.splice(index, 1)[0];
            
            inventory.push(itemToRestore);
            
            saveInventory();
            renderInventory();
            renderDeletedItems();
            alert(`Item "${itemToRestore.name}" restored successfully.`);
        }
    });

    const saveInventory = () => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('totalRevenue', totalRevenue);
        localStorage.setItem('totalProfit', totalProfit);
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
        localStorage.setItem('deletedItemsHistory', JSON.stringify(deletedItemsHistory));
    };

    const loadInventory = () => {
        const storedInventory = localStorage.getItem('inventory');
        if (storedInventory) {
            inventory = JSON.parse(storedInventory);
        }
        totalRevenue = parseFloat(localStorage.getItem('totalRevenue')) || 0;
        totalProfit = parseFloat(localStorage.getItem('totalProfit')) || 0;
        const storedSalesHistory = localStorage.getItem('salesHistory');
        if (storedSalesHistory) {
            salesHistory = JSON.parse(storedSalesHistory);
        }
        const storedDeletedItems = localStorage.getItem('deletedItemsHistory');
        if (storedDeletedItems) {
            deletedItemsHistory = JSON.parse(storedDeletedItems);
        }
    };

    const calculateMonthlyProfit = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyProfit = salesHistory.reduce((sum, sale) => {
            const saleDate = new Date(sale.date);
            if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
                return sum + sale.profit;
            }
            return sum;
        }, 0);
        return monthlyProfit;
    };

    const updateDashboard = () => {
        totalItemsCard.textContent = inventory.length;
        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
        totalValueCard.textContent = `$${totalValue.toFixed(2)}`;
        const lowStockCount = inventory.filter(item => item.quantity <= lowStockThreshold).length;
        lowStockCard.textContent = lowStockCount;
        totalRevenueCard.textContent = `$${totalRevenue.toFixed(2)}`;
        totalProfitCard.textContent = `$${totalProfit.toFixed(2)}`;
        const monthlyProfit = calculateMonthlyProfit();
        monthlyProfitCard.textContent = `$${monthlyProfit.toFixed(2)}`;
    };

    const renderInventory = (itemsToRender = inventory) => {
        tableBody.innerHTML = '';
        if (itemsToRender.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            itemsToRender.forEach((item, index) => {
                const row = document.createElement('tr');
                const isLowStock = item.quantity <= lowStockThreshold;
                row.classList.add('hover:bg-gray-50', isLowStock ? 'bg-yellow-50' : 'bg-white');

                row.innerHTML = `
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.sku}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.supplier}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.location}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">$${parseFloat(item.price).toFixed(2)}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <div class="flex justify-center space-x-2">
                            <button class="sell-btn text-green-600 hover:text-green-900 transition duration-150 ease-in-out" data-index="${index}">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="edit-btn text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out" data-index="${index}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn text-red-600 hover:text-red-900 transition duration-150 ease-in-out" data-index="${index}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        updateDashboard();
    };

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = itemNameInput.value.trim();
        const sku = itemSkuInput.value.trim();
        const description = itemDescriptionInput.value.trim();
        const quantity = parseInt(itemQuantityInput.value);
        const location = itemLocationInput.value.trim();
        const supplier = itemSupplierInput.value.trim();
        const cost = parseFloat(itemCostInput.value);
        const price = parseFloat(itemPriceInput.value);

        if (editIndex !== -1) {
            inventory[editIndex] = { name, sku, description, quantity, location, supplier, cost, price };
            editIndex = -1;
            formTitle.textContent = 'Add New Item';
            formButton.textContent = 'Add Item';
            cancelButton.classList.add('hidden');
        } else {
            inventory.push({ name, sku, description, quantity, location, supplier, cost, price });
        }

        saveInventory();
        renderInventory();
        itemForm.reset();
    });
    
    tableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('edit-btn')) {
            if (userRole === 'superadmin' || userRole === 'admin') {
                editIndex = index;
                const item = inventory[index];
                itemNameInput.value = item.name;
                itemSkuInput.value = item.sku;
                itemDescriptionInput.value = item.description;
                itemQuantityInput.value = item.quantity;
                itemLocationInput.value = item.location;
                itemSupplierInput.value = item.supplier;
                itemCostInput.value = item.cost;
                itemPriceInput.value = item.price;
                formTitle.textContent = 'Edit Item';
                formButton.textContent = 'Update Item';
                cancelButton.classList.remove('hidden');
            } else {
                alert("You do not have permission to edit items.");
            }
        } else if (target.classList.contains('delete-btn')) {
            if (userRole === 'superadmin' || userRole === 'admin') {
                deleteIndex = index;
                deleteConfirmationModal.classList.remove('hidden');
            } else {
                alert("You do not have permission to delete items.");
            }
        } else if (target.classList.contains('sell-btn')) {
            if (userRole === 'superadmin' || userRole === 'admin') {
                salesIndex = index;
                const item = inventory[index];
                salesItemName.textContent = item.name;
                salesQuantityInput.value = 1;
                salesQuantityInput.max = item.quantity;
                salesErrorMessage.classList.add('hidden');
                salesModal.classList.remove('hidden');
            } else {
                alert("You do not have permission to record sales.");
            }
        }
    });

    deleteModalConfirmBtn.addEventListener('click', () => {
        if (deleteIndex !== -1 && (userRole === 'superadmin' || userRole === 'admin')) {
            const deletedItem = { ...inventory[deleteIndex], deletionDate: new Date().toLocaleString() };
            deletedItemsHistory.push(deletedItem);

            inventory.splice(deleteIndex, 1);
            
            saveInventory();
            renderInventory();
            deleteIndex = -1;
        }
        deleteConfirmationModal.classList.add('hidden');
    });

    deleteModalCancelBtn.addEventListener('click', () => {
        deleteConfirmationModal.classList.add('hidden');
        deleteIndex = -1;
    });

    cancelButton.addEventListener('click', () => {
        editIndex = -1;
        formTitle.textContent = 'Add New Item';
        formButton.textContent = 'Add Item';
        cancelButton.classList.add('hidden');
        itemForm.reset();
    });

    salesModalConfirmBtn.addEventListener('click', () => {
        const quantitySold = parseInt(salesQuantityInput.value);
        const item = inventory[salesIndex];

        if (isNaN(quantitySold) || quantitySold <= 0) {
            salesErrorMessage.textContent = 'Please enter a valid quantity greater than 0.';
            salesErrorMessage.classList.remove('hidden');
            return;
        }

        if (quantitySold > item.quantity) {
            salesErrorMessage.textContent = 'Cannot sell more items than are in stock.';
            salesErrorMessage.classList.remove('hidden');
            return;
        }

        const revenue = quantitySold * item.price;
        const profit = quantitySold * (item.price - item.cost);

        salesHistory.push({
            date: new Date().toISOString(),
            quantity: quantitySold,
            revenue: revenue,
            profit: profit
        });
        
        totalRevenue += revenue;
        totalProfit += totalSaleProfit;
        item.quantity -= quantitySold;

        saveInventory();
        renderInventory();
        salesModal.classList.add('hidden');
        salesIndex = -1;
    });

    salesModalCancelBtn.addEventListener('click', () => {
        salesModal.classList.add('hidden');
        salesIndex = -1;
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.sku.toLowerCase().includes(searchTerm) ||
            item.supplier.toLowerCase().includes(searchTerm)
        );
        renderInventory(filteredItems);
    });

    exportBtn.addEventListener('click', () => {
        const headers = ["name", "sku", "supplier", "description", "quantity", "location", "cost", "price"];
        const csvRows = [headers.join(',')];
        for (const item of inventory) {
            const values = headers.map(header => {
                const value = item[header];
                return (value === undefined || value === null) ? '' : `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "inventory_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    importBtn.addEventListener('click', () => {
        importModal.classList.remove('hidden');
    });

    importCancelBtn.addEventListener('click', () => {
        importModal.classList.add('hidden');
        csvFileInput.value = '';
    });

    importSubmitBtn.addEventListener('click', () => {
        const file = csvFileInput.files[0];
        if (!file) {
            alert("Please select a CSV file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].trim().split(',').map(header => header.trim().replace(/"/g, ''));
            
            if (!headers.includes("name") || !headers.includes("sku")) {
                alert("Invalid CSV format. Required columns: name, sku, supplier, description, quantity, location, cost, price.");
                return;
            }

            const importedItems = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === '') continue;
                const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
                const item = {};
                headers.forEach((header, index) => {
                    let value = values[index];
                    if (header === 'quantity' || header === 'cost' || header === 'price') {
                        item[header] = parseFloat(value) || 0;
                    } else {
                        item[header] = value;
                    }
                });
                importedItems.push(item);
            }
            inventory = importedItems;
            saveInventory();
            renderInventory();
            importModal.classList.add('hidden');
            csvFileInput.value = '';
        };
        reader.readAsText(file);
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });
});
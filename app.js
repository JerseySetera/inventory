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

document.addEventListener('DOMContentLoaded', async () => {

    // Automatically sign out on every page refresh
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out on refresh:", error);
    }

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

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
    const printInventoryBtn = document.getElementById('print-inventory-btn');
    // New Deleted Items elements
    const deletedItemsBtn = document.getElementById('deleted-items-btn');
    const deletedItemsModal = document.getElementById('deleted-items-modal');
    const deletedItemsModalCloseBtn = document.getElementById('deleted-items-modal-close-btn');
    const deletedItemsList = document.getElementById('deleted-items-list');
    const noDeletedItemsMessage = document.getElementById('no-deleted-items');
    const selectAllDeletedItems = document.getElementById('select-all-deleted-items');
    const bulkDeleteDeletedItemsBtn = document.getElementById('bulk-delete-deleted-items-btn');
    // New Sold Items elements
    const soldItemsBtn = document.getElementById('sold-items-btn');
    const soldItemsModal = document.getElementById('sold-items-modal');
    const soldItemsModalCloseBtn = document.getElementById('sold-items-modal-close-btn');
    const soldItemsList = document.getElementById('sold-items-list');
    const noSoldItemsMessage = document.getElementById('no-sold-items');
    const printSoldItemsBtn = document.getElementById('print-sold-items-btn');
    const selectAllSoldItems = document.getElementById('select-all-sold-items');
    const bulkDeleteSoldItemsBtn = document.getElementById('bulk-delete-sold-items-btn');
    // New Deleted Sold Items elements
    const deletedSoldItemsBtn = document.getElementById('deleted-sold-items-btn');
    const deletedSoldItemsModal = document.getElementById('deleted-sold-items-modal');
    const deletedSoldItemsModalCloseBtn = document.getElementById('deleted-sold-items-modal-close-btn');
    const deletedSoldItemsList = document.getElementById('deleted-sold-items-list');
    const noDeletedSoldItemsMessage = document.getElementById('no-deleted-sold-items');
    const selectAllDeletedSoldItems = document.getElementById('select-all-deleted-sold-items');
    const bulkDeleteDeletedSoldItemsBtn = document.getElementById('bulk-delete-deleted-sold-items-btn');
    
    // Inventory bulk delete elements
    const selectAllInventory = document.getElementById('select-all-inventory');
    const bulkDeleteInventoryBtn = document.getElementById('bulk-delete-inventory-btn');
    
    // Reset site elements
    const resetSiteBtn = document.getElementById('reset-site-btn');
    const resetSiteConfirmationModal = document.getElementById('reset-site-confirmation-modal');
    const resetSiteConfirmBtn = document.getElementById('reset-site-confirm-btn');
    const resetSiteCancelBtn = document.getElementById('reset-site-cancel-btn');


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
    // New Sold Items History state variable
    let soldItemsHistory = [];
    // New Deleted Sold Items History state variable
    let deletedSoldItemsHistory = [];


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
                    deletedSoldItemsBtn.classList.remove('hidden');
                    selectAllInventory.classList.remove('hidden');
                    bulkDeleteInventoryBtn.classList.remove('hidden');
                    resetSiteBtn.classList.remove('hidden');
                } else {
                    deletedItemsBtn.classList.add('hidden');
                    deletedSoldItemsBtn.classList.add('hidden');
                    selectAllInventory.classList.add('hidden');
                    bulkDeleteInventoryBtn.classList.add('hidden');
                    resetSiteBtn.classList.add('hidden');
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
                    <div class="flex items-center space-x-4">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 deleted-item-checkbox" data-index="${index}">
                        <div>
                            <h5 class="font-semibold text-gray-800">${item.name}</h5>
                            <p class="text-sm text-gray-500">SKU: ${item.sku} | Deleted: ${item.deletionDate}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="restore-item-btn bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition" data-index="${index}">
                            <i class="fas fa-undo"></i> Restore
                        </button>
                        <button class="delete-item-permanently-btn bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition" data-index="${index}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
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
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('restore-item-btn')) {
            const itemToRestore = deletedItemsHistory.splice(index, 1)[0];
            inventory.push(itemToRestore);
            saveInventory();
            renderInventory();
            renderDeletedItems();
            alert(`Item "${itemToRestore.name}" restored successfully.`);
        } else if (target.classList.contains('delete-item-permanently-btn')) {
            const itemToDelete = deletedItemsHistory.splice(index, 1)[0];
            saveInventory();
            renderDeletedItems();
            alert(`Item "${itemToDelete.name}" permanently deleted.`);
        }
    });

    selectAllDeletedItems.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.deleted-item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    bulkDeleteDeletedItemsBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.deleted-item-checkbox:checked');
        if (checkboxes.length === 0) {
            alert("Please select items to delete.");
            return;
        }

        const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        deletedItemsHistory = deletedItemsHistory.filter((_, index) => !indicesToDelete.includes(index));
        
        saveInventory();
        renderDeletedItems();
        alert(`${indicesToDelete.length} items permanently deleted.`);
    });


    // --- Sold Items History Functions ---
    const renderSoldItems = () => {
        soldItemsList.innerHTML = '';
        if (soldItemsHistory.length === 0) {
            noSoldItemsMessage.classList.remove('hidden');
        } else {
            noSoldItemsMessage.classList.add('hidden');
            soldItemsHistory.forEach((item, index) => {
                const soldItemDiv = document.createElement('div');
                soldItemDiv.classList.add('grid', 'grid-cols-7', 'items-center', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
                soldItemDiv.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sold-item-checkbox" data-index="${index}">
                    </div>
                    <div>
                        <h5 class="font-semibold text-gray-800">${item.name}</h5>
                        <p class="text-sm text-gray-500">SKU: ${item.sku}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-500">Quantity</p>
                        <p class="font-semibold text-gray-800">${item.quantity}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-500">Price</p>
                        <p class="font-semibold text-gray-800">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-500">Total</p>
                        <p class="font-semibold text-gray-800">$${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">${new Date(item.saleDate).toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <button class="delete-sold-item-btn text-red-600 hover:text-red-800 transition" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                soldItemsList.appendChild(soldItemDiv);
            });
        }
    };

    soldItemsBtn.addEventListener('click', () => {
        soldItemsModal.classList.remove('hidden');
        renderSoldItems();
    });

    soldItemsModalCloseBtn.addEventListener('click', () => {
        soldItemsModal.classList.add('hidden');
    });

    soldItemsList.addEventListener('click', (e) => {
        const target = e.target.closest('.delete-sold-item-btn');
        if (target) {
            const index = parseInt(target.dataset.index);
            const itemToDelete = soldItemsHistory.splice(index, 1)[0];
            deletedSoldItemsHistory.push({ ...itemToDelete, deletionDate: new Date().toLocaleString() });
            saveInventory();
            renderSoldItems();
            alert(`Sold item "${itemToDelete.name}" deleted.`);
        }
    });

    selectAllSoldItems.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.sold-item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    bulkDeleteSoldItemsBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.sold-item-checkbox:checked');
        if (checkboxes.length === 0) {
            alert("Please select items to delete.");
            return;
        }

        const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        const itemsToDelete = soldItemsHistory.filter((_, index) => indicesToDelete.includes(index));
        
        itemsToDelete.forEach(item => deletedSoldItemsHistory.push({ ...item, deletionDate: new Date().toLocaleString() }));
        soldItemsHistory = soldItemsHistory.filter((_, index) => !indicesToDelete.includes(index));
        
        saveInventory();
        renderSoldItems();
        alert(`${indicesToDelete.length} sold items deleted.`);
    });

    printSoldItemsBtn.addEventListener('click', () => {
        const printableArea = document.getElementById('printable-area');
        printableArea.innerHTML = `
            <h1 class="text-2xl font-bold mb-4">Sold Items History</h1>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${soldItemsHistory.map(item => `
                        <tr>
                            <td class="px-4 py-2">${item.name}</td>
                            <td class="px-4 py-2">${item.sku}</td>
                            <td class="px-4 py-2">${item.quantity}</td>
                            <td class="px-4 py-2">$${item.price.toFixed(2)}</td>
                            <td class="px-4 py-2">$${(item.quantity * item.price).toFixed(2)}</td>
                            <td class="px-4 py-2">${new Date(item.saleDate).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        window.print();
    });

    // --- Deleted Sold Items History Functions ---
    const renderDeletedSoldItems = () => {
        deletedSoldItemsList.innerHTML = '';
        if (deletedSoldItemsHistory.length === 0) {
            noDeletedSoldItemsMessage.classList.remove('hidden');
        } else {
            noDeletedSoldItemsMessage.classList.add('hidden');
            deletedSoldItemsHistory.forEach((item, index) => {
                const deletedSoldItemDiv = document.createElement('div');
                deletedSoldItemDiv.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
                deletedSoldItemDiv.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 deleted-sold-item-checkbox" data-index="${index}">
                        <div>
                            <h5 class="font-semibold text-gray-800">${item.name}</h5>
                            <p class="text-sm text-gray-500">SKU: ${item.sku} | Deleted: ${item.deletionDate}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="restore-sold-item-btn bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition" data-index="${index}">
                            <i class="fas fa-undo"></i> Restore
                        </button>
                        <button class="delete-sold-item-permanently-btn bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition" data-index="${index}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
                deletedSoldItemsList.appendChild(deletedSoldItemDiv);
            });
        }
    };

    deletedSoldItemsBtn.addEventListener('click', () => {
        if (userRole === 'superadmin') {
            deletedSoldItemsModal.classList.remove('hidden');
            renderDeletedSoldItems();
        } else {
            alert("You do not have permission to access this history.");
        }
    });

    deletedSoldItemsModalCloseBtn.addEventListener('click', () => {
        deletedSoldItemsModal.classList.add('hidden');
    });

    deletedSoldItemsList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('restore-sold-item-btn')) {
            const itemToRestore = deletedSoldItemsHistory.splice(index, 1)[0];
            soldItemsHistory.push(itemToRestore);
            saveInventory();
            renderDeletedSoldItems();
            alert(`Deleted sold item "${itemToRestore.name}" restored.`);
        } else if (target.classList.contains('delete-sold-item-permanently-btn')) {
            const itemToDelete = deletedSoldItemsHistory.splice(index, 1)[0];
            saveInventory();
            renderDeletedSoldItems();
            alert(`Sold item "${itemToDelete.name}" permanently deleted.`);
        }
    });

    selectAllDeletedSoldItems.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.deleted-sold-item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    bulkDeleteDeletedSoldItemsBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.deleted-sold-item-checkbox:checked');
        if (checkboxes.length === 0) {
            alert("Please select items to delete.");
            return;
        }

        const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        deletedSoldItemsHistory = deletedSoldItemsHistory.filter((_, index) => !indicesToDelete.includes(index));
        
        saveInventory();
        renderDeletedSoldItems();
        alert(`${indicesToDelete.length} sold items permanently deleted.`);
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

        filteredItems.forEach((item) => {
            const productCard = document.createElement('div');
            productCard.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-3', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');
            productCard.innerHTML = `
                <div>
                    <h5 class="font-semibold text-gray-800">${item.name}</h5>
                    <p class="text-sm text-gray-500">SKU: ${item.sku} | In Stock: ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-green-600">$${parseFloat(item.price).toFixed(2)}</span>
                    <button class="add-to-cart-btn bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed" data-sku="${item.sku}" ${item.quantity === 0 ? 'disabled' : ''}>
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
                    <input type="number" min="1" max="${inventory.find(i => i.sku === cartItem.sku).quantity + cartItem.quantity}" value="${cartItem.quantity}" class="cart-quantity-input w-16 text-center border rounded-md p-1" data-index="${index}">
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

    const addToCart = (sku) => {
        const item = inventory.find(i => i.sku === sku);
        const cartIndex = cart.findIndex(cartItem => cartItem.sku === sku);

        if (cartIndex > -1) {
            if (cart[cartIndex].quantity < item.quantity) {
                cart[cartIndex].quantity++;
            } else {
                alert(`Cannot add more than ${item.quantity} of ${item.name} to the cart.`);
            }
        } else {
            if (item.quantity > 0) {
                cart.push({ ...item, quantity: 1 });
            } else {
                alert(`${item.name} is out of stock.`);
            }
        }
        renderCart();
    };

    const updateCartQuantity = (cartIndex, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(cartIndex);
            return;
        };
        
        const cartItem = cart[cartIndex];
        const inventoryItem = inventory.find(i => i.sku === cartItem.sku);

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
            const inventoryItem = inventory.find(i => i.sku === cartItem.sku);
            if (cartItem.quantity > inventoryItem.quantity) {
                alert(`Cannot process sale. Insufficient stock for ${inventoryItem.name}.`);
                return;
            }
        }

        let totalSaleSubtotal = 0;
        let totalSaleProfit = 0;

        for (const cartItem of cart) {
            const inventoryItem = inventory.find(i => i.sku === cartItem.sku);
            
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

            soldItemsHistory.push({
                ...cartItem,
                saleDate: new Date().toISOString()
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
            const sku = target.dataset.sku;
            addToCart(sku);
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
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('restore-item-btn')) {
            const itemToRestore = deletedItemsHistory.splice(index, 1)[0];
            inventory.push(itemToRestore);
            saveInventory();
            renderInventory();
            renderDeletedItems();
            alert(`Item "${itemToRestore.name}" restored successfully.`);
        } else if (target.classList.contains('delete-item-permanently-btn')) {
            const itemToDelete = deletedItemsHistory.splice(index, 1)[0];
            saveInventory();
            renderDeletedItems();
            alert(`Item "${itemToDelete.name}" permanently deleted.`);
        }
    });

    const saveInventory = () => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('totalRevenue', totalRevenue);
        localStorage.setItem('totalProfit', totalProfit);
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
        localStorage.setItem('deletedItemsHistory', JSON.stringify(deletedItemsHistory));
        localStorage.setItem('soldItemsHistory', JSON.stringify(soldItemsHistory));
        localStorage.setItem('deletedSoldItemsHistory', JSON.stringify(deletedSoldItemsHistory));
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
        const storedSoldItems = localStorage.getItem('soldItemsHistory');
        if (storedSoldItems) {
            soldItemsHistory = JSON.parse(storedSoldItems);
        }
        const storedDeletedSoldItems = localStorage.getItem('deletedSoldItemsHistory');
        if (storedDeletedSoldItems) {
            deletedSoldItemsHistory = JSON.parse(storedDeletedSoldItems);
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
        totalItemsCard.textContent = inventory.reduce((sum, item) => sum + item.quantity, 0);
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
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 inventory-item-checkbox" data-index="${index}">
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.sku}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.supplier}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.location}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">$${parseFloat(item.price).toFixed(2)}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-center text-sm font-medium hidden-print">
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
            inventory[editIndex] = { ...inventory[editIndex], name, sku, description, quantity, location, supplier, cost, price };
            editIndex = -1;
            formTitle.textContent = 'Add New Item';
            formButton.textContent = 'Add Item';
            cancelButton.classList.add('hidden');
        } else {
            inventory.push({ name, sku, description, quantity, location, supplier, cost, price, dateAdded: new Date().toISOString() });
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
        
        soldItemsHistory.push({
            ...item,
            quantity: quantitySold,
            saleDate: new Date().toISOString()
        });

        totalRevenue += revenue;
        totalProfit += profit;
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
        const headers = ["name", "sku", "supplier", "description", "quantity", "location", "cost", "price", "dateAdded"];
        const csvRows = [headers.join(',')];
        for (const item of inventory) {
            const values = headers.map(header => {
                let value = item[header];
                if (header === 'dateAdded' && value) {
                    value = new Date(value).toLocaleDateString();
                }
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
                if (!item.dateAdded) {
                    item.dateAdded = new Date().toISOString();
                }
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

    printInventoryBtn.addEventListener('click', () => {
        const printableArea = document.getElementById('printable-area');
        printableArea.innerHTML = document.getElementById('inventory-container').innerHTML;
        window.print();
    });

    selectAllInventory.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.inventory-item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });

    bulkDeleteInventoryBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.inventory-item-checkbox:checked');
        if (checkboxes.length === 0) {
            alert("Please select items to delete.");
            return;
        }

        const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        const itemsToDelete = inventory.filter((_, index) => indicesToDelete.includes(index));

        itemsToDelete.forEach(item => deletedItemsHistory.push({ ...item, deletionDate: new Date().toLocaleString() }));
        inventory = inventory.filter((_, index) => !indicesToDelete.includes(index));

        saveInventory();
        renderInventory();
        alert(`${indicesToDelete.length} items deleted.`);
    });
    
    resetSiteBtn.addEventListener('click', () => {
        resetSiteConfirmationModal.classList.remove('hidden');
    });

    resetSiteCancelBtn.addEventListener('click', () => {
        resetSiteConfirmationModal.classList.add('hidden');
    });

    resetSiteConfirmBtn.addEventListener('click', () => {
        localStorage.clear();
        inventory = [];
        totalRevenue = 0;
        totalProfit = 0;
        salesHistory = [];
        deletedItemsHistory = [];
        soldItemsHistory = [];
        deletedSoldItemsHistory = [];
        
        renderInventory();
        updateDashboard();
        
        resetSiteConfirmationModal.classList.add('hidden');
        alert("Site has been reset successfully.");
        
        signOut(auth);
    });
});

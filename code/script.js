// === FINAL IMPORTS (Includes everything) ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, increment, setDoc, getDocs, getDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- DOM Elements ---
const allModals = document.querySelectorAll('.modal');
const confirmModal = document.getElementById('confirm-modal');
const confirmOkBtn = document.getElementById('confirm-ok-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
const locationWeatherDisplay = document.getElementById('location-weather-display');
const climateSuggestionToggle = document.getElementById('climate-suggestion-toggle');
const addItemBtn = document.getElementById('add-item-btn');
const pantryList = document.getElementById('pantry-list');
const emptyPantryMsg = document.getElementById('empty-pantry-msg');
const pantryLoader = document.getElementById('pantry-loader');
const itemModal = document.getElementById('item-modal');
const itemForm = document.getElementById('item-form');
const cancelItemBtn = document.getElementById('cancel-item-btn');
const modalTitle = document.getElementById('modal-title');
const saveItemBtn = document.getElementById('save-item-btn');
const highRiskNotification = document.getElementById('high-risk-notification');
const elevatedRiskNotification = document.getElementById('elevated-risk-notification');
const viewRecipesBtn = document.getElementById('view-recipes-btn');
const recipeModal = document.getElementById('recipe-modal');
const closeRecipeBtn = document.getElementById('close-recipe-btn');
const recipeContent = document.getElementById('recipe-content');
const recipePreferences = document.getElementById('recipe-preferences');
const recipeImageContainer = document.getElementById('recipe-image-container');
const recipeTextContainer = document.getElementById('recipe-text-container');
const errorBanner = document.getElementById('error-banner');
const errorMessage = document.getElementById('error-message');
const generateRecipeBtn = document.getElementById('generate-recipe-btn');
const categoryNav = document.getElementById('category-nav');
const feedbackSection = document.getElementById('feedback-section');
const feedbackInput = document.getElementById('feedback-input');
const regenerateRecipeBtn = document.getElementById('regenerate-recipe-btn');
const shareRecipeBtn = document.getElementById('share-recipe-btn');
const feedbackTriggerBtn = document.getElementById('feedback-trigger-btn');
const forecastModal = document.getElementById('forecast-modal');
const forecastContent = document.getElementById('forecast-content');
const closeForecastBtn = document.getElementById('close-forecast-btn');

// Points Elements
const userPointsDisplay = document.getElementById('user-points-display');
const userPointsValue = document.getElementById('user-points-value');
const recipeActionsSection = document.getElementById('recipe-actions-section');
const recipeShareMsg = document.getElementById('recipe-share-msg');
const completeRecipeBtn = document.getElementById('complete-recipe-btn');
const recipeCompleteMsg = document.getElementById('recipe-complete-msg');
const recipePointsAwarded = document.getElementById('recipe-points-awarded');

// Success Modal Elements
const successModal = document.getElementById('success-modal');
const closeSuccessBtn = document.getElementById('close-success-btn');
const savedItemsList = document.getElementById('saved-items-list');

// Community Modal Elements
const browseRecipesBtn = document.getElementById('browse-recipes-btn');
const communityRecipeModal = document.getElementById('community-recipe-modal');
const closeCommunityRecipeBtn = document.getElementById('close-community-recipe-btn');
const communityRecipeList = document.getElementById('community-recipe-list');
const recipeListView = document.getElementById('recipe-list-view');
const recipeDetailView = document.getElementById('recipe-detail-view');
const communityRecipeImage = document.getElementById('community-recipe-image');
const communityRecipeText = document.getElementById('community-recipe-text');
const allBackToListBtns = document.querySelectorAll('.back-to-list-btn');
const itemNameInput = document.getElementById('item-name');
const itemSuggestions = document.getElementById('item-suggestions');

const viewHistoryBtn = document.getElementById('view-history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistoryBtn = document.getElementById('close-history-btn');
const historyList = document.getElementById('history-list');
const historyCount = document.getElementById('history-count');

// --- App State ---
let db;
let pantryItems = [];
let unsubscribePantry = null;
let currentCategory = 'All';
let weatherData = null;
let swRegistration = null; 
const NOTIFIED_ITEMS_KEY = 'notifiedPantryItems'; 
let currentUserId = null; 
let unsubscribeUserProfile = null; 

// Points Constants
const POINTS_ADD_ITEM = 10;
const POINTS_COMPLETE_RECIPE = 50;
const POINTS_SHARE_RECIPE = 25; 

// Current Recipe State
let currentGeneratedRecipe = null; 
let currentRecipeItemIds = [];
let currentRecipeItemNames = []; // Fixed: Variable declared here

// === Pantry Item Dictionary ===
const pantryDictionary = [
    'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberries', 'Blueberries', 'Cantaloupe', 'Cherries', 'Coconut', 'Cranberries', 
    'Dates', 'Figs', 'Grapefruit', 'Grapes', 'Honeydew', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Nectarine', 'Orange', 'Papaya',
    'Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate', 'Raspberries', 'Strawberries', 'Watermelon',
    'Artichoke', 'Arugula', 'Asparagus', 'Beets', 'Bell Pepper', 'Bok Choy', 'Broccoli', 'Brussels Sprouts', 'Cabbage', 'Carrot', 
    'Cauliflower', 'Celery', 'Corn', 'Cucumber', 'Eggplant', 'Garlic', 'Ginger', 'Green Beans', 'Kale', 'Leeks', 'Lettuce', 
    'Mushrooms', 'Onion', 'Parsnips', 'Peas', 'Potato', 'Pumpkin', 'Radish', 'Spinach', 'Squash', 'Sweet Potato', 'Tomato', 'Turnip', 'Zucchini',
    'Bacon', 'Beef (Ground)', 'Beef (Steak)', 'Chicken Breast', 'Chicken Thighs', 'Chicken (Whole)', 'Chorizo', 'Cod', 'Crab',
    'Duck', 'Ham', 'Lamb', 'Lobster', 'Pork Chops', 'Pork (Ground)', 'Prosciutto', 'Salami', 'Salmon', 'Sausage', 'Scallops',
    'Shrimp', 'Tilapia', 'Tofu', 'Tuna (Canned)', 'Tuna (Steak)', 'Turkey (Ground)', 'Turkey (Whole)',
    'Butter', 'Buttermilk', 'Cheese (Bleu)', 'Cheese (Cheddar)', 'Cheese (Cottage)', 'Cheese (Cream)', 'Cheese (Feta)',
    'Cheese (Goat)', 'Cheese (Mozzarella)', 'Cheese (Parmesan)', 'Cheese (Provolone)', 'Cheese (Swiss)', 'Eggs', 'Heavy Cream',
    'Milk', 'Sour Cream', 'Yogurt (Greek)', 'Yogurt (Plain)',
    'Almonds', 'Barley', 'Beans (Black)', 'Beans (Kidney)', 'Beans (Pinto)', 'Bread', 'Bread Crumbs', 'Bulgur',
    'Cereal', 'Chickpeas', 'Cornmeal', 'Couscous', 'Crackers', 'Flour (All-Purpose)', 'Flour (Bread)', 'Flour (Whole Wheat)',
    'Lentils', 'Oats', 'Pasta', 'Peanuts', 'Pecans', 'Popcorn', 'Quinoa', 'Rice (Basmati)', 'Rice (Brown)', 'Rice (White)',
    'Tortillas', 'Walnuts',
    'Apple Cider Vinegar', 'Balsamic Vinegar', 'BBQ Sauce', 'Honey', 'Hot Sauce', 'Jam', 'Jelly', 'Ketchup', 'Maple Syrup',
    'Mayonnaise', 'Mustard (Dijon)', 'Mustard (Yellow)', 'Olive Oil', 'Oyster Sauce', 'Peanut Butter', 'Pickles', 'Relish',
    'Salad Dressing', 'Salsa', 'Sesame Oil', 'Soy Sauce', 'Sriracha', 'Tahini', 'Teriyaki Sauce', 'Vegetable Oil', 'Vinegar (White)', 'Worcestershire Sauce',
    'Basil (Dry)', 'Bay Leaves', 'Black Pepper', 'Cayenne Pepper', 'Chili Powder', 'Cilantro (Dry)', 'Cinnamon', 'Cloves',
    'Cumin', 'Curry Powder', 'Dill (Dry)', 'Garlic Powder', 'Ginger (Ground)', 'Nutmeg', 'Onion Powder', 'Oregano (Dry)',
    'Paprika', 'Parsley (Dry)', 'Red Pepper Flakes', 'Rosemary (Dry)', 'Salt', 'Sugar', 'Brown Sugar', 'Thyme (Dry)', 'Turmeric',
    'Basil (Fresh)', 'Cilantro (Fresh)', 'Dill (Fresh)', 'Mint (Fresh)', 'Parsley (Fresh)', 'Rosemary (Fresh)', 'Thyme (Fresh)',
    'Baking Powder', 'Baking Soda', 'Chocolate Chips', 'Cocoa Powder', 'Cornstarch', 'Vanilla Extract', 'Yeast',
    'Coffee', 'Tea', 'Juice'
];

// --- Firebase & API Config ---
const firebaseConfig = {
    apiKey: "AIzaSyAHo1562nl7ADxADGts-EZj0XbSSMfvs-4",
    authDomain: "zero-waste-app-cc012.firebaseapp.com",
    projectId: "zero-waste-app-cc012",
    storageBucket: "zero-waste-app-cc012.firebasestorage.app",
    messagingSenderId: "945621374683",
    appId: "1:945621374683:web:55145eb88b600aa5c19efe",
    measurementId: "G-5KRLLQLYB8"
};
const googleApiKey = "AIzaSyAHo1562nl7ADxADGts-EZj0XbSSMfvs-4"; 
const unsplashAccessKey = "jWfoUzVxgmyJNlV5TpiSv-S_AdXHcs4TEFftBD3Q3qk";

// --- Utility Functions ---
function showError(message) { errorMessage.textContent = message; errorBanner.classList.remove('hidden'); }
function clearError() { errorBanner.classList.add('hidden'); }

function getRiskCategory(item, currentWeather = null) {
    const expiryDateStr = item.expiryDate;
    if (!expiryDateStr) return { category: 'Unknown', color: 'bg-gray-400', daysLeft: 'No date', elevatedRisk: false };

    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let risk = { category: 'Low Risk', color: 'bg-green-500', daysLeft: `${diffDays} days left`, elevatedRisk: false };

    if (diffDays < 0) {
        risk = { category: 'Expired', color: 'bg-red-700', daysLeft: `Expired ${Math.abs(diffDays)} days ago`, elevatedRisk: false };
    } else if (diffDays <= 3) {
        risk = { category: 'High Risk', color: 'bg-red-500', daysLeft: `${diffDays} day(s) left`, elevatedRisk: false };
    } else if (diffDays <= 7) {
        risk = { category: 'Medium Risk', color: 'bg-yellow-500', daysLeft: `${diffDays} days left`, elevatedRisk: false };

        const isHot = currentWeather?.temperature > 30;
        const weatherCode = currentWeather?.weatherCode;
        const descriptionLower = currentWeather?.description?.toLowerCase() || "";
        const isThunderstormRisk = weatherCode >= 95 || descriptionLower.includes('thunderstorm');
        const isRainyRisk = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 86) || descriptionLower.includes('rain') || descriptionLower.includes('shower');
        const isCloudyRisk = (weatherCode >= 1 && weatherCode <= 3) || descriptionLower.includes('cloudy');

        if (item.needsRefrigeration && (isHot || isThunderstormRisk || isRainyRisk || isCloudyRisk)) {
            risk.color = 'bg-orange-500'; 
            risk.elevatedRisk = true;
        }
    }
    return risk;
}

// --- Modal Control ---
function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    setTimeout(() => {
        modalEl.classList.remove('opacity-0', 'invisible');
        modalEl.querySelector('.modal-content').classList.remove('scale-95');
    }, 10);
}
function closeModal(modalEl) {
    modalEl.classList.add('opacity-0');
    modalEl.querySelector('.modal-content').classList.add('scale-95');
    setTimeout(() => {
        modalEl.classList.add('hidden', 'invisible');
    }, 300);
}

// --- Notification Functions ---
function requestNotificationPermission() {
    if (!('Notification' in window)) { return; }
    Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
            showError("Notifications blocked. You won't receive expiring soon alerts.");
        }
    });
}

function getNotifiedItems() {
    try {
        const notified = localStorage.getItem(NOTIFIED_ITEMS_KEY);
        return notified ? JSON.parse(notified) : {};
    } catch (e) { return {}; }
}

function saveNotifiedItems(notified) {
    try { localStorage.setItem(NOTIFIED_ITEMS_KEY, JSON.stringify(notified)); } catch (e) { }
}

function showExpiringSoonNotification(item, daysLeftNum, riskLevel) {
    if (!swRegistration) return;
    const title = 'Pantry Alert!';
    const options = {
        body: `${item.name} is ${riskLevel === 'Medium' ? 'entering Medium Risk' : 'entering High Risk'} (${daysLeftNum} day${daysLeftNum !== 1 ? 's' : ''} left)!`,
        tag: `item-${item.id}-${riskLevel}`
    };
    swRegistration.showNotification(title, options).catch(err => console.error('Error showing notification:', err));
}

async function checkAndNotifyExpiringItems() {
    if (Notification.permission !== 'granted') return;
    if (!swRegistration) await new Promise(resolve => setTimeout(resolve, 2000));
    if (!swRegistration) return;

    const notifiedItems = getNotifiedItems();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let itemsChanged = false;

    pantryItems.forEach(item => {
        if (!item.expiryDate) return;
        const expiry = new Date(item.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let notificationRiskLevel = null;

        if (diffDays === 8 && notifiedItems[item.id] !== 'Medium') notificationRiskLevel = 'Medium';
        else if (diffDays === 4 && notifiedItems[item.id] !== 'High') notificationRiskLevel = 'High';

        if (notificationRiskLevel) {
            showExpiringSoonNotification(item, diffDays, notificationRiskLevel);
            notifiedItems[item.id] = notificationRiskLevel;
            itemsChanged = true;
        }
    });

    const currentItemIds = new Set(pantryItems.map(item => item.id));
    Object.keys(notifiedItems).forEach(itemId => {
        if (!currentItemIds.has(itemId)) {
            delete notifiedItems[itemId];
            itemsChanged = true;
        }
    });
    if (itemsChanged) saveNotifiedItems(notifiedItems);
}

// --- Render Functions ---
function renderPantry() {
    pantryLoader.style.display = 'none';
    let hasElevatedRiskItems = false;
    const highRiskItems = [];
    const otherItems = [];
    
    pantryItems.forEach(item => {
        const riskInfo = getRiskCategory(item, weatherData);
        if (riskInfo.category === 'High Risk') highRiskItems.push({ ...item, riskInfo });
        else otherItems.push({ ...item, riskInfo });
    });
    highRiskItems.sort((a, b) => (parseInt(a.riskInfo.daysLeft) || 0) - (parseInt(b.riskInfo.daysLeft) || 0));

    // Category Tabs
    const allGroupedItems = pantryItems.reduce((acc, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});
    const allCategories = ['All', ...Object.keys(allGroupedItems).sort()];
    categoryNav.innerHTML = '';
    allCategories.forEach(cat => {
        const tab = document.createElement('button');
        tab.textContent = cat; tab.dataset.category = cat;
        tab.className = `category-tab px-4 py-2 text-sm font-medium border rounded-full transition-all duration-300 ${currentCategory === cat ? 'active' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`;
        categoryNav.appendChild(tab);
    });

    pantryList.innerHTML = '';
    if (pantryItems.length === 0) {
        emptyPantryMsg.classList.remove('hidden');
        pantryList.appendChild(emptyPantryMsg);
        highRiskNotification.classList.add('hidden');
        elevatedRiskNotification.classList.add('hidden');
    } else {
        emptyPantryMsg.classList.add('hidden');
        if (highRiskItems.length > 0) {
            const highRiskHeader = document.createElement('h3');
            highRiskHeader.textContent = 'High Risk Items (Use Soon!)';
            highRiskHeader.className = 'text-xl font-bold mt-4 mb-3 text-red-600 border-b border-red-300 pb-2';
            pantryList.appendChild(highRiskHeader);
            const highRiskGrid = document.createElement('div');
            highRiskGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8';
            pantryList.appendChild(highRiskGrid);
            highRiskItems.forEach(item => {
                const { color, daysLeft } = item.riskInfo;
                const itemElement = document.createElement('div');
                itemElement.className = `flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:border-primary bg-white/80 animate-fade-in`;
                itemElement.innerHTML = `
                    <div class="flex items-center min-w-0">
                        <div class="w-3 h-3 rounded-full flex-shrink-0 mr-3 ${color}"></div>
                        <div class="min-w-0"><p class="font-semibold text-base truncate">${item.name}</p><p class="text-sm text-gray-500">${daysLeft}</p></div>
                    </div>
                    <div class="flex items-center space-x-2 flex-shrink-0 ml-2">
                        <button class="edit-btn p-1 text-gray-400 hover:text-blue-500 transition-colors" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                        <button class="delete-btn p-1 text-gray-400 hover:text-red-600 transition-colors" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>`;
                highRiskGrid.appendChild(itemElement);
            });
        }

        const otherGroupedItems = otherItems.reduce((acc, item) => { const c = item.category || 'General'; if (!acc[c]) acc[c] = []; acc[c].push(item); return acc; }, {});
        const categoriesToDisplay = currentCategory === 'All' ? Object.keys(otherGroupedItems).sort() : [currentCategory];
        let itemsDisplayed = highRiskItems.length;
        categoriesToDisplay.forEach(category => {
            if (otherGroupedItems[category]) {
                const categoryItems = otherGroupedItems[category];
                itemsDisplayed += categoryItems.length;
                if (currentCategory === 'All' || currentCategory === category) {
                    const header = document.createElement('h3');
                    header.textContent = category;
                    const marginTop = (highRiskItems.length > 0 && currentCategory === 'All') ? 'mt-8' : 'mt-6';
                    header.className = `text-xl font-bold ${marginTop} mb-3 text-orange-800 border-b pb-2`;
                    pantryList.appendChild(header);
                    const grid = document.createElement('div');
                    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
                    pantryList.appendChild(grid);
                    const sorted = categoryItems.sort((a, b) => (a.expiryDate ? new Date(a.expiryDate) : Infinity) - (b.expiryDate ? new Date(b.expiryDate) : Infinity));
                    sorted.forEach(item => {
                        const { color, daysLeft, elevatedRisk } = item.riskInfo;
                        if (elevatedRisk) hasElevatedRiskItems = true;
                        const el = document.createElement('div');
                        const border = elevatedRisk ? 'border-orange-500 border-2' : 'border';
                        el.className = `flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary bg-white/80 animate-fade-in ${border}`;
                        el.innerHTML = `<div class="flex items-center min-w-0"><div class="w-3 h-3 rounded-full flex-shrink-0 mr-3 ${color}"></div><div class="min-w-0"><p class="font-semibold text-base truncate">${item.name}</p><p class="text-sm text-gray-500">${daysLeft}</p></div></div><div class="flex items-center space-x-2 flex-shrink-0 ml-2"><button class="edit-btn p-1 text-gray-400 hover:text-blue-500 transition-colors" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button><button class="delete-btn p-1 text-gray-400 hover:text-red-600 transition-colors" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div>`;
                        grid.appendChild(el);
                    });
                }
            }
        });
        if (itemsDisplayed === highRiskItems.length && currentCategory !== 'All' && !otherGroupedItems[currentCategory]) {
            const msg = document.createElement('p');
            msg.textContent = `No items (excluding High Risk) in "${currentCategory}".`;
            msg.className = 'text-center text-gray-500 py-12';
            pantryList.appendChild(msg);
        }
    }
    const hasAnyHighRisk = pantryItems.some(i => getRiskCategory(i, weatherData).category === 'High Risk');
    highRiskNotification.classList.toggle('hidden', !hasAnyHighRisk);
    hasElevatedRiskItems = otherItems.some(i => i.riskInfo.elevatedRisk);
    elevatedRiskNotification.classList.toggle('hidden', !hasElevatedRiskItems);
    checkAndNotifyExpiringItems();
}

// --- Firestore Data Logic ---
async function showConfirmModal(id) {
    openModal(confirmModal);
    return new Promise((resolve) => {
        confirmOkBtn.onclick = () => { closeModal(confirmModal); resolve(true); };
        confirmCancelBtn.onclick = () => { closeModal(confirmModal); resolve(false); };
    });
}
async function handleDelete(id) {
    const confirmed = await showConfirmModal(id);
    if (!confirmed || !currentUserId) return;
    try {
        await deleteDoc(doc(db, 'pantryItems', currentUserId, 'items', id));
    } catch (error) { console.error("Error deleting item:", error); showError("Failed to delete the item."); }
}

async function handleFormSubmit(e) {
    e.preventDefault(); clearError();
    if (!currentUserId) { showError("Not signed in."); return; }
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const expiry = document.getElementById('item-expiry').value;
    const category = document.getElementById('item-category').value;
    const needsRefrigeration = document.getElementById('item-refrigerated').checked;
    if (!name.trim() || !expiry) return;
    const itemsCollection = collection(db, 'pantryItems', currentUserId, 'items');
    const data = { name: name.trim(), expiryDate: expiry, category: category, needsRefrigeration: needsRefrigeration, updatedAt: new Date() };
    try {
        if (id) await updateDoc(doc(itemsCollection, id), data);
        else {
            data.createdAt = new Date();
            await addDoc(itemsCollection, data);
            await awardPoints(currentUserId, POINTS_ADD_ITEM, 'add_new_item');
        }
        closeModal(itemModal);
    } catch (error) { console.error("Error saving item:", error); showError("Failed to save the item."); }
}

// --- Autocomplete ---
function showSuggestions(input) {
    const inputText = input.toLowerCase();
    if (inputText.length < 2) { itemSuggestions.classList.add('hidden'); return; }
    const suggestions = pantryDictionary.filter(item => item.toLowerCase().includes(inputText));
    if (suggestions.length === 0) { itemSuggestions.classList.add('hidden'); return; }
    let html = '';
    suggestions.forEach(suggestion => { html += `<div class="p-2 hover:bg-gray-100 cursor-pointer suggestion-item">${suggestion}</div>`; });
    itemSuggestions.innerHTML = html;
    itemSuggestions.classList.remove('hidden');
}
function selectSuggestion(e) {
    if (e.target.classList.contains('suggestion-item')) {
        itemNameInput.value = e.target.textContent;
        itemSuggestions.classList.add('hidden');
    }
}

// --- Points Logic ---
async function awardPoints(userId, pointsToAdd, reason) {
    if (!userId) return;
    console.log(`Awarding ${pointsToAdd} points to ${userId} for ${reason}`);
    const userProfileRef = doc(db, 'userProfiles', userId);
    try {
        await updateDoc(userProfileRef, { totalPoints: increment(pointsToAdd), lastAwardedAt: new Date() });
    } catch (error) {
        if (error.code === 'not-found') {
            try {
                await setDoc(userProfileRef, { totalPoints: pointsToAdd, userId: userId, joinedAt: new Date(), lastAwardedAt: new Date() });
            } catch (e) { console.error("Error creating user profile:", e); showError("Could not save your points profile."); }
        } else { console.error("Error awarding points:", error); showError("Could not award points."); }
    }
}

function setupUserProfileListener(userId) {
    if (unsubscribeUserProfile) unsubscribeUserProfile();
    const userProfileRef = doc(db, 'userProfiles', userId);
    unsubscribeUserProfile = onSnapshot(userProfileRef, (snapshot) => {
        if (snapshot.exists()) {
            const points = snapshot.data().totalPoints || 0;
            userPointsValue.textContent = points;
            userPointsDisplay.classList.remove('hidden');
        } else {
            userPointsValue.textContent = '0';
            userPointsDisplay.classList.remove('hidden');
        }
    }, (error) => { console.error("User profile error:", error); });
}

function setupPantryListener(userId) {
    if (unsubscribePantry) unsubscribePantry();
    const itemsCollection = collection(db, 'pantryItems', userId, 'items');
    unsubscribePantry = onSnapshot(itemsCollection, (snapshot) => {
        pantryItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPantry();
    }, (error) => { console.error("Firestore snapshot error:", error); showError("Could not fetch pantry items."); });
}

// --- Community Recipes ---
async function loadCommunityRecipes() {
    communityRecipeList.innerHTML = '<div class="loader small-loader mx-auto"></div>';
    try {
        const recipesCollection = collection(db, 'communityRecipes');
        const q = query(recipesCollection, orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            communityRecipeList.innerHTML = '<p class="text-center text-gray-500">No community recipes have been shared yet. Be the first!</p>';
            return;
        }
        let html = '';
        querySnapshot.forEach(doc => {
            const recipe = doc.data();
            const recipeId = doc.id;
            html += `<div class="community-recipe-item"><div><h4 class="text-lg font-semibold text-orange-800">${recipe.title}</h4><p class="text-sm text-gray-600">Shared by: ${recipe.authorName || 'Anonymous'}</p></div><button class="view-recipe-btn" data-id="${recipeId}">View</button></div>`;
        });
        communityRecipeList.innerHTML = html;
    } catch (error) {
        console.error("Error loading recipes:", error);
        communityRecipeList.innerHTML = '<p class="text-center text-red-500">Could not load recipes.</p>';
    }
}

async function showRecipeDetail(recipeId) {
    recipeListView.classList.add('hidden');
    recipeDetailView.classList.remove('hidden');
    communityRecipeImage.innerHTML = '<div class="loader small-loader mx-auto"></div>';
    communityRecipeText.innerHTML = '<div class="loader small-loader mx-auto"></div>';
    try {
        const recipeDoc = await getDoc(doc(db, 'communityRecipes', recipeId));
        if (!recipeDoc.exists()) { showError("Recipe not found."); return; }
        const recipe = recipeDoc.data();
        if (recipe.imageUrl) {
            if (recipe.imageAttribution && recipe.imageAttribution.name) {
                communityRecipeImage.innerHTML = `<figure class="relative w-full h-full"><img src="${recipe.imageUrl}" alt="${recipe.title}" class="w-full h-full object-cover rounded-lg shadow-md"><figcaption class="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Photo by <a href="${recipe.imageAttribution.link}" target="_blank" class="underline">${recipe.imageAttribution.name}</a> on Unsplash</figcaption></figure>`;
            } else { communityRecipeImage.innerHTML = `<img src="${recipe.imageUrl}" alt="${recipe.title}" class="w-full h-full object-cover rounded-lg shadow-md">`; }
        } else { communityRecipeImage.innerHTML = '<span class="text-gray-500">No image provided.</span>'; }
        communityRecipeText.innerHTML = improvedMarkdownToHtml(recipe.recipeMarkdown);
        document.getElementById('community-rating-section').classList.add('hidden');
    } catch (error) { console.error("Error details:", error); showError("Could not load details."); }
}

// --- Weather ---
async function fetchWithRetry(url, retries = 3, initialDelay = 1000) { for (let i = 0; i <= retries; i++) { try { const r = await fetch(url); if (!r.ok) throw new Error(`Fetch fail: ${r.status}`); return r; } catch (e) { if (i === retries) throw e; const d = initialDelay * Math.pow(2, i); await new Promise(res => setTimeout(res, d)); } } }
function getWeatherDescription(code, windSpeed) { let d = "Clear"; if (code === 0) d = "Sunny"; if ([1, 2, 3].includes(code)) d = "Cloudy"; if ([45, 48].includes(code)) d = "Foggy"; if (code >= 51 && code <= 67) d = "Rainy"; if (code >= 71 && code <= 77) d = "Snowy"; if (code >= 80 && code <= 86) d = "Showers"; if (code >= 95) d = "Thunderstorm"; if (windSpeed > 20) return d === "Sunny" ? "Windy" : `${d} & Windy`; return d; }
function renderWeather() {
    let content = '';
    if (weatherData && weatherData.error) { content = `<p class="text-white/90 text-center">${weatherData.error}</p>`; }
    else if (weatherData) {
        const icon = getWeatherIcon(weatherData.weatherCode); let msg = '';
        if (weatherData.rainyDaysAhead > 0) { msg = `<div class="flex items-center gap-2 text-white/90 justify-end"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg><span class="text-sm">Expect ${weatherData.rainyDaysAhead} rainy day${weatherData.rainyDaysAhead > 1 ? 's' : ''} starting tomorrow</span></div>`; }
        content = `<div class="flex items-center justify-between w-full gap-4"><div class="flex items-center gap-4 flex-shrink-0"><div class="flex-shrink-0 scale-110">${icon}</div><div><h3 class="font-bold text-2xl text-white mb-1">${weatherData.city}</h3><p class="text-6xl font-extrabold text-white leading-none">${weatherData.temperature}°C</p></div></div><div class="flex flex-col items-end justify-center gap-3 flex-shrink min-w-0"><div class="text-right"><p class="text-3xl font-bold text-white mb-1">${weatherData.description}</p>${msg}</div><div class="flex gap-2 flex-wrap justify-end"><button onclick="window.showForecastModal()" class="text-xs text-white/80 hover:text-white underline transition-colors">See forecast</button><span class="text-white/40">•</span><button onclick="window.updateLocationManual()" class="text-xs text-white/60 hover:text-white/90 underline transition-colors">Wrong location?</button></div></div></div>`;
    } else { content = `<div class="loader small-loader border-t-white border-l-white mx-auto"></div>`; }
    locationWeatherDisplay.innerHTML = `<div class="bg-gradient-to-br from-sky-500 to-sky-700 text-white p-6 rounded-2xl shadow-2xl">${content}</div>`;
}
function getWeatherIcon(code) { if (code === 0) return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-300"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`; if (code >= 1 && code <= 3) return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`; if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-300"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>`; if (code >= 95) return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><path d="M21.73 18a2.73 2.73 0 0 0-1.25.33 6.66 6.66 0 0 1-3.32-2.3 5.5 5.5 0 0 0-3.3-7.23 4.5 4.5 0 0 0-5-3.5A7 7 0 0 0 4 14.899"></path><path d="m13 12-4 5h6l-4 5"></path></svg>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`; }
async function fetchWeatherForCoords(latitude, longitude, cityName) { try { const r = await fetchWithRetry(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`); const d = await r.json(); const desc = getWeatherDescription(d.current.weather_code, d.current.wind_speed_10m); const rain = d.daily.weather_code.filter((c, i) => i > 0 && (c >= 51 && c <= 67 || c >= 80)).length; weatherData = { temperature: Math.round(d.current.temperature_2m), description: desc, city: cityName, weatherCode: d.current.weather_code, forecast: d.daily, rainyDaysAhead: rain, latitude: latitude, longitude: longitude }; renderWeather(); renderPantry(); } catch (e) { console.error("Weather fetch err:", e); weatherData = { error: "Could not fetch weather." }; renderWeather(); renderPantry(); } }
async function getLocationAndWeather() { renderWeather(); try { const c = localStorage.getItem('userLocation'); if (c) { const u = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(c)}&format=json&limit=1`; const r = await fetchWithRetry(u); const d = await r.json(); if (d && d.length > 0) { await fetchWeatherForCoords(d[0].lat, d[0].lon, c); return; } else { localStorage.removeItem('userLocation'); } } } catch (e) { console.error("Saved loc err:", e); } if (!navigator.geolocation) { weatherData = { error: "Geolocation N/A." }; renderWeather(); renderPantry(); return; } navigator.geolocation.getCurrentPosition(async (p) => { const { latitude, longitude } = p.coords; try { const r = await fetchWithRetry(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`); const d = await r.json(); const city = d.address.city || d.address.town || d.address.village || d.address.county || "Your Area"; await fetchWeatherForCoords(latitude, longitude, city); } catch (e) { await fetchWeatherForCoords(latitude, longitude, "Your Location"); } }, (e) => { weatherData = { error: "Location denied." }; renderWeather(); renderPantry(); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }); }

// --- Recipe Generation ---
function improvedMarkdownToHtml(text) {
    const lines = text.split('\n'); 
    let html = ''; 
    let inOl = false; 
    let inUl = false;
    
    for (const line of lines) {
        if (line.trim() === '') continue;
        
        // Close lists
        if (!line.match(/^\d+\.\s/) && inOl) { html += '</ol>'; inOl = false; }
        if (!line.match(/^\* /) && inUl) { html += '</ul>'; inUl = false; }
        
        // Headers
        if (line.startsWith('## ')) {
            html += `<div class="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg mb-6 shadow-md"><h2 class="text-3xl font-extrabold">${line.substring(3)}</h2></div>`;
        } 
        else if (line.startsWith('### ')) {
            const sT = line.substring(4).trim(); 
            const lT = sT.toLowerCase();
            let iS = ''; 
            let cC = 'bg-gray-100 text-gray-800 border-l-4 border-gray-400';
            if (lT.includes('ingredient')) { 
                cC = 'bg-green-50 text-green-900 border-l-4 border-green-500'; 
                iS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`; 
            }
            else if (lT.includes('instruction') || lT.includes('step')) { 
                cC = 'bg-blue-50 text-blue-900 border-l-4 border-blue-500'; 
                iS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`; 
            }
            else if (lT.includes('description') || lT.includes('about')) { 
                cC = 'bg-amber-50 text-amber-900 border-l-4 border-amber-500'; 
                iS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`; 
            }
            html += `<div class="${cC} p-4 rounded-lg mb-4 mt-6 shadow-sm"><h3 class="text-xl font-bold flex items-center">${iS} ${sT}</h3></div>`;
        } 
        // Ordered Lists
        else if (line.match(/^\d+\.\s/)) {
            if (!inOl) { html += '<ol class="space-y-4 mb-6 ml-2">'; } inOl = true;
            const sN = line.match(/^(\d+)\./)[1]; 
            const sT = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-700">$1</strong>');
            html += `<li class="flex items-start gap-3 p-4 bg-white/95 rounded-lg border border-gray-200 shadow-sm"><span class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">${sN}</span><span class="text-gray-800 leading-relaxed pt-1 font-medium">${sT}</span></li>`;
        } 
        // Unordered Lists
        else if (line.startsWith('* ')) {
            if (!inUl) { html += '<ul class="space-y-2 mb-6 ml-2">'; } inUl = true;
            const iT = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-700">$1</strong>');
            html += `<li class="flex items-start gap-3 p-3 bg-white/90 rounded-lg shadow-sm border border-green-100 hover:bg-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="text-gray-800 font-medium">${iT}</span></li>`;
        } 
        // Paragraphs
        else { 
            html += `<p class="text-gray-800 leading-relaxed mb-4 text-base bg-white/80 p-4 rounded-lg shadow-sm border border-gray-100">${line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')}</p>`; 
        }
    }
    if (inOl) html += '</ol>'; 
    if (inUl) html += '</ul>'; 
    return html;
}

// === UNIVERSAL UPDATED: generateRecipeImage ===
async function generateRecipeImage(searchQuery) {
    recipeImageContainer.innerHTML = '<div class="loader small-loader mx-auto"></div><p class="text-center text-sm text-gray-500 mt-2">Plating your dish...</p>';
    
    let finalQuery = searchQuery.replace(/^ImageSearch:\s*/i, '').replace(/\(.*\)/, '').trim();
    if (!finalQuery.toLowerCase().includes('food')) {
        finalQuery += " food";
    }
    console.log(`Universal Search Query: "${finalQuery}"`);

    async function searchUnsplash(query) {
        if (!unsplashAccessKey) return null;
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Client-ID ${unsplashAccessKey}` } });
            const data = await response.json();
            if (response.ok && data.results && data.results.length > 0) {
                return data.results[0];
            }
        } catch (e) { console.error("Unsplash error:", e); }
        return null;
    }

    let img = await searchUnsplash(finalQuery);
    if (!img) {
        console.log("Search failed. Using generic gourmet fallback.");
        img = await searchUnsplash("gourmet plated food dish high quality"); 
    }

    if (img) {
        const imgUrl = img.urls.regular;
        const attribution = { name: img.user.name, link: img.user.links.html };
        recipeImageContainer.innerHTML = `<figure class="relative w-full h-full"><img src="${imgUrl}" alt="${finalQuery}" class="w-full h-full object-cover rounded-lg shadow-md"><figcaption class="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Photo by <a href="${attribution.link}" target="_blank" class="underline">${attribution.name}</a> on Unsplash</figcaption></figure>`;
        if (currentGeneratedRecipe) {
            currentGeneratedRecipe.imageUrl = imgUrl;
            currentGeneratedRecipe.imageAttribution = attribution;
        }
    } else {
        recipeImageContainer.innerHTML = `<div class="text-center p-4 text-gray-600"><p class="font-bold">Image unavailable</p></div>`;
    }
}

// === UNIVERSAL UPDATE: getRecipeSuggestions ===
async function getRecipeSuggestions() { 
    recipeTextContainer.innerHTML = '<div class="loader small-loader mx-auto"></div>'; 
    recipeImageContainer.innerHTML = `<div class="loader small-loader mx-auto"></div>`; 
    feedbackSection.classList.add('hidden'); 
    feedbackTriggerBtn.classList.add('hidden'); 
    recipePreferences.classList.add('hidden'); 
    recipeContent.classList.remove('hidden'); 
    currentGeneratedRecipe = null; 
    
    const highRiskObjects = pantryItems.filter(i => getRiskCategory(i, weatherData).category === 'High Risk');
    currentRecipeItemIds = highRiskObjects.map(i => i.id);
    currentRecipeItemNames = highRiskObjects.map(i => i.name); 
    const highRiskItems = highRiskObjects.map(i => i.name);

    if (highRiskItems.length === 0) { 
        recipeTextContainer.innerHTML = `<p class="text-center text-gray-500">No high-risk items (0-3 days) found!</p>`; 
        recipeImageContainer.innerHTML = `<span class="text-gray-500">No high-risk items found.</span>`; 
        recipePreferences.classList.remove('hidden'); 
        recipeContent.classList.add('hidden'); 
        return; 
    } 
    
    const other = document.getElementById('other-ingredients').value.trim(); 
    let cuis = document.getElementById('cuisine-type').value; 
    const meal = document.getElementById('meal-type').value; 
    const diet = document.getElementById('dietary-needs').value; 
    const size = document.getElementById('serving-size').value; 
    const fdbk = feedbackInput.value.trim(); 

    if (cuis === 'Any') {
        const worldCuisines = ['Indian', 'Mexican', 'Italian', 'Chinese', 'Thai', 'Mediterranean', 'American', 'Middle Eastern', 'French', 'Japanese'];
        cuis = worldCuisines[Math.floor(Math.random() * worldCuisines.length)];
    }
    const cookingStyles = ['gravy/curry', 'dry roast', 'crispy fried', 'baked', 'stir-fry', 'grilled'];
    const randomStyle = cookingStyles[Math.floor(Math.random() * cookingStyles.length)];
    
    let p = `Expiring ingredients: ${highRiskItems.join(', ')}.`; 
    if (other) p += ` Also have: ${other}.`; 
    p += ` Create a ${randomStyle} dish. Cuisine: ${cuis}.`; 
    if (meal !== 'Any Type') p += ` Meal: ${meal}.`; 
    if (diet !== 'Any') p += ` Diet: ${diet}.`; 
    if (size > 0) p += ` Serves: ${size}.`; 
    if (fdbk) p += ` Feedback: "${fdbk}".`; 
    
    p += `\n\nIMPORTANT FORMATTING INSTRUCTIONS:
    1. Title must be in ENGLISH ONLY.
    2. Start with "## Title"
    3. Use standard markdown for Ingredients and Instructions.
    4. AT THE VERY BOTTOM, strictly add a new line: "ImageSearch: [Visual Tag]".
    
    RULES FOR "ImageSearch" TAG:
    - Do NOT use abstract names like "Grandma's Delight".
    - MUST follow this format: [Main Ingredient] + [Texture/Method] + "Food".
    - Examples:
      - For Roasted Eggs -> "ImageSearch: Boiled Egg Masala Fry Food"
      - For Chicken Curry -> "ImageSearch: Chicken Curry Bowl Food"
      - For Fried Potato -> "ImageSearch: Fried Potato Wedges Food"
      - For Spinach Soup -> "ImageSearch: Spinach Soup Bowl"
    - The ImageSearch tag must describe what the final cooked plate looks like.
    `; 

    const u = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`;
    
    try { 
        const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }) }); 
        const d = await r.json(); 
        if (!r.ok) throw new Error(d?.error?.message || `API fail (${r.status})`); 
        
        const txt = d.candidates?.[0]?.content?.parts?.[0]?.text; 
        if (txt) {
            const titleMatch = txt.match(/^## (.*$)/m);
            const title = (titleMatch && titleMatch[1]) ? titleMatch[1].trim() : 'Unnamed Recipe';
            let imageQuery = title; 
            const imageMatch = txt.match(/ImageSearch:\s*(.*)/i);
            let displayText = txt;

            if (imageMatch && imageMatch[1]) {
                imageQuery = imageMatch[1].trim(); 
                displayText = txt.replace(/ImageSearch:.*$/i, '').trim();
            }

            const authorName = (window.Clerk.user && window.Clerk.user.firstName) ? window.Clerk.user.firstName : 'Anonymous User';
            currentGeneratedRecipe = {
                title: title,
                recipeMarkdown: displayText,
                authorId: currentUserId,
                authorName: authorName,
                createdAt: new Date(),
                imageUrl: null, 
                imageAttribution: null,
                ratings: [],
                averageRating: 0
            };
            saveRecipeToHistory(currentGeneratedRecipe);
            recipeTextContainer.innerHTML = improvedMarkdownToHtml(displayText); 
            generateRecipeImage(imageQuery); 
            
            feedbackTriggerBtn.classList.remove('hidden'); 
            feedbackInput.value = ''; 
            recipeActionsSection.classList.remove('hidden'); 
            recipeCompleteMsg.classList.add('hidden'); 
            completeRecipeBtn.classList.remove('hidden'); 
            completeRecipeBtn.disabled = false; 
            recipeShareMsg.classList.add('hidden'); 
            shareRecipeBtn.classList.remove('hidden'); 
            shareRecipeBtn.disabled = false;
        } else throw new Error("No content from API."); 
    } catch (e) { 
        console.error("Gemini err:", e); 
        recipeTextContainer.innerHTML = `<div class="text-red-500"><p>Recipe fetch failed.</p><pre>${e.message}</pre></div>`; 
        recipeImageContainer.innerHTML = ''; 
    } 
}

// === Sharing Logic ===
async function handleShareRecipe() {
    if (!currentGeneratedRecipe || !currentUserId) { showError("Could not share recipe. Please generate a recipe first."); return; }
    shareRecipeBtn.disabled = true;
    shareRecipeBtn.classList.add('hidden'); 
    recipeShareMsg.classList.remove('hidden'); 
    recipeShareMsg.textContent = 'Sharing...';
    try {
        const recipeToShare = { ...currentGeneratedRecipe, createdAt: new Date() };
        await addDoc(collection(db, 'communityRecipes'), recipeToShare);
        recipeShareMsg.textContent = 'Shared!'; 
        await awardPoints(currentUserId, POINTS_SHARE_RECIPE, 'share_recipe');
    } catch (error) {
        console.error("Error sharing recipe:", error);
        showError("Failed to share the recipe.");
        shareRecipeBtn.disabled = false;
        shareRecipeBtn.classList.remove('hidden'); 
        recipeShareMsg.classList.add('hidden'); 
    }
}

// === Event Listeners ===
addItemBtn.addEventListener('click', () => {
    itemForm.reset();
    document.getElementById('item-id').value = '';
    modalTitle.textContent = 'Add New Item';
    saveItemBtn.textContent = 'Add Item';
    document.getElementById('item-refrigerated').checked = false;
    openModal(itemModal);
});

browseRecipesBtn.addEventListener('click', () => {
    openModal(communityRecipeModal); 
    recipeListView.classList.remove('hidden');
    recipeDetailView.classList.add('hidden');
    loadCommunityRecipes();
});

closeCommunityRecipeBtn.addEventListener('click', () => closeModal(communityRecipeModal));

communityRecipeList.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-recipe-btn')) {
        showRecipeDetail(e.target.dataset.id);
    }
});

allBackToListBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        recipeListView.classList.remove('hidden');
        recipeDetailView.classList.add('hidden');
    });
});

itemNameInput.addEventListener('keyup', () => showSuggestions(itemNameInput.value));
itemSuggestions.addEventListener('click', selectSuggestion);
document.addEventListener('click', (e) => {
    if (e.target.id !== 'item-name' && e.target.id !== 'item-suggestions') {
        itemSuggestions.classList.add('hidden');
    }
});

cancelItemBtn.addEventListener('click', () => closeModal(itemModal));
itemForm.addEventListener('submit', handleFormSubmit);

viewRecipesBtn.addEventListener('click', () => { 
    openModal(recipeModal); 
    recipePreferences.classList.remove('hidden'); 
    recipeContent.classList.add('hidden'); 
    recipeActionsSection.classList.add('hidden');
});

generateRecipeBtn.addEventListener('click', getRecipeSuggestions);
regenerateRecipeBtn.addEventListener('click', getRecipeSuggestions);
shareRecipeBtn.addEventListener('click', handleShareRecipe);
feedbackTriggerBtn.addEventListener('click', () => { feedbackSection.classList.remove('hidden'); feedbackTriggerBtn.classList.add('hidden'); });
closeRecipeBtn.addEventListener('click', () => closeModal(recipeModal));

// === I Made This Button (Cleaned & Fixed) ===
if (completeRecipeBtn) {
    completeRecipeBtn.addEventListener('click', async () => {
        await awardPoints(currentUserId, POINTS_COMPLETE_RECIPE, 'complete_recipe');
        if (window.confetti) {
            window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#16A34A', '#FBBF24', '#EF4444'] });
        }
        if (currentRecipeItemIds.length > 0) {
            const deletePromises = currentRecipeItemIds.map(itemId => {
                const itemRef = doc(db, 'pantryItems', currentUserId, 'items', itemId);
                return deleteDoc(itemRef);
            });
            try { await Promise.all(deletePromises); } catch (e) { console.error(e); }
        }
        if (savedItemsList && currentRecipeItemNames) {
            savedItemsList.textContent = currentRecipeItemNames.join(', ');
        }
        closeModal(recipeModal);
        openModal(successModal);
    });
}

if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
}

pantryList.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn'); const deleteBtn = e.target.closest('.delete-btn');
    if (editBtn) {
        const item = pantryItems.find(p => p.id === editBtn.dataset.id);
        if (item) {
            document.getElementById('item-id').value = item.id;
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-category').value = item.category || 'General';
            document.getElementById('item-expiry').value = item.expiryDate;
            document.getElementById('item-refrigerated').checked = item.needsRefrigeration || false;
            modalTitle.textContent = 'Edit Item';
            saveItemBtn.textContent = 'Save Changes';
            openModal(itemModal);
        }
    } 
    if (deleteBtn) { handleDelete(deleteBtn.dataset.id); }
});

itemModal.addEventListener('click', (e) => { if (e.target === itemModal) closeModal(itemModal); });
categoryNav.addEventListener('click', (e) => { if (e.target.classList.contains('category-tab')) { currentCategory = e.target.dataset.category; renderPantry(); } });
window.updateLocationManual = async function() { const c = weatherData?.city || ""; const n = prompt("Enter city:", c); if (n && n.trim() && n.trim().toLowerCase() !== c.toLowerCase()) { const t = n.trim(); try { localStorage.setItem('userLocation', t); console.log(`Loc updated: ${t}. Refetching...`); await getLocationAndWeather(); } catch (e) { showError("Could not save location."); } } };

window.showForecastModal = function() { if (!weatherData || !weatherData.forecast) { showError("Forecast N/A."); return; } forecastContent.innerHTML = ''; const d = weatherData.forecast; if (!d.time || !d.weather_code || !d.temperature_2m_max || !d.temperature_2m_min || d.time.length === 0) { forecastContent.innerHTML = '<p class="text-red-500 col-span-5">Forecast err.</p>'; openModal(forecastModal); return; } for (let i = 0; i < Math.min(d.time.length, 5); i++) { const dt = new Date(d.time[i]); const day = i === 0 ? "Today" : dt.toLocaleDateString('en-US', { weekday: 'short' }); const icon = getWeatherIcon(d.weather_code[i]); const max = Math.round(d.temperature_2m_max[i]); const min = Math.round(d.temperature_2m_min[i]); const el = document.createElement('div'); el.className = 'flex flex-col items-center p-3 bg-gray-100 rounded-lg'; el.innerHTML = `<p class="font-bold text-sm mb-2">${day}</p><div class="scale-75 mb-2">${icon}</div><p class="font-semibold">${max}°</p><p class="text-sm text-gray-500">${min}°</p>`; forecastContent.appendChild(el); } openModal(forecastModal); }
if (closeForecastBtn) closeForecastBtn.addEventListener('click', () => closeModal(forecastModal));
if (forecastModal) forecastModal.addEventListener('click', (e) => { if (e.target === forecastModal) closeModal(forecastModal); });

window.startApp = (userId) => {
    console.log("Starting app for user:", userId);
    currentUserId = userId; 
    const userButtonDiv = document.getElementById('user-button-container');
    if (userButtonDiv) { window.Clerk.mountUserButton(userButtonDiv); }
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        setupPantryListener(currentUserId); 
        setupUserProfileListener(currentUserId);
        getLocationAndWeather();
        setTimeout(() => { if (Notification.permission === 'default') { requestNotificationPermission(); } }, 3000);
    } catch (e) { console.error("Initialization Error:", e); showError("Failed to initialize."); pantryLoader.style.display = 'none'; }
};

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('service-worker.js')
    .then(swReg => { console.log('Service Worker registered.', swReg); swRegistration = swReg; })
    .catch(error => console.error('Service Worker Error', error));
} 
else { console.warn('Push messaging is not supported.'); }

// 1. Function to Save Recipe to History (Called automatically)
async function saveRecipeToHistory(recipeData) {
    if (!currentUserId) return;
    try {
        // Save to a sub-collection: users/{userId}/recipeHistory
        const historyRef = collection(db, 'pantryItems', currentUserId, 'recipeHistory');
        // Add timestamp
        await addDoc(historyRef, {
            ...recipeData,
            savedAt: new Date()
        });
        console.log("Recipe saved to history.");
    } catch (e) {
        console.error("Error saving history:", e);
    }
}

// 2. Function to Load History
async function loadRecipeHistory() {
    historyList.innerHTML = '<div class="loader small-loader mx-auto mt-10"></div>';
    
    try {
        const historyRef = collection(db, 'pantryItems', currentUserId, 'recipeHistory');
        // Order by newest first
        const q = query(historyRef, orderBy("savedAt", "desc"), limit(50));
        const snapshot = await getDocs(q);
        
        // Update the Counter
        historyCount.textContent = snapshot.size;

        if (snapshot.empty) {
            historyList.innerHTML = `
                <div class="text-center py-10 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <p>No history yet. Generate a recipe!</p>
                </div>`;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            // Format date nicely
            const date = data.savedAt ? new Date(data.savedAt.seconds * 1000).toLocaleDateString() : 'Unknown Date';
            
            html += `
                <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-all group">
                    <div>
                        <h4 class="font-bold text-lg text-gray-800 group-hover:text-amber-700 transition-colors">${data.title}</h4>
                        <p class="text-xs text-gray-500">Generated on ${date}</p>
                    </div>
                    <button class="view-history-item-btn bg-white text-amber-600 border border-amber-200 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors shadow-sm" 
                        data-title="${data.title}" 
                        data-markdown="${encodeURIComponent(data.recipeMarkdown)}"
                        data-img="${data.imageUrl || ''}">
                        View Again
                    </button>
                </div>
            `;
        });
        historyList.innerHTML = html;

    } catch (e) {
        console.error("Error loading history:", e);
        historyList.innerHTML = '<p class="text-red-500 text-center">Failed to load history.</p>';
    }
}

// 3. Event Listeners
if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', () => {
        openModal(historyModal);
        loadRecipeHistory();
    });
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => closeModal(historyModal));
}

// Handle clicking "View Again" inside the list
historyList.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-history-item-btn')) {
        const btn = e.target;
        const title = btn.dataset.title;
        const markdown = decodeURIComponent(btn.dataset.markdown);
        const imgUrl = btn.dataset.img;

        // Reuse the main Recipe Modal to show details
        // We "fake" a currentGeneratedRecipe object so the logic works
        currentGeneratedRecipe = {
            title: title,
            recipeMarkdown: markdown,
            imageUrl: imgUrl,
            // Disable "I Made This" buttons for history view to prevent cheating/errors
            isHistoryView: true 
        };

        recipeTextContainer.innerHTML = improvedMarkdownToHtml(markdown);
        
        if (imgUrl && imgUrl !== 'undefined') {
            recipeImageContainer.innerHTML = `<figure class="relative w-full h-full"><img src="${imgUrl}" class="w-full h-full object-cover rounded-lg shadow-md"></figure>`;
        } else {
            generateRecipeImage(title); // Try to find image again if missing
        }

        // Hide Action Buttons for History View (optional, or keep them to allow sharing)
        recipeActionsSection.classList.add('hidden'); 
        feedbackTriggerBtn.classList.add('hidden');

        closeModal(historyModal);
        openModal(recipeModal);
        recipeContent.classList.remove('hidden');
        recipePreferences.classList.add('hidden');
    }
});
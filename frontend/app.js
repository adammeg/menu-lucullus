// API Configuration
const API_URL = 'http://localhost:5000/api';
//test
// new one 
let menuData = {};
let promotionsData = [];

// DOM Elements
const menuContent = document.getElementById('menu-content');
const promoModal = document.getElementById('promoModal');
const promotionsPosterModal = document.getElementById('promotionsPosterModal');
const promotionPosterImage = document.getElementById('promotionPosterImage');
const promoTitle = document.getElementById('promo-title');
const promoDescription = document.getElementById('promo-description');
const promoDiscountText = document.getElementById('promo-discount-text');
const promoItemName = document.getElementById('promo-item-name');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadPromotions();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Close buttons for promotion modal
    const closeBtns = document.querySelectorAll('.close-btn, .poster-close-btn, .poster-backdrop');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target.classList.contains('close-btn')) {
                const modal = event.target.closest('.modal');
                if (modal) modal.style.display = 'none';
            } else {
                // Close poster modal
                if (promotionsPosterModal) {
                    promotionsPosterModal.classList.remove('show');
                    promotionsPosterModal.style.display = 'none';
                }
            }
        });
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (promotionsPosterModal && promotionsPosterModal.classList.contains('show')) {
                promotionsPosterModal.classList.remove('show');
                promotionsPosterModal.style.display = 'none';
            }
            if (promoModal) promoModal.style.display = 'none';
        }
    });
}

// Load menu data from API
async function loadMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        menuData = data;
        displayMenu();
    } catch (error) {
        console.error('Error loading menu:', error);
        menuContent.innerHTML = '<p class="error">Unable to load menu. Please try again later.</p>';
    }
}

// Display menu with accordion structure
function displayMenu() {
    if (!menuContent || Object.keys(menuData).length === 0) return;

    menuContent.innerHTML = '';

    // Get categories in order
    const categoryOrder = [
        'LES ENTRÉES',
        'SÉLECTION CARNÉE',
        'DÉLICES MARINS',
        'LES PÂTES',
        'À PARTAGER',
        'LES DESSERTS',
        'LES VINS',
        'BIÈRES & SOFTS',
        'SPIRITUEUX',
        'LES COCKTAILS'
    ];

    let categoryIndex = 0;

    categoryOrder.forEach((category) => {
        if (menuData[category]) {
            const items = menuData[category];
            categoryIndex++;

            // Create accordion category container
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'accordion-category';

            // Create category header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'category-header';

            const headerContent = document.createElement('div');
            headerContent.className = 'category-header-content';

            const categoryNumber = document.createElement('span');
            categoryNumber.className = 'category-number';
            categoryNumber.textContent = `${categoryIndex} –`;

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;

            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'category-toggle';
            toggleIcon.textContent = '+';

            headerContent.appendChild(categoryNumber);
            headerContent.appendChild(categoryTitle);

            headerDiv.appendChild(headerContent);
            headerDiv.appendChild(toggleIcon);

            // Create items container
            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'category-items';

            // Add menu items
            items.forEach((item) => {
                const itemElement = createMenuItemElement(item);
                itemsDiv.appendChild(itemElement);
            });

            categoryDiv.appendChild(headerDiv);
            categoryDiv.appendChild(itemsDiv);

            // Expand first category by default
            if (categoryIndex === 1) {
                categoryDiv.classList.add('active');
                toggleIcon.textContent = '−';
            }

            // Add click listener for accordion toggle
            headerDiv.addEventListener('click', () => {
                toggleCategory(categoryDiv, toggleIcon);
            });

            menuContent.appendChild(categoryDiv);
        }
    });
}

// Toggle category accordion
function toggleCategory(categoryDiv, toggleIcon) {
    const isActive = categoryDiv.classList.contains('active');

    // Close all other categories
    document.querySelectorAll('.accordion-category').forEach((cat) => {
        if (cat !== categoryDiv && cat.classList.contains('active')) {
            cat.classList.remove('active');
            cat.querySelector('.category-toggle').textContent = '+';
        }
    });

    // Toggle current category
    if (isActive) {
        categoryDiv.classList.remove('active');
        toggleIcon.textContent = '+';
    } else {
        categoryDiv.classList.add('active');
        toggleIcon.textContent = '−';
    }
}

// Create menu item element
function createMenuItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    if (item.promotion_id) {
        itemDiv.classList.add('on-promotion');
    }

    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name-section';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = item.name;

    const descSpan = document.createElement('span');
    descSpan.className = 'item-description';
    descSpan.textContent = item.description || '';

    nameDiv.appendChild(nameSpan);
    if (item.description) {
        nameDiv.appendChild(descSpan);
    }

    const priceDiv = document.createElement('div');
    priceDiv.className = 'item-price-section';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'item-price';
    priceSpan.textContent = `${item.price} DT`;

    priceDiv.appendChild(priceSpan);

    if (item.promotion_id) {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'promotion-badge';
        badgeSpan.textContent = '★ Promotion';
        priceDiv.appendChild(badgeSpan);

        // Add click listener to show promotion details
        itemDiv.addEventListener('click', () => {
            showPromoModal(item);
        });
        itemDiv.style.cursor = 'pointer';
    }

    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(priceDiv);

    return itemDiv;
}

// Load promotions from API
async function loadPromotions() {
    try {
        const response = await fetch(`${API_URL}/promotions`);
        promotionsData = await response.json();
        displayPromotionsBanner();
    } catch (error) {
        console.error('Error loading promotions:', error);
    }
}

// Display promotions banner/poster
function displayPromotionsBanner() {
    if (promotionsData.length > 0 && promotionsPosterModal) {
        const promo = promotionsData[0];
        
        // Show poster after a short delay so page loads smoothly
        setTimeout(() => {
            // If promotion has an image, display it
            if (promo.image_url && promo.image_url.trim()) {
                promotionPosterImage.src = promo.image_url;
                promotionPosterImage.onerror = () => {
                    // If image fails to load, hide the modal
                    console.warn('Failed to load promotion image');
                    promotionsPosterModal.classList.remove('show');
                    promotionsPosterModal.style.display = 'none';
                };
                promotionsPosterModal.classList.add('show');
                promotionsPosterModal.style.display = 'flex';
            }
        }, 800);
    }
}

// Show promotion modal
function showPromoModal(item) {
    if (!promoModal) return;

    promoTitle.textContent = item.name || 'Promotion';
    promoDescription.textContent = item.description || 'Profitez de cette offre exclusive!';
    promoDiscountText.textContent = 'Offre Spéciale';
    promoItemName.textContent = `${item.price} DT`;
    
    promoModal.style.display = 'block';
}

// Close modal
function closeModal() {
    if (promoModal) {
        promoModal.style.display = 'none';
    }
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    loadMenu();
    loadPromotions();
}, 5 * 60 * 1000);

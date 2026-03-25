// Admin Dashboard JavaScript
const API_URL = 'http://localhost:5000/api';

let allMenuItems = [];
let allCategories = [];
let allPromotions = [];
let currentEditingItemId = null;
let currentEditingPromoId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupNavigation();
    setupTime();
    loadCategories();
    
    // Setup modal close handlers
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

// Load all dashboard data
async function loadDashboardData() {
    try {
        await Promise.all([
            loadMenuItems(),
            loadPromotions(),
            updateStats()
        ]);
        populateDashboard();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading data', 'error');
    }
}

// Load menu items
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) throw new Error('Failed to load menu items');
        
        const groupedData = await response.json();
        allMenuItems = [];
        
        Object.entries(groupedData).forEach(([category, items]) => {
            items.forEach(item => {
                item.category_name = category;
                allMenuItems.push(item);
            });
        });
        
        refreshMenuTable();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        
        allCategories = await response.json();
        
        // Populate category selects
        const categorySelect = document.getElementById('item-category');
        const promoItemSelect = document.getElementById('promo-item');
        
        categorySelect.innerHTML = '<option value="">Sélectionner une catégorie...</option>';
        promoItemSelect.innerHTML = '<option value="">Appliquer à tous</option>';
        
        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
        
        // Populate filter
        const filterSelect = document.getElementById('category-filter');
        filterSelect.innerHTML = '<option value="">Filtrer par catégorie...</option>';
        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            filterSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load promotions
async function loadPromotions() {
    try {
        const response = await fetch(`${API_URL}/promotions`);
        if (!response.ok) throw new Error('Failed to load promotions');
        
        allPromotions = await response.json();
        refreshPromotionsTable();
    } catch (error) {
        console.error('Error loading promotions:', error);
    }
}

// Update stats
async function updateStats() {
    try {
        document.getElementById('total-items').textContent = allMenuItems.length;
        document.getElementById('total-promos').textContent = allPromotions.length;
        document.getElementById('total-categories').textContent = allCategories.length;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Populate dashboard with recent promotions
function populateDashboard() {
    const recentPromosDiv = document.getElementById('recent-promos');
    
    if (allPromotions.length === 0) {
        recentPromosDiv.innerHTML = '<p class="empty-state">Pas de promotions actives</p>';
        return;
    }
    
    const recent = allPromotions.slice(0, 5);
    recentPromosDiv.innerHTML = recent.map(promo => `
        <div class="recent-item">
            <div>
                <div class="recent-item-title">${promo.title}</div>
                <small>${promo.item_name || 'Tous les articles'}</small>
            </div>
            <span class="recent-item-discount">
                ${promo.discount_percent ? promo.discount_percent + '%' : promo.discount_amount + ' DT'}
            </span>
        </div>
    `).join('');
}

// Refresh menu table
function refreshMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    
    if (allMenuItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucun article</td></tr>';
        return;
    }
    
    tbody.innerHTML = allMenuItems.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category_name || 'N/A'}</td>
            <td>${item.price} DT</td>
            <td>${item.description || '-'}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editMenuItem(${item.id})">Éditer</button>
                <button class="btn btn-sm btn-delete" onclick="deleteMenuItem(${item.id})">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// Refresh promotions table
function refreshPromotionsTable() {
    const tbody = document.getElementById('promos-table-body');
    
    if (allPromotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Aucune promotion</td></tr>';
        return;
    }
    
    tbody.innerHTML = allPromotions.map(promo => `
        <tr>
            <td>${promo.title}</td>
            <td>${promo.discount_percent ? promo.discount_percent + '%' : promo.discount_amount + ' DT'}</td>
            <td>${promo.item_name || 'Tous'}</td>
            <td>${formatDate(promo.start_date)}</td>
            <td>${formatDate(promo.end_date)}</td>
            <td>
                <span class="status-${promo.is_active ? 'active' : 'inactive'}">
                    ${promo.is_active ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editPromotion(${promo.id})">Éditer</button>
                <button class="btn btn-sm btn-delete" onclick="deletePromotion(${promo.id})">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// Menu Item Operations
function openAddItemModal() {
    currentEditingItemId = null;
    document.getElementById('item-modal-title').textContent = 'Ajouter Article';
    document.getElementById('item-form').reset();
    document.getElementById('item-id').value = '';
    openModal('itemModal');
}

function editMenuItem(id) {
    const item = allMenuItems.find(m => m.id === id);
    if (!item) return;
    
    currentEditingItemId = id;
    document.getElementById('item-modal-title').textContent = 'Éditer Article';
    document.getElementById('item-id').value = id;
    document.getElementById('item-category').value = item.category_id || '';
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-description').value = item.description || '';
    document.getElementById('item-price').value = item.price;
    
    openModal('itemModal');
}

async function saveMenuItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('item-id').value;
    const category_id = document.getElementById('item-category').value;
    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const price = parseFloat(document.getElementById('item-price').value);
    
    if (!category_id || !name || !price) {
        showNotification('Tous les champs requis doivent être remplis', 'error');
        return;
    }
    
    try {
        let url = `${API_URL}/admin/menu-items`;
        let method = 'POST';
        let body = { category_id, name, description, price };
        
        if (id) {
            url += `/${id}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) throw new Error('Failed to save menu item');
        
        showNotification(id ? 'Article mis à jour' : 'Article ajouté', 'success');
        closeModal('itemModal');
        loadMenuItems();
    } catch (error) {
        console.error('Error saving menu item:', error);
        showNotification('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article?')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/menu-items/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete menu item');
        
        showNotification('Article supprimé', 'success');
        loadMenuItems();
    } catch (error) {
        console.error('Error deleting menu item:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Promotion Operations
function openAddPromoModal() {
    currentEditingPromoId = null;
    document.getElementById('promo-modal-title').textContent = 'Ajouter Promotion';
    document.getElementById('promo-form').reset();
    document.getElementById('promo-id').value = '';
    
    // Clear image fields
    document.getElementById('promo-image').value = '';
    document.getElementById('promo-image-base64').value = '';
    document.getElementById('promo-image-preview').innerHTML = '';
    document.getElementById('promo-image-preview').classList.remove('has-image');
    
    // Populate item select
    const itemSelect = document.getElementById('promo-item');
    itemSelect.innerHTML = '<option value="">Appliquer à tous</option>';
    allMenuItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.price} DT)`;
        itemSelect.appendChild(option);
    });
    
    openModal('promoModal');
}

function editPromotion(id) {
    const promo = allPromotions.find(p => p.id === id);
    if (!promo) return;
    
    currentEditingPromoId = id;
    document.getElementById('promo-modal-title').textContent = 'Éditer Promotion';
    document.getElementById('promo-id').value = id;
    document.getElementById('promo-title').value = promo.title;
    document.getElementById('promo-description').value = promo.description || '';
    document.getElementById('promo-item').value = promo.item_id || '';
    document.getElementById('promo-percent').value = promo.discount_percent || '';
    document.getElementById('promo-amount').value = promo.discount_amount || '';
    document.getElementById('promo-start').value = formatDateForInput(promo.start_date);
    document.getElementById('promo-end').value = formatDateForInput(promo.end_date);
    
    // Load image if exists
    if (promo.image_url) {
        document.getElementById('promo-image-base64').value = promo.image_url;
        const preview = document.getElementById('promo-image-preview');
        const img = document.createElement('img');
        img.src = promo.image_url;
        preview.innerHTML = '';
        preview.appendChild(img);
        preview.classList.add('has-image');
    } else {
        document.getElementById('promo-image-base64').value = '';
        document.getElementById('promo-image-preview').innerHTML = '';
        document.getElementById('promo-image-preview').classList.remove('has-image');
    }
    
    // Populate item select
    const itemSelect = document.getElementById('promo-item');
    itemSelect.innerHTML = '<option value="">Appliquer à tous</option>';
    allMenuItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.price} DT)`;
        itemSelect.appendChild(option);
    });
    itemSelect.value = promo.item_id || '';
    
    openModal('promoModal');
}

async function savePromotion(event) {
    event.preventDefault();
    
    const id = document.getElementById('promo-id').value;
    const title = document.getElementById('promo-title').value;
    const description = document.getElementById('promo-description').value;
    const item_id = document.getElementById('promo-item').value || null;
    const discount_percent = parseFloat(document.getElementById('promo-percent').value) || null;
    const discount_amount = parseFloat(document.getElementById('promo-amount').value) || null;
    const start_date = document.getElementById('promo-start').value || null;
    const end_date = document.getElementById('promo-end').value || null;
    const image_base64 = document.getElementById('promo-image-base64').value || null;
    
    if (!title || (!discount_percent && !discount_amount)) {
        showNotification('Titre et réduction sont requis', 'error');
        return;
    }
    
    try {
        let url = `${API_URL}/admin/promotions`;
        let method = 'POST';
        let body = { 
            item_id: item_id ? parseInt(item_id) : null,
            category_id: null,
            title, 
            description, 
            discount_percent, 
            discount_amount, 
            start_date, 
            end_date,
            image_url: image_base64
        };
        
        if (id) {
            url += `/${id}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        showNotification(id ? 'Promotion mise à jour' : 'Promotion ajoutée', 'success');
        closeModal('promoModal');
        loadPromotions();
        loadMenuItems(); // Refresh to show updated promotions on items
    } catch (error) {
        console.error('Error saving promotion:', error);
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

async function deletePromotion(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion?')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/promotions/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete promotion');
        
        showNotification('Promotion supprimée', 'success');
        loadPromotions();
    } catch (error) {
        console.error('Error deleting promotion:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Filter menu items
function filterMenuItems() {
    const categoryId = document.getElementById('category-filter').value;
    
    if (!categoryId) {
        refreshMenuTable();
    } else {
        const filtered = allMenuItems.filter(item => item.category_id == categoryId);
        const tbody = document.getElementById('menu-table-body');
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucun article dans cette catégorie</td></tr>';
            return;
        }
        
        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.category_name || 'N/A'}</td>
                <td>${item.price} DT</td>
                <td>${item.description || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="editMenuItem(${item.id})">Éditer</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteMenuItem(${item.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
    }
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    // Set active nav button
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'menu': 'Gestion du Menu',
        'promotions': 'Gestion des Promotions'
    };
    document.getElementById('section-title').textContent = titles[sectionName] || 'Dashboard';
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Utilities
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
}

function setupTime() {
    const updateTime = () => {
        const now = new Date();
        document.getElementById('current-time').textContent = 
            now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function showNotification(message, type = 'info') {
    // Simple notification (you can replace with a better notification system)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Preview promotion image
function previewPromoImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('promo-image-preview');
    const base64Input = document.getElementById('promo-image-base64');
    
    if (file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Le fichier doit être une image (JPG, PNG, GIF)', 'error');
            event.target.value = '';
            preview.innerHTML = '';
            preview.classList.remove('has-image');
            base64Input.value = '';
            return;
        }
        
        // Always compress all images to JPEG for small file size
        compressImage(file, base64Input, preview);
    } else {
        preview.innerHTML = '';
        preview.classList.remove('has-image');
        base64Input.value = '';
    }
}

// Compress image for smaller file size
function compressImage(file, base64Input, preview) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        // Set canvas size (max 1200x800)
        let width = img.width;
        let height = img.height;
        let quality = 0.8;
        
        if (width > 1200 || height > 800) {
            const ratio = Math.min(1200 / width, 800 / height);
            width = width * ratio;
            height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try to compress with decreasing quality until under 1MB
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        while (compressedBase64.length > 1 * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        base64Input.value = compressedBase64;
        
        // Show file size info
        const sizeKB = Math.round(compressedBase64.length / 1024);
        const qualityPercent = Math.round(quality * 100);
        
        // Display preview
        const previewImg = document.createElement('img');
        previewImg.src = compressedBase64;
        preview.innerHTML = '';
        preview.appendChild(previewImg);
        
        // Add file size info below preview
        const sizeInfo = document.createElement('small');
        sizeInfo.style.display = 'block';
        sizeInfo.style.marginTop = '5px';
        sizeInfo.style.color = '#999';
        sizeInfo.textContent = `Compressée: ${sizeKB}KB (qualité: ${qualityPercent}%)`;
        preview.appendChild(sizeInfo);
        
        preview.classList.add('has-image');
    };
    
    img.onerror = () => {
        showNotification('Erreur lors du chargement de l\'image', 'error');
    };
    
    img.src = URL.createObjectURL(file);
}

// Logout function
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
        // In a real app, you would handle logout properly
        window.location.href = 'login.html';
    }
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    loadDashboardData();
}, 5 * 60 * 1000);

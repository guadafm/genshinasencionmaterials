// Global variables
let materialItems = [];
let currentFilter = 'all';
let draggedElement = null;
let editingItemId = null;

// Default materials templates 
const DEFAULT_MATERIALS = {
  ascension: {
    character: {
      4: [
        { name: 'Character EXP Material', required: 171, image: '', obtained: 0 },
        { name: 'Elemental Gem', required: 46, image: '', obtained: 0 },
        { name: 'Local Specialty', required: 168, image: '', obtained: 0 },
        { name: 'Common Enemy Drop', required: 18, image: '', obtained: 0 }
      ],
      5: [
        { name: 'Character EXP Material', required: 171, image: '', obtained: 0 },
        { name: 'Elemental Gem', required: 46, image: '', obtained: 0 },
        { name: 'Local Specialty', required: 168, image: '', obtained: 0 },
        { name: 'Common Enemy Drop', required: 18, image: '', obtained: 0 },
        { name: 'Boss Material', required: 46, image: '', obtained: 0 }
      ]
    },
    weapon: {
      4: [
        { name: 'Weapon EXP Material', required: 605, image: '', obtained: 0 },
        { name: 'Weapon Ascension Material', required: 15, image: '', obtained: 0 },
        { name: 'Common Enemy Drop', required: 23, image: '', obtained: 0 }
      ],
      5: [
        { name: 'Weapon EXP Material', required: 605, image: '', obtained: 0 },
        { name: 'Weapon Ascension Material', required: 15, image: '', obtained: 0 },
        { name: 'Elite Enemy Drop', required: 23, image: '', obtained: 0 },
        { name: 'Weekly Boss Material', required: 6, image: '', obtained: 0 }
      ]
    }
  },
  talent: [
    { name: 'Talent Book', required: 114, image: '', obtained: 0 },
    { name: 'Common Enemy Drop', required: 18, image: '', obtained: 0 },
    { name: 'Weekly Boss Material', required: 18, image: '', obtained: 0 },
    { name: 'Crown of Insight', required: 3, image: '', obtained: 0 }
  ]
};

// Función para capitalizar texto
function capitalizeWords(text) {
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

function initializeApp() {
  loadFromLocalStorage();
  renderMaterials();
  setupEventListeners();
  setupDragAndDrop();
  setupFileInput();
  updateItemCounts();
  console.log('App initialized successfully');
}

// Load and save data
function loadFromLocalStorage() {
  const saved = localStorage.getItem('materialItems');
  if (saved) {
    try {
      materialItems = JSON.parse(saved);
      console.log('Data loaded from localStorage');
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      materialItems = [];
    }
  } else {
    materialItems = [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('materialItems', JSON.stringify(materialItems));
    console.log('Data saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// File input setup
function setupFileInput() {
  const fileInput = document.getElementById('imageFile');
  const fileLabel = document.querySelector('.file-input-label');
  const filePreview = document.getElementById('filePreview');
  const previewImage = document.getElementById('previewImage');
  const fileName = document.getElementById('fileName');

  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file (JPG, PNG, SVG, etc.)');
          fileInput.value = '';
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          fileName.textContent = file.name;
          filePreview.style.display = 'block';
          fileLabel.classList.add('has-file');
          fileLabel.innerHTML = '<span>📷 Change Image</span>';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderMaterials();
    });
  });

  // Add button
  const addButton = document.getElementById('addButton');
  if (addButton) {
    addButton.addEventListener('click', function() {
      showAddModal();
    });
  }

  // Modal events
  setupModalEvents();

  // Type change event for showing/hiding element selector and material options
  const typeSelect = document.getElementById('itemType');
  const elementSelect = document.getElementById('itemElement');
  const levelSelector = document.getElementById('levelSelector');
  const talentMaterialsLabel = document.getElementById('talentMaterialsLabel');

  if (typeSelect) {
    typeSelect.addEventListener('change', function() {
      if (this.value === 'character') {
        elementSelect.style.display = 'block';
        elementSelect.required = true;
        levelSelector.style.display = 'block';
        talentMaterialsLabel.style.display = 'block';
      } else if (this.value === 'weapon') {
        elementSelect.style.display = 'none';
        elementSelect.required = false;
        levelSelector.style.display = 'block';
        talentMaterialsLabel.style.display = 'none';
        document.getElementById('talentMaterials').checked = false;
      } else {
        elementSelect.style.display = 'none';
        levelSelector.style.display = 'none';
        talentMaterialsLabel.style.display = 'none';
      }
    });
  }
}

function setupModalEvents() {
  const modal = document.getElementById('addModal');
  const form = document.getElementById('addForm');
  const cancelBtn = document.getElementById('cancelButton');
  const editMaterialsModal = document.getElementById('editMaterialsModal');
  const saveMaterialsBtn = document.getElementById('saveMaterialsButton');
  const cancelMaterialsBtn = document.getElementById('cancelMaterialsButton');

  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideAddModal);
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideAddModal();
      }
    });
  }

  if (editMaterialsModal) {
    editMaterialsModal.addEventListener('click', function(e) {
      if (e.target === editMaterialsModal) {
        hideEditMaterialsModal();
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const fileInput = document.getElementById('imageFile');
      const previewImage = document.getElementById('previewImage');
      
      const itemData = {
        name: formData.get('name').trim(),
        type: formData.get('type'),
        rarity: parseInt(formData.get('rarity')),
        element: formData.get('element') || null,
        imageUrl: fileInput.files[0] ? previewImage.src : getDefaultImage(formData.get('type')),
        notes: formData.get('notes').trim(),
        currentLevel: formData.get('currentLevel') ? parseInt(formData.get('currentLevel')) : 1,
        targetLevel: formData.get('targetLevel') ? parseInt(formData.get('targetLevel')) : 90,
        includeAscension: formData.get('ascensionMaterials') === 'on',
        includeTalent: formData.get('talentMaterials') === 'on'
      };
      
      if (itemData.name && itemData.type && itemData.rarity) {
        if (editingItemId) {
          updateItem(itemData);
        } else {
          addItem(itemData);
        }
        hideAddModal();
        resetForm();
      } else {
        alert('Please fill in all required fields (Name, Type, Rarity)');
      }
    });
  }

  // Materials editor events
  if (saveMaterialsBtn) {
    saveMaterialsBtn.addEventListener('click', saveMaterialsChanges);
  }

  if (cancelMaterialsBtn) {
    cancelMaterialsBtn.addEventListener('click', hideEditMaterialsModal);
  }
}

function getDefaultImage(type) {
  if (type === 'character') {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle fill="%23e5a6b2" cx="50" cy="50" r="40"/><text y="60" x="50" text-anchor="middle" fill="white" font-size="30">👤</text></svg>';
  } else {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5a6b2" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="white" font-size="30">⚔️</text></svg>';
  }
}

// Modal functions
function showAddModal(itemId = null) {
  const modal = document.getElementById('addModal');
  const modalTitle = document.getElementById('modalTitle');
  const submitButton = document.getElementById('submitButton');

  if (itemId) {
    editingItemId = itemId;
    const item = materialItems.find(item => item.id === itemId);
    if (item) {
      modalTitle.textContent = 'Edit Item';
      submitButton.textContent = 'Update Item';
      populateForm(item);
    }
  } else {
    editingItemId = null;
    modalTitle.textContent = 'Add New Item';
    submitButton.textContent = 'Add Item';
    resetForm();
  }

  modal.classList.add('show');
}

function hideAddModal() {
  const modal = document.getElementById('addModal');
  modal.classList.remove('show');
  editingItemId = null;
}

function populateForm(item) {
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemType').value = item.type;
  document.getElementById('itemRarity').value = item.rarity;
  document.getElementById('itemElement').value = item.element || '';
  document.getElementById('itemNotes').value = item.notes || '';
  document.getElementById('currentLevel').value = item.currentLevel || 1;
  document.getElementById('targetLevel').value = item.targetLevel || 90;
  document.getElementById('ascensionMaterials').checked = item.includeAscension !== false;
  document.getElementById('talentMaterials').checked = item.includeTalent || false;

  // Trigger type change event to show/hide fields
  const typeEvent = new Event('change');
  document.getElementById('itemType').dispatchEvent(typeEvent);

  // Handle image
  if (item.imageUrl && !item.imageUrl.startsWith('data:image/svg+xml')) {
    const previewImage = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    const fileLabel = document.querySelector('.file-input-label');

    previewImage.src = item.imageUrl;
    fileName.textContent = 'Current image';
    filePreview.style.display = 'block';
    fileLabel.classList.add('has-file');
    fileLabel.innerHTML = '<span>📷 Change Image</span>';
  }
}

function resetForm() {
  const form = document.getElementById('addForm');
  const fileInput = document.getElementById('imageFile');
  const fileLabel = document.querySelector('.file-input-label');
  const filePreview = document.getElementById('filePreview');

  form.reset();
  if (fileInput) fileInput.value = '';
  if (filePreview) filePreview.style.display = 'none';
  if (fileLabel) {
    fileLabel.classList.remove('has-file');
    fileLabel.innerHTML = '<span>📷 Choose Image (JPG, PNG, SVG...)</span>';
  }

  // Hide optional fields
  document.getElementById('itemElement').style.display = 'none';
  document.getElementById('levelSelector').style.display = 'none';
  document.getElementById('talentMaterialsLabel').style.display = 'none';
}

// Materials editor modal
function showEditMaterialsModal(itemId) {
  const modal = document.getElementById('editMaterialsModal');
  const item = materialItems.find(item => item.id === itemId);
  
  if (!item) return;

  editingItemId = itemId;
  renderMaterialsEditor(item);
  modal.classList.add('show');
}

function hideEditMaterialsModal() {
  const modal = document.getElementById('editMaterialsModal');
  modal.classList.remove('show');
  editingItemId = null;
}

function renderMaterialsEditor(item) {
  const container = document.getElementById('materialsEditor');
  container.innerHTML = '';

  item.materials.forEach((material, index) => {
    const materialDiv = document.createElement('div');
    materialDiv.className = 'material-editor-item';
    materialDiv.innerHTML = `
      <div class="material-editor-header">
        <h4>Material ${index + 1}</h4>
        <button type="button" class="btn-delete-material" data-index="${index}">🗑️</button>
      </div>
      <div class="material-editor-fields">
        <input type="text" placeholder="Material Name" value="${material.name}" data-field="name" data-index="${index}">
        <input type="number" placeholder="Required" value="${material.required}" min="0" data-field="required" data-index="${index}">
        <input type="number" placeholder="Obtained" value="${material.obtained}" min="0" data-field="obtained" data-index="${index}">
        <input type="url" placeholder="Image URL (optional)" value="${material.image}" data-field="image" data-index="${index}">
      </div>
    `;
    container.appendChild(materialDiv);
  });

  // Add new material button
  const addMaterialDiv = document.createElement('div');
  addMaterialDiv.className = 'add-material-section';
  addMaterialDiv.innerHTML = `
    <button type="button" class="btn-primary" id="addMaterialButton">Add New Material</button>
  `;
  container.appendChild(addMaterialDiv);

  // Setup event listeners for materials editor
  setupMaterialsEditorEvents();
}

function setupMaterialsEditorEvents() {
  const container = document.getElementById('materialsEditor');

  // Input change events
  container.addEventListener('input', function(e) {
    if (e.target.matches('input[data-field]')) {
      const index = parseInt(e.target.dataset.index);
      const field = e.target.dataset.field;
      const value = field === 'required' || field === 'obtained' ? parseInt(e.target.value) || 0 : e.target.value;
      
      const item = materialItems.find(item => item.id === editingItemId);
      if (item && item.materials[index]) {
        item.materials[index][field] = value;
      }
    }
  });

  // Delete material events
  container.addEventListener('click', function(e) {
    if (e.target.matches('.btn-delete-material')) {
      const index = parseInt(e.target.dataset.index);
      const item = materialItems.find(item => item.id === editingItemId);
      if (item) {
        item.materials.splice(index, 1);
        renderMaterialsEditor(item);
      }
    }
  });

  // Add material event
  const addMaterialBtn = document.getElementById('addMaterialButton');
  if (addMaterialBtn) {
    addMaterialBtn.addEventListener('click', function() {
      const item = materialItems.find(item => item.id === editingItemId);
      if (item) {
        item.materials.push({
          name: 'New Material',
          required: 0,
          obtained: 0,
          image: ''
        });
        renderMaterialsEditor(item);
      }
    });
  }
}

function saveMaterialsChanges() {
  saveToLocalStorage();
  renderMaterials();
  hideEditMaterialsModal();
}

// Add/Edit/Delete items
function addItem(itemData) {
  const newItem = {
    id: Date.now() + Math.random(),
    name: itemData.name,
    type: itemData.type,
    rarity: itemData.rarity,
    element: itemData.element,
    imageUrl: itemData.imageUrl,
    notes: itemData.notes,
    currentLevel: itemData.currentLevel,
    targetLevel: itemData.targetLevel,
    completed: false,
    materials: generateMaterials(itemData)
  };

  materialItems.push(newItem);
  saveToLocalStorage();
  renderMaterials();
  updateItemCounts();
  console.log('New item added:', newItem);
}

function updateItem(itemData) {
  const itemIndex = materialItems.findIndex(item => item.id === editingItemId);
  if (itemIndex !== -1) {
    materialItems[itemIndex] = {
      ...materialItems[itemIndex],
      name: itemData.name,
      type: itemData.type,
      rarity: itemData.rarity,
      element: itemData.element,
      imageUrl: itemData.imageUrl,
      notes: itemData.notes,
      currentLevel: itemData.currentLevel,
      targetLevel: itemData.targetLevel
    };
    
    saveToLocalStorage();
    renderMaterials();
    updateItemCounts();
    console.log('Item updated');
  }
}

function deleteItem(itemId) {
  if (confirm('Are you sure you want to delete this item?')) {
    materialItems = materialItems.filter(item => item.id !== itemId);
    saveToLocalStorage();
    renderMaterials();
    updateItemCounts();
    console.log('Item deleted:', itemId);
  }
}

function generateMaterials(itemData) {
  let materials = [];
  
  // Add ascension materials
  if (itemData.includeAscension) {
    const ascensionMaterials = DEFAULT_MATERIALS.ascension[itemData.type][itemData.rarity];
    materials = materials.concat(JSON.parse(JSON.stringify(ascensionMaterials)));
  }
  
  // Add talent materials (only for characters)
  if (itemData.includeTalent && itemData.type === 'character') {
    const talentMaterials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS.talent));
    materials = materials.concat(talentMaterials);
  }
  
  return materials;
}

// Render functions
function renderMaterials() {
  const inProgressContainer = document.getElementById('inProgressContainer');
  const completedContainer = document.getElementById('completedContainer');
  
  inProgressContainer.innerHTML = '';
  completedContainer.innerHTML = '';

  const filteredItems = filterItems(materialItems);
  
  filteredItems.forEach(item => {
    const itemElement = createMaterialItemElement(item);
    if (item.completed) {
      completedContainer.appendChild(itemElement);
    } else {
      inProgressContainer.appendChild(itemElement);
    }
  });

  updateItemCounts();
}

function filterItems(items) {
  return items.filter(item => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'in-progress') return !item.completed;
    if (currentFilter === 'completed') return item.completed;
    if (currentFilter === 'character-5') return item.type === 'character' && item.rarity === 5;
    if (currentFilter === 'character-4') return item.type === 'character' && item.rarity === 4;
    if (currentFilter === 'weapon-5') return item.type === 'weapon' && item.rarity === 5;
    if (currentFilter === 'weapon-4') return item.type === 'weapon' && item.rarity === 4;
    if (['pyro', 'hydro', 'dendro', 'geo', 'cryo', 'anemo', 'electro'].includes(currentFilter)) {
      return item.element === currentFilter;
    }
    return false;
  });
}

function createMaterialItemElement(item) {
  const div = document.createElement('div');
  div.className = `material-item ${item.completed ? 'completed' : ''}`;
  div.dataset.itemId = item.id;
  div.draggable = true;

  const completedMaterials = item.materials.filter(m => m.obtained >= m.required).length;
  const totalMaterials = item.materials.length;
  const progressPercentage = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  div.innerHTML = `
    <div class="drag-handle">⋮⋮</div>
    
    <img src="${item.imageUrl}" alt="${item.name}" class="item-image" onerror="this.src='${getDefaultImage(item.type)}'">
    
    <div class="item-content">
      <div class="item-header">
        <div class="item-title">
          <h3 class="item-name ${item.completed ? 'completed' : ''}">${item.name}</h3>
          <div class="level-selectors">
            <select class="level-select" data-field="currentLevel" data-item-id="${item.id}">
              ${[1, 20, 40, 50, 60, 70, 80, 90].map(level => 
                `<option value="${level}" ${level === item.currentLevel ? 'selected' : ''}>${level}</option>`
              ).join('')}
            </select>
            <span class="level-arrow">→</span>
            <select class="level-select" data-field="targetLevel" data-item-id="${item.id}">
              ${[20, 40, 50, 60, 70, 80, 90].map(level => 
                `<option value="${level}" ${level === item.targetLevel ? 'selected' : ''}>${level}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        
        <div class="item-meta">
          <span class="item-rarity">${'★'.repeat(item.rarity)}</span>
          <span class="item-tag">${capitalizeWords(item.type)}</span>
          ${item.element ? `<span class="item-element">${capitalizeWords(item.element)}</span>` : ''}
        </div>
      </div>

      <div class="materials-grid">
        ${item.materials.map(material => `
          <div class="material-slot">
            ${material.image ? `<img src="${material.image}" alt="${material.name}" class="material-image">` : '<div class="material-image"></div>'}
            <div class="material-name">${material.name}</div>
            <div class="material-count ${material.obtained >= material.required ? 'complete' : 'incomplete'}">
              ${material.obtained}/${material.required}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="item-actions">
        <div class="completion-controls">
          <label class="checkbox-label">
            <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleCompletion(${item.id})">
            Mark as completed
          </label>
          <span class="progress-indicator">${completedMaterials}/${totalMaterials} materials (${progressPercentage}%)</span>
        </div>
        
        <div class="action-buttons">
          <button class="btn-edit-materials" onclick="showEditMaterialsModal(${item.id})">Edit Materials</button>
          <button class="btn-edit" onclick="showAddModal(${item.id})">Edit</button>
          <button class="btn-delete" onclick="deleteItem(${item.id})">🗑️</button>
        </div>
      </div>
      
      ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
    </div>
  `;

  return div;
}

function updateItemCounts() {
  const inProgressCount = materialItems.filter(item => !item.completed).length;
  const completedCount = materialItems.filter(item => item.completed).length;

  const inProgressCountElement = document.getElementById('inProgressCount');
  const completedCountElement = document.getElementById('completedCount');

  if (inProgressCountElement) {
    inProgressCountElement.textContent = `${inProgressCount} item${inProgressCount !== 1 ? 's' : ''}`;
  }

  if (completedCountElement) {
    completedCountElement.textContent = `${completedCount} item${completedCount !== 1 ? 's' : ''}`;
  }
}

// Toggle completion
function toggleCompletion(itemId) {
  const item = materialItems.find(item => item.id === itemId);
  if (item) {
    item.completed = !item.completed;
    saveToLocalStorage();
    renderMaterials();
  }
}

// Level selectors handling
document.addEventListener('change', function(e) {
  if (e.target.matches('.level-select')) {
    const itemId = parseInt(e.target.dataset.itemId);
    const field = e.target.dataset.field;
    const value = parseInt(e.target.value);
    
    const item = materialItems.find(item => item.id === itemId);
    if (item) {
      item[field] = value;
      
      // Ensure currentLevel doesn't exceed targetLevel
      if (field === 'currentLevel' && value >= item.targetLevel) {
        item.targetLevel = value === 90 ? 90 : value + 10;
        renderMaterials(); // Re-render to update target level selector
      } else if (field === 'targetLevel' && value <= item.currentLevel) {
        item.currentLevel = value === 1 ? 1 : Math.max(1, value - 10);
        renderMaterials(); // Re-render to update current level selector
      }
      
      saveToLocalStorage();
    }
  }
});

// Drag and Drop functionality
function setupDragAndDrop() {
  const containers = [
    document.getElementById('inProgressContainer'),
    document.getElementById('completedContainer')
  ];

  containers.forEach(container => {
    if (!container) return;

    container.addEventListener('dragover', function(e) {
      e.preventDefault();
      container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', function(e) {
      if (!container.contains(e.relatedTarget)) {
        container.classList.remove('drag-over');
      }
    });

    container.addEventListener('drop', function(e) {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      if (draggedElement) {
        const itemId = parseInt(draggedElement.dataset.itemId);
        const item = materialItems.find(item => item.id === itemId);
        
        if (item) {
          const shouldComplete = container.id === 'completedContainer';
          if (item.completed !== shouldComplete) {
            item.completed = shouldComplete;
            saveToLocalStorage();
            renderMaterials();
          }
        }
      }
    });
  });

  // Setup drag events on material items (will be called after rendering)
  document.addEventListener('dragstart', function(e) {
    if (e.target.matches('.material-item')) {
      draggedElement = e.target;
      e.target.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', function(e) {
    if (e.target.matches('.material-item')) {
      e.target.classList.remove('dragging');
      draggedElement = null;
      
      // Remove drag-over class from all containers
      document.querySelectorAll('.materials-container').forEach(container => {
        container.classList.remove('drag-over');
      });
    }
  });
}
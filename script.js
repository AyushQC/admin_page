// Configuration
const API_BASE_URL = 'https://collegeapi-mnni.onrender.com';

// Global variables
let currentUser = null;
let currentEditingId = null;
let allColleges = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const exportBtn = document.getElementById('exportBtn');
const navBtns = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const collegesList = document.getElementById('collegesList');
const collegeForm = document.getElementById('collegeForm');
const searchInput = document.getElementById('searchInput');
const districtFilter = document.getElementById('districtFilter');
const addProgramBtn = document.getElementById('addProgram');
const programsContainer = document.getElementById('programsContainer');
const cancelEditBtn = document.getElementById('cancelEdit');
const formTitle = document.getElementById('formTitle');
const loadingOverlay = document.getElementById('loadingOverlay');
const messageContainer = document.getElementById('messageContainer');

// Utility Functions
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function getAuthHeaders() {
    if (!currentUser) return {};
    
    const credentials = btoa(`${currentUser.username}:${currentUser.password}`);
    return {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
    };
}

async function makeAPIRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check your credentials.');
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return response;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Authentication Functions
function login(username, password) {
    currentUser = { username, password };
    localStorage.setItem('adminAuth', JSON.stringify(currentUser));
    
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    
    loadColleges();
    showMessage('Logged in successfully!', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('adminAuth');
    
    adminSection.style.display = 'none';
    loginSection.style.display = 'flex';
    
    // Reset form and data
    collegeForm.reset();
    cancelEdit();
    allColleges = [];
    
    showMessage('Logged out successfully!', 'info');
}

function checkSavedAuth() {
    const saved = localStorage.getItem('adminAuth');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            // Validate credentials by making a test request
            validateAuth();
        } catch (error) {
            localStorage.removeItem('adminAuth');
        }
    }
}

async function validateAuth() {
    try {
        await makeAPIRequest('/colleges');
        loginSection.style.display = 'none';
        adminSection.style.display = 'block';
        loadColleges();
    } catch (error) {
        logout();
    }
}

// College Management Functions
async function loadColleges() {
    try {
        showLoading();
        
        // Use public endpoint for listing colleges
        const response = await fetch(`${API_BASE_URL}/colleges`);
        if (!response.ok) {
            throw new Error('Failed to load colleges');
        }
        
        allColleges = await response.json();
        displayColleges(allColleges);
        showMessage(`Loaded ${allColleges.length} colleges`, 'success');
        
    } catch (error) {
        console.error('Error loading colleges:', error);
        showMessage(`Error loading colleges: ${error.message}`, 'error');
        collegesList.innerHTML = '<div class="loading">Failed to load colleges</div>';
    } finally {
        hideLoading();
    }
}

function displayColleges(colleges) {
    if (!colleges.length) {
        collegesList.innerHTML = '<div class="loading">No colleges found</div>';
        return;
    }
    
    collegesList.innerHTML = colleges.map(college => `
        <div class="college-card" data-id="${college._id}">
            <h3>${college.name}</h3>
            <div class="district">${college.district}</div>
            <div class="address">${college.address}</div>
            
            ${college.programs && college.programs.length ? `
                <div class="programs">
                    <h4>Programs (${college.programs.length}):</h4>
                    <div class="program-list">
                        ${college.programs.map(p => p.name).join(', ')}
                    </div>
                </div>
            ` : ''}
            
            ${college.contact ? `
                <div class="contact">
                    ${college.contact.phone ? `<span><i class="fas fa-phone"></i> ${college.contact.phone}</span>` : ''}
                    ${college.contact.email ? `<span><i class="fas fa-envelope"></i> ${college.contact.email}</span>` : ''}
                    ${college.contact.website ? `<span><i class="fas fa-globe"></i> ${college.contact.website}</span>` : ''}
                </div>
            ` : ''}
            
            ${college.facilities && college.facilities.length ? `
                <div class="facilities">
                    <strong>Facilities:</strong> ${college.facilities.join(', ')}
                </div>
            ` : ''}
            
            <div class="college-actions">
                <button class="btn btn-edit btn-edit-college" data-id="${college._id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-delete-college" data-id="${college._id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.btn-edit-college').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const collegeId = e.target.closest('[data-id]').dataset.id;
            editCollege(collegeId);
        });
    });
    
    document.querySelectorAll('.btn-delete-college').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const collegeId = e.target.closest('[data-id]').dataset.id;
            deleteCollege(collegeId);
        });
    });
}

function filterColleges() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDistrict = districtFilter.value;
    
    let filtered = allColleges.filter(college => {
        const matchesSearch = !searchTerm || 
            college.name.toLowerCase().includes(searchTerm) ||
            college.address.toLowerCase().includes(searchTerm) ||
            (college.programs && college.programs.some(p => 
                p.name.toLowerCase().includes(searchTerm)
            ));
        
        const matchesDistrict = !selectedDistrict || 
            college.district === selectedDistrict;
        
        return matchesSearch && matchesDistrict;
    });
    
    displayColleges(filtered);
}

async function saveCollege(collegeData) {
    try {
        showLoading();
        
        let response;
        if (currentEditingId) {
            // Update existing college
            response = await makeAPIRequest(`/colleges/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(collegeData)
            });
            showMessage('College updated successfully!', 'success');
        } else {
            // Create new college
            response = await makeAPIRequest('/colleges', {
                method: 'POST',
                body: JSON.stringify(collegeData)
            });
            showMessage('College added successfully!', 'success');
        }
        
        // Reset form and reload colleges
        collegeForm.reset();
        cancelEdit();
        await loadColleges();
        
        // Switch back to list view
        switchSection('list');
        
    } catch (error) {
        console.error('Error saving college:', error);
        showMessage(`Error saving college: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

async function editCollege(collegeId) {
    try {
        showLoading();
        
        // Get college details using admin endpoint
        const college = await makeAPIRequest(`/colleges/${collegeId}`);
        
        // Populate form with college data
        document.getElementById('collegeName').value = college.name || '';
        document.getElementById('collegeDistrict').value = college.district || '';
        document.getElementById('collegeAddress').value = college.address || '';
        document.getElementById('googleMapsLink').value = college.location?.googleMapsLink || '';
        document.getElementById('mapEmbedUrl').value = college.location?.mapEmbedUrl || '';
        document.getElementById('phone').value = college.contact?.phone || '';
        document.getElementById('email').value = college.contact?.email || '';
        document.getElementById('website').value = college.contact?.website || '';
        
        // Clear existing programs
        programsContainer.innerHTML = '';
        
        // Add programs
        if (college.programs && college.programs.length) {
            college.programs.forEach(program => {
                addProgramItem(program);
            });
        } else {
            addProgramItem();
        }
        
        // Set facilities
        document.querySelectorAll('input[name="facilities"]').forEach(checkbox => {
            checkbox.checked = college.facilities && college.facilities.includes(checkbox.value);
        });
        
        // Set editing state
        currentEditingId = collegeId;
        formTitle.textContent = 'Edit College';
        cancelEditBtn.style.display = 'inline-flex';
        
        // Switch to add section
        switchSection('add');
        showMessage('College loaded for editing', 'info');
        
    } catch (error) {
        console.error('Error loading college for edit:', error);
        showMessage(`Error loading college: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteCollege(collegeId) {
    if (!confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
        return;
    }
    
    try {
        showLoading();
        
        await makeAPIRequest(`/colleges/${collegeId}`, {
            method: 'DELETE'
        });
        
        showMessage('College deleted successfully!', 'success');
        await loadColleges();
        
    } catch (error) {
        console.error('Error deleting college:', error);
        showMessage(`Error deleting college: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

function cancelEdit() {
    currentEditingId = null;
    formTitle.textContent = 'Add New College';
    cancelEditBtn.style.display = 'none';
    collegeForm.reset();
    
    // Reset programs to default single item
    programsContainer.innerHTML = '';
    addProgramItem();
}

async function exportColleges() {
    try {
        showLoading();
        
        const response = await makeAPIRequest('/colleges/export');
        
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'colleges-export.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showMessage('Excel file downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting colleges:', error);
        showMessage(`Error exporting colleges: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

// Form Functions
function addProgramItem(program = {}) {
    const programDiv = document.createElement('div');
    programDiv.className = 'program-item';
    programDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Program Name *</label>
                <input type="text" name="programName" value="${program.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Cutoff</label>
                <input type="number" name="cutoff" value="${program.cutoff || ''}" min="0" max="100">
            </div>
            <div class="form-group">
                <label>Eligibility</label>
                <input type="text" name="eligibility" value="${program.eligibility || ''}">
            </div>
            <div class="form-group">
                <label>Medium</label>
                <select name="medium">
                    <option value="English" ${program.medium === 'English' ? 'selected' : ''}>English</option>
                    <option value="Kannada" ${program.medium === 'Kannada' ? 'selected' : ''}>Kannada</option>
                    <option value="Both" ${program.medium === 'Both' ? 'selected' : ''}>Both</option>
                </select>
            </div>
            <button type="button" class="btn btn-danger remove-program">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add remove functionality
    programDiv.querySelector('.remove-program').addEventListener('click', () => {
        programDiv.remove();
        // Ensure at least one program item remains
        if (programsContainer.children.length === 0) {
            addProgramItem();
        }
    });
    
    programsContainer.appendChild(programDiv);
}

function collectFormData() {
    const formData = new FormData(collegeForm);
    
    // Basic information
    const collegeData = {
        name: formData.get('name'),
        district: formData.get('district'),
        address: formData.get('address'),
        location: {
            googleMapsLink: formData.get('googleMapsLink') || '',
            mapEmbedUrl: formData.get('mapEmbedUrl') || ''
        },
        contact: {
            phone: formData.get('phone') || '',
            email: formData.get('email') || '',
            website: formData.get('website') || ''
        },
        programs: [],
        facilities: formData.getAll('facilities')
    };
    
    // Collect programs
    const programItems = programsContainer.querySelectorAll('.program-item');
    programItems.forEach(item => {
        const name = item.querySelector('[name="programName"]').value;
        if (name.trim()) {
            const program = {
                name: name.trim(),
                cutoff: parseInt(item.querySelector('[name="cutoff"]').value) || 0,
                eligibility: item.querySelector('[name="eligibility"]').value || '',
                medium: item.querySelector('[name="medium"]').value || 'English'
            };
            collegeData.programs.push(program);
        }
    });
    
    return collegeData;
}

function switchSection(sectionName) {
    // Update navigation
    navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionName);
    });
    
    // Update content sections
    contentSections.forEach(section => {
        section.classList.toggle('active', section.id === sectionName + 'Section');
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved authentication
    checkSavedAuth();
    
    // Login form
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            showLoading();
            loginError.style.display = 'none';
            
            // Test authentication with API
            const testUser = { username, password };
            const credentials = btoa(`${username}:${password}`);
            
            const response = await fetch(`${API_BASE_URL}/colleges`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });
            
            if (response.ok) {
                login(username, password);
            } else {
                throw new Error('Invalid credentials');
            }
            
        } catch (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
        } finally {
            hideLoading();
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', logout);
    
    // Export button
    exportBtn.addEventListener('click', exportColleges);
    
    // Navigation buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.dataset.section);
        });
    });
    
    // Search and filter
    searchInput.addEventListener('input', filterColleges);
    districtFilter.addEventListener('change', filterColleges);
    
    // College form
    collegeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const collegeData = collectFormData();
        saveCollege(collegeData);
    });
    
    // Add program button
    addProgramBtn.addEventListener('click', () => addProgramItem());
    
    // Cancel edit button
    cancelEditBtn.addEventListener('click', () => {
        cancelEdit();
        switchSection('list');
    });
    
    // Initialize with one program item
    addProgramItem();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    // Handle navigation state if needed
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    // Save any important state if needed
});

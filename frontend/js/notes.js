// Notes Management - CRUD Operations with Firestore
import { auth, db } from './firebase-config.js';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot,
    where,
    getDoc
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';
import { showError, setLoading, formatDate } from './utils.js';

let currentUser = null;
let currentNoteId = null;
let notesUnsubscribe = null;
let currentView = 'grid'; // 'grid' or 'list'

// ===== AUTH CHECK =====
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }

    currentUser = user;

    // Update user info in UI
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userDisplayName = document.getElementById('user-display-name');

    if (userName) userName.textContent = user.displayName || 'User';
    if (userEmail) userEmail.textContent = user.email;
    if (userDisplayName) userDisplayName.textContent = user.displayName || 'User';

    // Check if viewing a shared note
    const urlParams = new URLSearchParams(window.location.search);
    const shareToken = urlParams.get('share');
    
    if (shareToken) {
        // Load the shared note
        loadSharedNote(shareToken);
    } else {
        // Load user's own notes
        loadNotes();
    }
});

// ===== LOAD NOTES FROM FIRESTORE =====
function loadNotes() {
    const loadingState = document.getElementById('loading-state');
    const notesContainer = document.getElementById('notes-container');
    const emptyState = document.getElementById('empty-state');

    if (loadingState) loadingState.style.display = 'block';
    if (notesContainer) notesContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'none';

    if (!currentUser) return;

    // Reference to user's notes collection
    const notesRef = collection(db, 'users', currentUser.uid, 'notes');
    const notesQuery = query(notesRef, orderBy('createdAt', 'desc'));

    // Real-time listener
    notesUnsubscribe = onSnapshot(notesQuery,
        (snapshot) => {
            if (loadingState) loadingState.style.display = 'none';

            if (snapshot.empty) {
                if (emptyState) emptyState.style.display = 'block';
                if (notesContainer) notesContainer.innerHTML = '';
                updateNotesCount(0);
                return;
            }

            if (emptyState) emptyState.style.display = 'none';
            const notes = [];

            snapshot.forEach((doc) => {
                notes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            renderNotes(notes);
            updateNotesCount(notes.length);
        },
        (error) => {
            console.error('Error loading notes:', error);
            if (loadingState) loadingState.style.display = 'none';
            showError('error-message', 'Failed to load notes. Please refresh the page.');
        }
    );
}

// ===== LOAD SHARED NOTE =====
async function loadSharedNote(shareToken) {
    const loadingState = document.getElementById('loading-state');
    const notesContainer = document.getElementById('notes-container');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelector('.filter-buttons');
    const addNoteBtn = document.getElementById('add-note-btn');
    
    if (loadingState) loadingState.style.display = 'block';
    if (notesContainer) notesContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'none';
    
    // Hide filter buttons and add button for shared view
    if (filterButtons) filterButtons.style.display = 'none';
    if (addNoteBtn) addNoteBtn.style.display = 'none';
    
    try {
        // Parse the share token to get userId and noteId
        // Format: userId:noteId:randomString
        const parts = shareToken.split(':');
        
        if (parts.length < 2) {
            throw new Error('Invalid share token format');
        }
        
        const ownerUid = parts[0];
        const noteId = parts[1];
        
        // Try to fetch the note directly
        const noteDocRef = doc(db, 'users', ownerUid, 'notes', noteId);
        const noteSnapshot = await getDoc(noteDocRef);
        
        if (loadingState) loadingState.style.display = 'none';
        
        if (noteSnapshot.exists()) {
            const noteData = noteSnapshot.data();
            
            // Verify the note is actually shared and has the correct token
            if (noteData.isShared && noteData.shareToken === shareToken) {
                const foundNote = {
                    id: noteSnapshot.id,
                    ...noteData
                };
                
                // Display the shared note
                const noteCard = createSharedNoteCard(foundNote, ownerUid);
                if (notesContainer) notesContainer.appendChild(noteCard);
                
                // Show a banner indicating this is a shared note
                showSharedNoteBanner();
            } else {
                // Note exists but is not shared
                throw new Error('Note is not shared');
            }
        } else {
            // Note not found
            throw new Error('Note not found');
        }
        
    } catch (error) {
        console.error('Error loading shared note:', error);
        if (loadingState) loadingState.style.display = 'none';
        
        if (emptyState) {
            emptyState.innerHTML = `
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="60" fill="#f3f4f6" />
                    <path d="M40 35h40v50H40z" fill="white" stroke="#e5e7eb" stroke-width="2" />
                    <line x1="45" y1="60" x2="75" y2="60" stroke="#d1d5db" stroke-width="3" />
                </svg>
                <h2>Note not found</h2>
                <p>This shared note doesn't exist or is no longer available</p>
                <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">
                    Go to My Notes
                </button>
            `;
            emptyState.style.display = 'block';
        }
    }
}

// Create a card for shared notes (read-only)
function createSharedNoteCard(note, ownerUid) {
    const card = document.createElement('div');
    
    const noteColor = note.color || noteColors[Math.floor(Math.random() * noteColors.length)];
    card.className = `note-card ${noteColor} shared-note`;
    card.dataset.noteId = note.id;

    const createdDate = note.createdAt ? formatDate(note.createdAt.toDate()) : 'Just now';

    // Build category badges HTML
    let categoriesHtml = '';
    if (note.categories && note.categories.length > 0) {
        categoriesHtml = '<div class="note-categories">';
        note.categories.forEach(category => {
            if (category === 'important') {
                categoriesHtml += `
                    <span class="category-badge important">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Important
                    </span>`;
            } else if (category === 'bookmarked') {
                categoriesHtml += `
                    <span class="category-badge bookmarked">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        Bookmarked
                    </span>`;
            }
        });
        categoriesHtml += '</div>';
    }

    card.innerHTML = `
        <div class="shared-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Shared with you
        </div>
        ${categoriesHtml}
        <div class="note-card-header">
            <h3>${escapeHtml(note.title)}</h3>
        </div>
        <p class="note-content">${escapeHtml(note.content)}</p>
        <div class="note-footer">
            <span class="note-date">${createdDate}</span>
        </div>
    `;

    return card;
}

function showSharedNoteBanner() {
    const main = document.querySelector('.dashboard-main');
    const existingBanner = document.getElementById('shared-note-banner');
    
    // Don't add banner if it already exists
    if (existingBanner) return;
    
    const banner = document.createElement('div');
    banner.id = 'shared-note-banner';
    banner.className = 'shared-note-banner';
    banner.innerHTML = `
        <div class="banner-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>You're viewing a shared note. <a href="dashboard.html" style="color: inherit; text-decoration: underline;">Go to your notes</a></span>
        </div>
    `;
    
    if (main) {
        main.insertBefore(banner, main.firstChild);
    }
}

// ===== RENDER NOTES IN UI =====
function renderNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesContainer.appendChild(noteCard);
    });
    
    // Apply current filter
    applyFilter();
}

// Note card colors
const noteColors = [
    'color-pink', 'color-purple', 'color-blue', 'color-cyan',
    'color-green', 'color-yellow', 'color-orange', 'color-red',
    'color-lavender', 'color-mint', 'color-peach', 'color-sky'
];

// ===== CREATE NOTE CARD ELEMENT =====
function createNoteCard(note) {
    const card = document.createElement('div');
    
    // Assign color - use stored color or generate new one
    const noteColor = note.color || noteColors[Math.floor(Math.random() * noteColors.length)];
    card.className = `note-card ${noteColor}`;
    card.dataset.noteId = note.id;

    const createdDate = note.createdAt ? formatDate(note.createdAt.toDate()) : 'Just now';
    const updatedDate = note.updatedAt ? formatDate(note.updatedAt.toDate()) : createdDate;

    // Build category badges HTML
    let categoriesHtml = '';
    if (note.categories && note.categories.length > 0) {
        categoriesHtml = '<div class="note-categories">';
        note.categories.forEach(category => {
            if (category === 'important') {
                categoriesHtml += `
                    <span class="category-badge important">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Important
                    </span>`;
            } else if (category === 'bookmarked') {
                categoriesHtml += `
                    <span class="category-badge bookmarked">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        Bookmarked
                    </span>`;
            }
        });
        categoriesHtml += '</div>';
    }

    card.innerHTML = `
        ${categoriesHtml}
        <div class="note-card-header">
            <h3>${escapeHtml(note.title)}</h3>
            <div class="note-card-actions">
                <button class="note-action-btn share-note" title="Share note">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                </button>
                <button class="note-action-btn edit-note" title="Edit note">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="note-action-btn delete delete-note" title="Delete note">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
        <p class="note-content">${escapeHtml(note.content)}</p>
        <div class="note-footer">
            <span class="note-date">${updatedDate !== createdDate ? `Updated ${updatedDate}` : createdDate}</span>
        </div>
    `;

    // Event listeners
    const shareBtn = card.querySelector('.share-note');
    const editBtn = card.querySelector('.edit-note');
    const deleteBtn = card.querySelector('.delete-note');

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openShareModal(note);
    });

    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(note);
    });

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(note.id);
    });

    // Click on card to view/edit
    card.addEventListener('click', () => {
        openEditModal(note);
    });

    return card;
}

// ===== ADD NOTE =====
const addNoteBtn = document.getElementById('add-note-btn');
if (addNoteBtn) {
    addNoteBtn.addEventListener('click', openAddModal);
}

function openAddModal() {
    const modal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');
    const noteForm = document.getElementById('note-form');
    const importantCheckbox = document.getElementById('category-important');
    const bookmarkedCheckbox = document.getElementById('category-bookmarked');

    currentNoteId = null;
    modalTitle.textContent = 'New Note';
    noteForm.reset();
    
    // Reset category checkboxes
    if (importantCheckbox) importantCheckbox.checked = false;
    if (bookmarkedCheckbox) bookmarkedCheckbox.checked = false;

    modal.style.display = 'flex';
    document.getElementById('note-title').focus();
}

// ===== EDIT NOTE =====
function openEditModal(note) {
    const modal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const importantCheckbox = document.getElementById('category-important');
    const bookmarkedCheckbox = document.getElementById('category-bookmarked');

    currentNoteId = note.id;
    modalTitle.textContent = 'Edit Note';
    titleInput.value = note.title;
    contentInput.value = note.content;

    // Set category checkboxes
    if (importantCheckbox) importantCheckbox.checked = note.categories?.includes('important') || false;
    if (bookmarkedCheckbox) bookmarkedCheckbox.checked = note.categories?.includes('bookmarked') || false;

    modal.style.display = 'flex';
    titleInput.focus();
}

// ===== SAVE NOTE (CREATE OR UPDATE) =====
const noteForm = document.getElementById('note-form');
if (noteForm) {
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = document.getElementById('save-note-btn');
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        
        // Get selected categories
        const categories = [];
        if (document.getElementById('category-important')?.checked) categories.push('important');
        if (document.getElementById('category-bookmarked')?.checked) categories.push('bookmarked');

        if (!title || !content) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setLoading(saveBtn, true);
            console.log('Saving note...', { title, content, categories, isUpdate: !!currentNoteId });

            const notesRef = collection(db, 'users', currentUser.uid, 'notes');

            // Use Timestamp.now() for instant updates instead of serverTimestamp()
            const { Timestamp } = await import('https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js');
            const now = Timestamp.now();

            if (currentNoteId) {
                // Update existing note
                const noteDoc = doc(db, 'users', currentUser.uid, 'notes', currentNoteId);

                // Close modal immediately for better UX
                closeNoteModal();
                setLoading(saveBtn, false);

                // Update in background (don't change color on edit)
                updateDoc(noteDoc, {
                    title,
                    content,
                    categories,
                    updatedAt: now
                }).then(() => {
                    console.log('Note updated successfully!');
                }).catch((error) => {
                    console.error('Background update error:', error);
                    let errorMessage = 'Failed to update note. Please try again.';
                    if (error.code === 'permission-denied') {
                        errorMessage = '⚠️ Permission Denied: Please deploy Firestore security rules first.\n\nGo to: Firebase Console → Firestore → Rules → Publish';
                    } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
                        errorMessage = '⚠️ Firestore Rules Not Deployed!\n\n1. Go to Firebase Console\n2. Navigate to Firestore → Rules\n3. Copy rules from firebase/firestore.rules\n4. Click Publish';
                    } else if (error.code === 'unavailable') {
                        errorMessage = 'Network error. Please check your internet connection.';
                    } else if (error.code === 'unauthenticated') {
                        errorMessage = 'You are not logged in. Please log in again.';
                    }
                    alert(errorMessage);
                });

            } else {
                // Create new note with random color
                const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
                
                // Close modal immediately for better UX
                closeNoteModal();
                setLoading(saveBtn, false);

                // Create in background
                addDoc(notesRef, {
                    title,
                    content,                    categories,                    color: randomColor,
                    createdAt: now,
                    updatedAt: now
                }).then((docRef) => {
                    console.log('Note created successfully! ID:', docRef.id);
                }).catch((error) => {
                    console.error('Background save error:', error);

                    let errorMessage = 'Failed to save note. Please try again.';

                    // Check for specific errors
                    if (error.code === 'permission-denied') {
                        errorMessage = '⚠️ Permission Denied: Please deploy Firestore security rules first.\n\nGo to: Firebase Console → Firestore → Rules → Publish';
                    } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
                        errorMessage = '⚠️ Firestore Rules Not Deployed!\n\n1. Go to Firebase Console\n2. Navigate to Firestore → Rules\n3. Copy rules from firebase/firestore.rules\n4. Click Publish';
                    } else if (error.code === 'unavailable') {
                        errorMessage = 'Network error. Please check your internet connection.';
                    } else if (error.code === 'unauthenticated') {
                        errorMessage = 'You are not logged in. Please log in again.';
                    }

                    alert(errorMessage);
                });
            }

        } catch (error) {
            console.error('Save note error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            let errorMessage = 'Failed to save note. Please try again.';

            // Check for specific errors
            if (error.code === 'permission-denied') {
                errorMessage = '⚠️ Permission Denied: Please deploy Firestore security rules first.\n\nGo to: Firebase Console → Firestore → Rules → Publish';
            } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
                errorMessage = '⚠️ Firestore Rules Not Deployed!\n\n1. Go to Firebase Console\n2. Navigate to Firestore → Rules\n3. Copy rules from firebase/firestore.rules\n4. Click Publish';
            } else if (error.code === 'unavailable') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'unauthenticated') {
                errorMessage = 'You are not logged in. Please log in again.';
            }

            alert(errorMessage);
            setLoading(saveBtn, false);
        }
    });
}

// ===== DELETE NOTE =====
function openDeleteModal(noteId) {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'flex';
    currentNoteId = noteId;
}

const confirmDeleteBtn = document.getElementById('confirm-delete');
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!currentNoteId) return;

        try {
            setLoading(confirmDeleteBtn, true);

            const noteDoc = doc(db, 'users', currentUser.uid, 'notes', currentNoteId);
            await deleteDoc(noteDoc);

            closeDeleteModal();
            currentNoteId = null;
        } catch (error) {
            console.error('Delete note error:', error);
            alert('Failed to delete note. Please try again.');
        } finally {
            setLoading(confirmDeleteBtn, false);
        }
    });
}

// ===== CLOSE MODALS =====
function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.style.display = 'none';
    document.getElementById('note-form').reset();
    currentNoteId = null;
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
    currentNoteId = null;
}

// ===== SHARE NOTE =====
let currentShareNoteId = null;

function openShareModal(note) {
    const modal = document.getElementById('share-modal');
    const linkInput = document.getElementById('share-link-input');
    const successMessage = document.getElementById('share-success-message');
    
    currentShareNoteId = note.id;
    
    // Generate share link
    generateShareLink(note);
    
    // Hide success message
    if (successMessage) successMessage.style.display = 'none';
    
    modal.style.display = 'flex';
}

async function generateShareLink(note) {
    const linkInput = document.getElementById('share-link-input');
    
    try {
        // Generate a unique share token if not exists
        let shareToken = note.shareToken;
        
        if (!shareToken) {
            // Create unique token - format: userId:noteId:randomString
            const randomPart = Math.random().toString(36).substr(2, 9);
            shareToken = `${currentUser.uid}:${note.id}:${randomPart}`;
            
            // Save share token to note document
            const noteDoc = doc(db, 'users', currentUser.uid, 'notes', note.id);
            await updateDoc(noteDoc, {
                shareToken: shareToken,
                isShared: true,
                sharedAt: serverTimestamp()
            });
        }
        
        // Generate the share URL
        const shareUrl = `${window.location.origin}/dashboard.html?share=${shareToken}`;
        linkInput.value = shareUrl;
        
    } catch (error) {
        console.error('Error generating share link:', error);
        linkInput.value = 'Error generating link. Please try again.';
    }
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    const successMessage = document.getElementById('share-success-message');
    
    modal.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    currentShareNoteId = null;
}

// Copy link button
const copyLinkBtn = document.getElementById('copy-link-btn');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
        const linkInput = document.getElementById('share-link-input');
        const successMessage = document.getElementById('share-success-message');
        
        try {
            await navigator.clipboard.writeText(linkInput.value);
            
            // Show success message
            if (successMessage) {
                successMessage.style.display = 'flex';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error copying link:', error);
            // Fallback: select the text
            linkInput.select();
            document.execCommand('copy');
            
            if (successMessage) {
                successMessage.style.display = 'flex';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        }
    });
}

// Close share modal buttons
document.getElementById('close-share-modal')?.addEventListener('click', closeShareModal);
document.getElementById('close-share-btn')?.addEventListener('click', closeShareModal);


document.getElementById('close-modal')?.addEventListener('click', closeNoteModal);
document.getElementById('cancel-note')?.addEventListener('click', closeNoteModal);
document.getElementById('cancel-delete')?.addEventListener('click', closeDeleteModal);

// Close modal on overlay click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-overlay')) {
            modal.style.display = 'none';
        }
    });
});

// ===== SEARCH NOTES =====
const searchInput = document.getElementById('search-notes');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const noteCards = document.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('.note-content').textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===== UI INITIALIZATION (after DOM loaded) =====
let currentFilter = 'all';

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Dashboard] DOM fully loaded, initializing UI event listeners');
    
    // ===== USER MENU =====
    const menuToggle = document.getElementById('menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');

    if (menuToggle && userDropdown) {
        console.log('[Dashboard] Menu toggle and dropdown found, attaching listeners');
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = userDropdown.style.display === 'block';
            userDropdown.style.display = isVisible ? 'none' : 'block';
            console.log('[Dashboard] Menu toggled, visible:', !isVisible);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.style.display = 'none';
        });
        
        // Prevent clicks inside dropdown from closing it
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    } else {
        console.warn('[Dashboard] Menu toggle or dropdown not found');
    }

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        console.log('[Dashboard] Logout button found, attaching click listener');
        
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('[Dashboard] Logout button clicked, signing out...');
            
            try {
                // Clean up Firestore listener
                if (notesUnsubscribe) {
                    notesUnsubscribe();
                }
                
                // Sign out from Firebase
                await signOut(auth);
                console.log('[Dashboard] Sign out successful, redirecting to login page');
                
                // Redirect to login page
                window.location.href = 'index.html';
            } catch (error) {
                console.error('[Dashboard] Logout error:', error);
                alert('Failed to logout. Please try again.');
            }
        });
    } else {
        console.error('[Dashboard] Logout button (#logout-btn) not found in DOM!');
    }

    // ===== FILTER BUTTONS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        console.log('[Dashboard] Found', filterButtons.length, 'filter buttons');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentFilter = btn.dataset.filter;
                applyFilter();
            });
        });
    }

    // ===== VIEW TOGGLE =====
    const viewButtons = document.querySelectorAll('.view-btn');
    const notesContainer = document.getElementById('notes-container');
    
    if (viewButtons.length > 0 && notesContainer) {
        console.log('[Dashboard] Found', viewButtons.length, 'view buttons');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentView = btn.dataset.view;
                
                // Toggle container class
                if (currentView === 'list') {
                    notesContainer.classList.remove('notes-grid');
                    notesContainer.classList.add('notes-list');
                } else {
                    notesContainer.classList.remove('notes-list');
                    notesContainer.classList.add('notes-grid');
                }
                
                console.log('[Dashboard] View changed to:', currentView);
            });
        });
    }
});

function applyFilter() {
    const noteCards = document.querySelectorAll('.note-card');
    let visibleCount = 0;
    
    noteCards.forEach(card => {
        const noteId = card.dataset.noteId;
        // Find the note data
        const hasBadges = card.querySelector('.note-categories');
        const hasImportant = card.querySelector('.category-badge.important');
        const hasBookmarked = card.querySelector('.category-badge.bookmarked');
        
        let shouldShow = false;
        
        if (currentFilter === 'all') {
            shouldShow = true;
        } else if (currentFilter === 'important') {
            shouldShow = hasImportant !== null;
        } else if (currentFilter === 'bookmarked') {
            shouldShow = hasBookmarked !== null;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update all count
    const allCount = document.getElementById('all-count');
    if (allCount && currentFilter === 'all') {
        allCount.textContent = visibleCount;
    }
}

// ===== HELPER FUNCTIONS =====
function updateNotesCount(count) {
    const allCount = document.getElementById('all-count');
    if (allCount) {
        allCount.textContent = count;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Clean up listener on page unload
window.addEventListener('beforeunload', () => {
    if (notesUnsubscribe) {
        notesUnsubscribe();
    }
});

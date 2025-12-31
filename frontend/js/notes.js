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
    onSnapshot
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

    if (userName) userName.textContent = user.displayName || 'User';
    if (userEmail) userEmail.textContent = user.email;

    // Load notes
    loadNotes();
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

// ===== RENDER NOTES IN UI =====
function renderNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesContainer.appendChild(noteCard);
    });
}

// ===== CREATE NOTE CARD ELEMENT =====
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.noteId = note.id;

    const createdDate = note.createdAt ? formatDate(note.createdAt.toDate()) : 'Just now';
    const updatedDate = note.updatedAt ? formatDate(note.updatedAt.toDate()) : createdDate;

    card.innerHTML = `
        <div class="note-card-header">
            <h3>${escapeHtml(note.title)}</h3>
            <div class="note-card-actions">
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
    const editBtn = card.querySelector('.edit-note');
    const deleteBtn = card.querySelector('.delete-note');

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

    currentNoteId = null;
    modalTitle.textContent = 'New Note';
    noteForm.reset();

    modal.style.display = 'flex';
    document.getElementById('note-title').focus();
}

// ===== EDIT NOTE =====
function openEditModal(note) {
    const modal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    currentNoteId = note.id;
    modalTitle.textContent = 'Edit Note';
    titleInput.value = note.title;
    contentInput.value = note.content;

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

        if (!title || !content) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setLoading(saveBtn, true);
            console.log('Saving note...', { title, content, isUpdate: !!currentNoteId });

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

                // Update in background
                updateDoc(noteDoc, {
                    title,
                    content,
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
                // Create new note
                // Close modal immediately for better UX
                closeNoteModal();
                setLoading(saveBtn, false);

                // Add in background
                addDoc(notesRef, {
                    title,
                    content,
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

// ===== VIEW TOGGLE =====
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const notesContainer = document.getElementById('notes-container');

if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        notesContainer.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });
}

if (listViewBtn) {
    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        notesContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
}

// ===== USER MENU =====
const userMenuBtn = document.getElementById('user-menu-btn');
const userDropdown = document.getElementById('user-dropdown');

if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.style.display = 'none';
    });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            if (notesUnsubscribe) {
                notesUnsubscribe();
            }
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
        }
    });
}

// ===== HELPER FUNCTIONS =====
function updateNotesCount(count) {
    const notesCount = document.getElementById('notes-count');
    if (notesCount) {
        notesCount.textContent = count;
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

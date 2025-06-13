document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect to login if no token and not on login/signup page
    if (
        !localStorage.getItem('token') &&
        !currentPage.includes('login') &&
        !currentPage.includes('signup')
    ) {
        window.location.href = '/login';
        return;
    }

    // Update time display
    function updateTime() {
        const timeElement = document.querySelector('.time');
        const dateElement = document.querySelector('.date');
        if (timeElement && dateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            timeElement.textContent = timeString;
            dateElement.textContent = dateString;
        }
    }
    updateTime();
    setInterval(updateTime, 60000);

    // Helper fetch with token
    function fetchWithToken(url, options = {}) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token available');
            return Promise.reject(new Error('No token available'));
        }

        const defaultHeaders = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        options.headers = {
            ...defaultHeaders,
            ...(options.headers || {})
        };

        return fetch(url, options);
    }

//     Fetch data & populate tables
    function fetchData(endpoint, tableId) {
        fetchWithToken(`/api/${endpoint}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                const table = document.getElementById(tableId)?.getElementsByTagName('tbody')[0];
                if (!table) return;
                table.innerHTML = '';
                data.forEach(item => {
                    const row = table.insertRow();
                    row.insertCell().textContent = item.id;

                    if (endpoint === 'users') {
                        row.insertCell().textContent = item.name;
                        row.insertCell().textContent = item.email;
                        row.insertCell().textContent = item.username;
                    } else if (endpoint === 'books') {
                        row.insertCell().textContent = item.name;
                        row.insertCell().textContent = item.type;
                        row.insertCell().textContent = item.language;
                        row.insertCell().textContent = item.availability;
                    } else if (endpoint === 'branches') {
                        row.insertCell().textContent = item.name;
                        row.insertCell().textContent = item.contactNo;
                        row.insertCell().textContent = item.location;
                    }

                    const actionCell = row.insertCell();
                    actionCell.innerHTML = `
                        <button class="action-btn edit-btn" data-id="${item.id}" data-type="${endpoint}">✏️</button>
                        <button class="action-btn delete-btn" data-id="${item.id}" data-type="${endpoint}">🗑️</button>
                        <button class="action-btn sync-btn" data-id="${item.id}" data-type="${endpoint}">⟳</button>
                    `;
                });
            })
            .catch(e => {
                console.error('Error fetching data:', e);
                alert('Failed to fetch data. Please try again.');
            });
    }

    // Load data on management pages
    if (localStorage.getItem('token')) {
        if (currentPage === 'user-management.html') {
            fetchData('users', 'users-table');
        } else if (currentPage === 'book-management.html') {
            fetchData('books', 'books-table');
        } else if (currentPage === 'branch-management.html') {
            fetchData('branches', 'branches-table');
        }
    }

    // Show add/edit form dynamically
    let currentId = null;

    function showForm(title, endpoint, item = null) {
        currentId = item?.id || null;

        // Remove existing form if any
        closeForm();

        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';

        formContainer.innerHTML = `
            <div class="form-header">
                <div class="form-title">${title}</div>
                <button class="secondary-btn close-form-btn">✕</button>
            </div>
            <form class="form-content">
                ${generateFields(endpoint, item)}
                <div class="form-actions">
                    <button type="button" class="secondary-btn cancel-btn">Cancel</button>
                    <button type="submit" class="primary-btn">${item ? 'Update' : 'Add'}</button>
                </div>
            </form>
        `;

        document.querySelector('.main-content').prepend(formContainer);

        // Event listeners for close/cancel buttons
        formContainer.querySelector('.close-form-btn').addEventListener('click', closeForm);
        formContainer.querySelector('.cancel-btn').addEventListener('click', closeForm);

        // Form submit handler
        formContainer.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            const method = currentId ? 'PUT' : 'POST';
            const url = currentId ? `/api/${endpoint}/${currentId}` : `/api/${endpoint}`;

            fetchWithToken(url, {
                method,
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                closeForm();
                fetchData(endpoint, `${endpoint}-table`);
            })
            .catch(err => {
                console.error(`Error ${currentId ? 'updating' : 'adding'} item:`, err);
                alert('Terjadi kesalahan saat menyimpan data.');
            });
        });
    }

    function generateFields(endpoint, item) {
        let fields = [];
        if (endpoint === 'users') {
            fields = [
                { name: 'name', label: 'Name', type: 'text', value: item?.name || '' },
                { name: 'email', label: 'Email', type: 'email', value: item?.email || '' },
                { name: 'username', label: 'Username', type: 'text', value: item?.username || '' }
            ];
        } else if (endpoint === 'books') {
            fields = [
                { name: 'name', label: 'Name', type: 'text', value: item?.name || '' },
                { name: 'type', label: 'Type', type: 'text', value: item?.type || '' },
                { name: 'language', label: 'Language', type: 'text', value: item?.language || '' },
                { name: 'availability', label: 'Availability', type: 'text', value: item?.availability || '' }
            ];
        } else if (endpoint === 'branches') {
            fields = [
                { name: 'name', label: 'Name', type: 'text', value: item?.name || '' },
                { name: 'contactNo', label: 'Contact No', type: 'text', value: item?.contactNo || '' },
                { name: 'location', label: 'Location', type: 'text', value: item?.location || '' }
            ];
        }

        return fields.map(f => `
            <div class="form-group">
                <label for="${f.name}">${f.label}</label>
                <input type="${f.type}" id="${f.name}" name="${f.name}" value="${f.value}" required />
            </div>
        `).join('');
    }

    function closeForm() {
        const existingForm = document.querySelector('.form-container');
        if (existingForm) existingForm.remove();
        currentId = null;
    }

    // Unified click handler for buttons: add, edit, delete, sync
    document.addEventListener('click', function(e) {
        const target = e.target;

        if (target.classList.contains('add-btn')) {
            const endpoint = target.dataset.type;
            showForm(`Add ${capitalize(endpoint)}`, endpoint);
            return;
        }

        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            const type = target.dataset.type;
            fetchWithToken(`/api/${type}/${id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(item => showForm(`Edit ${capitalize(type)}`, type, item))
                .catch(err => console.error('Error fetching item:', err));
            return;
        }

        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            const type = target.dataset.type;
            if (confirm(`Are you sure you want to delete this ${type}?`)) {
                fetchWithToken(`/api/${type}/${id}`, { method: 'DELETE' })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok');
                        }
                        fetchData(type, `${type}-table`);
                    })
                    .catch(err => console.error('Error deleting item:', err));
            }
            return;
        }

        if (target.classList.contains('sync-btn')) {
            const id = target.dataset.id;
            const type = target.dataset.type;
            fetchWithToken(`/api/${type}/${id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(item => alert(JSON.stringify(item, null, 2)))
                .catch(err => console.error('Error syncing item:', err));
            return;
        }

        // Close form if click outside form content
        if (target.classList.contains('form-container')) {
            closeForm();
        }
    });

    // Capitalize helper
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
    }
});

console.log('Token from localStorage:', localStorage.getItem('token'));
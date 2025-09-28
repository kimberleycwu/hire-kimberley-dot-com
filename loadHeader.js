// Function to load header into each page
function loadHeader() {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            // Insert header before the main content
            const main = document.querySelector('main');
            if (main) {
                main.insertAdjacentHTML('beforebegin', data);
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// Load header when page loads
document.addEventListener('DOMContentLoaded', loadHeader); 
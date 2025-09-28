// Function to load header into each page
function loadHeader() {
    // Determine the correct path to header.html based on current page location
    const isInSubfolder = window.location.pathname.includes('/projectsFolder/');
    const headerPath = isInSubfolder ? '../header.html' : 'header.html';
    
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            // If we're in a subfolder, adjust the header links
            if (isInSubfolder) {
                data = data.replace(/href="([^"]*\.html)"/g, 'href="../$1"');
            }
            
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
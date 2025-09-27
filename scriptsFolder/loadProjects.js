// Function to load and display projects
function loadProjects() {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            displayProjects(data.projects);
            createTagFilters(data.tags);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
        });
}

// Function to display projects
function displayProjects(projects, filteredProjects = null) {
    const projectsContainer = document.getElementById('projects-container');
    const projectsToShow = filteredProjects || projects;
    
    if (projectsToShow.length === 0) {
        projectsContainer.innerHTML = '<p class="no-projects">No projects found matching your filters.</p>';
        return;
    }
    
    projectsContainer.innerHTML = projectsToShow.map(project => `
        <div class="project-card" data-tags="${project.tags.join(',')}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='placeholder-project.jpg'">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.url}" class="project-link">View Project →</a>
            </div>
        </div>
    `).join('');
}

// Function to create tag filters
function createTagFilters(tags) {
    const filtersContainer = document.getElementById('tag-filters');
    const uniqueTags = [...new Set(tags)];
    
    filtersContainer.innerHTML = `
        <button class="filter-btn active" data-tag="all">All</button>
        ${uniqueTags.map(tag => `<button class="filter-btn" data-tag="${tag}">${tag}</button>`).join('')}
    `;
    
    // Add click event listeners
    filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter projects
            const selectedTag = e.target.dataset.tag;
            filterProjects(selectedTag);
        }
    });
}

// Function to filter projects by tag
function filterProjects(tag) {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            if (tag === 'all') {
                displayProjects(data.projects);
            } else {
                const filtered = data.projects.filter(project => 
                    project.tags.includes(tag)
                );
                displayProjects(data.projects, filtered);
            }
        })
        .catch(error => {
            console.error('Error filtering projects:', error);
        });
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects); 
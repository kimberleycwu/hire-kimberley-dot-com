// Store parsed projects data
let parsedProjects = [];
let allTags = [];

// Function to extract metadata from HTML
function extractProjectMetadata(html, url, id) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract title from h1
    const titleElement = doc.querySelector('h1');
    const title = titleElement ? titleElement.textContent.trim() : 'Untitled Project';
    
    // Extract description from .project-description > p
    const descriptionElement = doc.querySelector('.project-description p');
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';
    
    // Extract tags from .project-tags .tag elements
    const tagElements = doc.querySelectorAll('.project-tags .tag');
    const tags = Array.from(tagElements).map(tag => tag.textContent.trim());
    
    return {
        id: id,
        url: url,
        title: title,
        description: description,
        tags: tags
    };
}

// Function to fetch and parse a single project
async function fetchProjectMetadata(project) {
    try {
        const response = await fetch(project.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${project.url}: ${response.statusText}`);
        }
        const html = await response.text();
        return extractProjectMetadata(html, project.url, project.id);
    } catch (error) {
        console.error(`Error fetching project ${project.url}:`, error);
        // Return a fallback project object
        return {
            id: project.id,
            url: project.url,
            title: 'Project',
            description: 'Unable to load project details.',
            tags: []
        };
    }
}

// Function to load and display projects
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        
        // Fetch and parse all project HTML files
        const projectPromises = data.projects.map(project => fetchProjectMetadata(project));
        parsedProjects = await Promise.all(projectPromises);
        
        // Extract all unique tags
        allTags = [...new Set(parsedProjects.flatMap(project => project.tags))].sort();
        
        // Display projects and create filters
        displayProjects(parsedProjects);
        createTagFilters(allTags);
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="no-projects">Error loading projects. Please try again later.</p>';
        }
    }
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
            <a href="${project.url}" class="project-card-link">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
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
    if (tag === 'all') {
        displayProjects(parsedProjects);
    } else {
        const filtered = parsedProjects.filter(project => 
            project.tags.includes(tag)
        );
        displayProjects(parsedProjects, filtered);
    }
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects); 
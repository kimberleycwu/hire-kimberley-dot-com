// Fills any element that has a data-markdown="path/to/file.md" attribute
// with that file's contents, formatted as HTML.
document.querySelectorAll("[data-markdown]").forEach(async (element) => {
    try {
        const response = await fetch(element.dataset.markdown);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        element.innerHTML = marked.parse(await response.text());
    } catch (error) {
        console.error(`Could not load ${element.dataset.markdown}:`, error);
        element.hidden = true;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!tabs[0] || !tabs[0].id) return;
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: fetchMetaTags
        }, (injectionResults) => {
            if (!injectionResults || injectionResults.length === 0) return;
            const metaTags = injectionResults[0].result;
            const container = document.getElementById('metaTags');
            metaTags.forEach(tag => {
                const div = document.createElement('div');
                div.className = 'meta-tag';
                div.textContent = `${tag.name}: ${tag.content}`;
                container.appendChild(div);
            });
        });
    });
});

function fetchMetaTags() {
    const metaTags = document.getElementsByTagName('meta');
    const desiredTags = ['title', 'description', 'keywords', 'viewport', 'robots'];
    const imageRelatedTags = ['og:image', 'twitter:image'];

    const filteredTags = Array.from(metaTags).filter(tag => {
        const tagName = tag.getAttribute('name') || tag.getAttribute('property');
        return (desiredTags.includes(tagName) || (tagName && tagName.startsWith('og:'))) && !imageRelatedTags.includes(tagName);
    });

    return filteredTags.map(tag => ({
        name: tag.getAttribute('name') || tag.getAttribute('property') || 'Unnamed Tag',
        content: tag.getAttribute('content') || 'No Content'
    }));
}



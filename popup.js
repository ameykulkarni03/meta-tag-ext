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
    return Array.from(metaTags).map(tag => ({
        name: tag.getAttribute('name') || tag.getAttribute('property') || 'Unnamed Tag',
        content: tag.getAttribute('content') || 'No Content'
    }));
}

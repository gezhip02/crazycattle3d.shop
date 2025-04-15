// Social Share Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page URL and title
    const currentUrl = encodeURIComponent(window.location.href);
    const currentTitle = encodeURIComponent(document.title);

    // Configure social share buttons
    const twitterBtn = document.querySelector('.social-button.twitter');
    const facebookBtn = document.querySelector('.social-button.facebook');
    const linkedinBtn = document.querySelector('.social-button.linkedin');

    if (twitterBtn) {
        twitterBtn.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentTitle}`;
    }

    if (facebookBtn) {
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    }

    if (linkedinBtn) {
        linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    }

    // Open social share links in a popup window
    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const width = 600;
            const height = 400;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            
            window.open(
                this.href,
                'social-share',
                `width=${width},height=${height},left=${left},top=${top}`
            );
        });
    });

    // Ensure all related article links are valid
    document.querySelectorAll('.related-article-content a').forEach(link => {
        // Remove any double slashes in the path (except after http/https)
        link.href = link.href.replace(/([^:])\/+/g, '$1/');
        
        // Ensure the link starts with the correct path
        if (!link.href.startsWith('http')) {
            const path = link.getAttribute('href');
            if (path && !path.startsWith('/')) {
                link.href = '../articles/' + path;
            }
        }
    });
}); 
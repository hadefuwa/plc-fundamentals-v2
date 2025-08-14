// PDF Popup Notification System
class PDFPopup {
    constructor() {
        this.popup = null;
        this.timeout = null;
        this.init();
    }

    init() {
        // Create popup element if it doesn't exist
        if (!document.getElementById('pdf-popup')) {
            this.createPopupElement();
        }
        this.popup = document.getElementById('pdf-popup');
    }

    createPopupElement() {
        const popup = document.createElement('div');
        popup.id = 'pdf-popup';
        popup.className = 'pdf-popup';
        popup.innerHTML = `
            <div class="pdf-popup-content">
                <i class="fas fa-file-pdf"></i>
                <span class="pdf-popup-text">Opening PDF...</span>
            </div>
        `;
        document.body.appendChild(popup);
    }

    show(filename) {
        if (!this.popup) {
            this.init();
        }

        // Update popup content
        const textElement = this.popup.querySelector('.pdf-popup-text');
        if (textElement) {
            textElement.textContent = `Opening ${filename}...`;
        }

        // Show popup
        this.popup.classList.add('show');

        // Auto-hide after 5 seconds
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        this.timeout = setTimeout(() => {
            this.hide();
        }, 5000);
    }

    hide() {
        if (this.popup) {
            this.popup.classList.remove('show');
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

// Initialize PDF popup system
let pdfPopup;

document.addEventListener('DOMContentLoaded', () => {
    pdfPopup = new PDFPopup();
});

// PWA PDF opening function
function openPDF(pdfPath) {
    // Extract filename from path
    const filename = pdfPath.split('/').pop() || pdfPath.split('\\').pop() || 'PDF Document';
    
    // Show popup if available
    if (pdfPopup) {
        pdfPopup.show(filename);
    }
    
    // Try to open PDF directly in browser, with fallback to download
    const link = document.createElement('a');
    link.href = pdfPath;
    link.target = '_blank';
    link.download = filename;
    
    // Try to open in new tab first
    const newWindow = window.open(pdfPath, '_blank');
    
    // If that fails, trigger download
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        link.click();
    }
} 
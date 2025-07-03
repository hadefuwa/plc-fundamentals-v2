// PDF popup functionality
document.addEventListener('DOMContentLoaded', () => {
    function showPDFNotification(pdfPath) {
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'scenario-popup';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'scenario-content';
        content.style.padding = '20px';
        content.style.textAlign = 'center';
        
        // Add message
        const message = document.createElement('p');
        message.textContent = 'Opening PDF...';
        message.style.color = '#fff';
        message.style.fontSize = '18px';
        message.style.margin = '0';
        content.appendChild(message);
        
        // Add filename
        const filename = document.createElement('p');
        filename.textContent = pdfPath.split('/').pop();
        filename.style.color = '#ccc';
        filename.style.fontSize = '14px';
        filename.style.fontStyle = 'italic';
        filename.style.marginTop = '10px';
        filename.style.margin = '10px 0 0 0';
        content.appendChild(filename);
        
        popup.appendChild(content);
        document.body.appendChild(popup);
        
        // Remove the popup after 2 seconds
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    // Override the openPDF function to show the notification
    window.openPDF = (pdfPath) => {
        showPDFNotification(pdfPath);
        window.electron.openPDF(pdfPath);
    };
}); 
// Update notification handler for Matrix Training Platform
class UpdateNotifier {
    constructor() {
        this.setupServiceWorkerListener();
        this.checkForUpdates();
    }

    setupServiceWorkerListener() {
        // Listen for messages from service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                    this.showUpdateNotification(event.data.message);
                }
            });
        }
    }

    checkForUpdates() {
        // Check for updates every 30 minutes
        setInterval(() => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    if (registration) {
                        registration.update();
                    }
                });
            }
        }, 30 * 60 * 1000); // 30 minutes
    }

    showUpdateNotification(message) {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="update-dismiss">×</button>
                <button onclick="window.location.reload()" class="update-refresh">Refresh Now</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4a9eff;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .update-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .update-content i {
                font-size: 16px;
            }
            .update-dismiss, .update-refresh {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 5px;
            }
            .update-refresh {
                background: rgba(255,255,255,0.3);
                font-weight: bold;
            }
            .update-dismiss:hover, .update-refresh:hover {
                background: rgba(255,255,255,0.4);
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
}

// Initialize update notifier when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UpdateNotifier();
});

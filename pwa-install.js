// Store the deferred prompt for later use
let deferredPrompt;
const installButtons = document.querySelectorAll('.pwa-install-button');

// Check if the app is already installed
function checkInstallState() {
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        installButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('installed');
            button.innerHTML = '<i class="fas fa-check"></i> Installed';
        });
    }
}

// Register service worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // First, unregister any existing service workers
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
                console.log('Existing service worker unregistered');
            }

            // Determine the correct path for service worker
            const swPath = location.pathname.includes('github.io') ? 
                '/closed-loop-maint-v2/service-worker.js' : // GitHub Pages path
                './service-worker.js'; // Local/other hosting path

            // Register the service worker
            const registration = await navigator.serviceWorker.register(swPath, {
                scope: location.pathname.includes('github.io') ? 
                    '/closed-loop-maint-v2/' : // GitHub Pages scope
                    './' // Local/other hosting scope
            });

            console.log('Service Worker registered successfully:', registration);
            
            // Verify the MIME type
            const response = await fetch(swPath);
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('javascript')) {
                throw new Error(`Invalid MIME type: ${contentType}. Must be application/javascript`);
            }

        } catch (error) {
            console.error('Service Worker registration failed:', error);
            showError(error);
        }
    }
}

// Show error message
function showError(error) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff5252;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-align: center;
        max-width: 80%;
    `;
    notification.innerHTML = `
        <strong>Service Worker Error</strong><br>
        ${error.message}
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #ff5252;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
        ">Dismiss</button>
    `;
    document.body.appendChild(notification);
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e;
    
    // Show the install button
    installButtons.forEach(button => {
        button.style.display = 'flex';
    });
});

// Listen for successful installation
window.addEventListener('appinstalled', (evt) => {
    // Update all install buttons
    installButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('installed');
        button.innerHTML = '<i class="fas fa-check"></i> Installed';
    });
    // Clear the deferredPrompt
    deferredPrompt = null;
});

// Function to handle installation click
async function installPWA() {
    if (!deferredPrompt) {
        // If deferredPrompt is not available, the app might be already installed
        // or the browser doesn't support PWA installation
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferredPrompt variable
    deferredPrompt = null;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkInstallState();
    registerServiceWorker();
}); 
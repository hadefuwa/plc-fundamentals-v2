// Store the deferred prompt for later use
let deferredPrompt;
const installButtons = document.querySelectorAll('.pwa-install-button');

// Check if the app is already installed
function checkInstallState() {
    // Check if app is installed (works for Chrome/Edge)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        installButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('installed');
            button.innerHTML = '<i class="fas fa-check"></i> Installed';
        });
    }
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
}); 
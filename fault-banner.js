class FaultBanner {
    constructor() {
        this.acknowledgedFaults = new Set();
        this.initialize();
    }

    initialize() {
        //console.log('Initializing FaultBanner');
        
        // Add event listener for PLC data
        window.electron.receiveData((data) => {
            // Wrap in try-catch to prevent errors from breaking other functionality
            try {
                this.handleFaultData(data);
            } catch (error) {
                console.error('Error handling fault data:', error);
            }
        });

        // Add click handler for acknowledge button
        const acknowledgeButton = document.getElementById('acknowledge-fault');
        if (acknowledgeButton) {
            acknowledgeButton.addEventListener('click', () => this.acknowledgeFaults());
        }
    }

    handleFaultData(data) {
        if (!data || !data.faults || !data.faults.faults) {
            return;
        }

        const faultBanner = document.getElementById('fault-banner');
        const faultMessage = document.getElementById('fault-message');
        
        if (!faultBanner || !faultMessage) {
            return;
        }

        // Get active faults
        const activeFaults = Object.entries(data.faults.faults)
            .filter(([_, isActive]) => isActive)
            .map(([faultName]) => faultName);

        if (activeFaults.length > 0) {
            const unacknowledgedFaults = activeFaults
                .filter(fault => !this.acknowledgedFaults.has(fault));

            if (unacknowledgedFaults.length > 0) {
                const faultList = unacknowledgedFaults
                    .map(fault => fault.replace(/([A-Z])/g, ' $1').trim())
                    .join(', ');
                
                faultMessage.textContent = `Active Faults: ${faultList}`;
                faultBanner.classList.remove('hidden');
            }
        } else {
            faultBanner.classList.add('hidden');
            this.acknowledgedFaults.clear();
        }
    }

    acknowledgeFaults() {
        const faultBanner = document.getElementById('fault-banner');
        const faultMessage = document.getElementById('fault-message');
        
        if (faultBanner && faultMessage) {
            const currentFaults = faultMessage.textContent
                .replace('Active Faults: ', '')
                .split(', ')
                .map(fault => fault.replace(/\s+/g, ''));
            
            currentFaults.forEach(fault => this.acknowledgedFaults.add(fault));
            faultBanner.classList.add('hidden');
        }
    }
}

// Create instance when script loads
//console.log('Forcing banner script started');
const faultBanner = new FaultBanner();
//console.log('ForcingBanner object created:', faultBanner); 
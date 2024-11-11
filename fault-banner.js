// Create a global FaultHandler object that the HTML can reference
window.FaultHandler = {
    acknowledgedFaults: new Set(),

    initializeFaultHandling: function() {
        const acknowledgeButton = document.getElementById('acknowledge-fault');
        if (acknowledgeButton) {
            acknowledgeButton.addEventListener('click', () => this.acknowledgeFaults());
        }
    },

    handleFaultBanner: function(faultsData) {
        if (!faultsData || !faultsData.faults) {
            return;
        }

        const faultBanner = document.getElementById('fault-banner');
        const faultMessage = document.getElementById('fault-message');
        
        if (!faultBanner || !faultMessage) {
            return;
        }

        // Get active faults
        const activeFaults = Object.entries(faultsData.faults)
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
    },

    acknowledgeFaults: function() {
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
};
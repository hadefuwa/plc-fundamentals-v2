const dbFaultsStructure = require('./dbFaults.json');

function getDBFaultsItems() {
    const items = [
        // Faults DB Items
        'DB6,X0.0',  // EStop Pressed
        'DB6,X0.1',  // Fault2
        'DB6,X0.2',  // Fault3
        'DB6,X0.3',  // Fault4
        'DB6,X0.4',  // Fault5
        'DB6,X0.5',  // Fault6
        'DB6,X0.6',  // Fault7
        'DB6,X0.7',  // Fault8
        'DB6,X1.0',  // Fault9
        'DB6,X1.1',  // Fault10
        'DB6,X1.2',  // Fault11
        'DB6,X1.3',  // Fault12
        'DB6,X1.4',  // Fault13
        'DB6,X1.5'   // Fault14
    ];

    return items;
}

function formatDBFaultsData(data) {
    return {
        faults: {
            eStopPressed: data['DB6,X0.0'],
            fault2: data['DB6,X0.1'],
            fault3: data['DB6,X0.2'],
            fault4: data['DB6,X0.3'],
            fault5: data['DB6,X0.4'],
            fault6: data['DB6,X0.5'],
            fault7: data['DB6,X0.6'],
            fault8: data['DB6,X0.7'],
            fault9: data['DB6,X1.0'],
            fault10: data['DB6,X1.1'],
            fault11: data['DB6,X1.2'],
            fault12: data['DB6,X1.3'],
            fault13: data['DB6,X1.4'],
            fault14: data['DB6,X1.5']
        },
        // Add a helper property to check if any fault is active
        hasActiveFaults: function() {
            return Object.values(this.faults).some(fault => fault === true);
        },
        // Add a helper property to get active fault count
        activeFaultCount: function() {
            return Object.values(this.faults).filter(fault => fault === true).length;
        },
        // Add a helper property to get list of active faults
        getActiveFaults: function() {
            const activeFaults = [];
            Object.entries(this.faults).forEach(([key, value]) => {
                if (value === true) {
                    activeFaults.push(key);
                }
            });
            return activeFaults;
        }
    };
}

function logDBFaultsValues(data) {
    console.log('\n=== DB Faults Values ===');
    console.log('\nActive Faults:');
    Object.entries(data.faults).forEach(([fault, state]) => {
        if (state) {
            console.log(`  ${fault}: ${state}`);
        }
    });
    console.log(`\nTotal Active Faults: ${data.activeFaultCount()}`);
    console.log('\n=================\n');
}

module.exports = {
    getDBFaultsItems,
    formatDBFaultsData,
    logDBFaultsValues
}; 
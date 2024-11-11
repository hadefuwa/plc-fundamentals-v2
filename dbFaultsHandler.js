const dbFaultsStructure = require('./dbFaults.json');

function getDBFaultsItems() {
    return [
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
}

function formatDBFaultsData(data) {
    // Debug log to see raw data
    //console.log('Raw DB6 data:', data);

    // Safety check for data
    if (!data) {
        console.warn('No DB6 data provided to formatDBFaultsData');
        return {
            faults: {},
            activeFaultCount: () => 0,
            getActiveFaults: () => []
        };
    }

    const faults = {
        eStopPressed: Boolean(data['DB6,X0.0']),
        NoSystemDetected: Boolean(data['DB6,X0.1']),
        fault3: Boolean(data['DB6,X0.2']),
        fault4: Boolean(data['DB6,X0.3']),
        fault5: Boolean(data['DB6,X0.4']),
        fault6: Boolean(data['DB6,X0.5']),
        fault7: Boolean(data['DB6,X0.6']),
        fault8: Boolean(data['DB6,X0.7']),
        fault9: Boolean(data['DB6,X1.0']),
        fault10: Boolean(data['DB6,X1.1']),
        fault11: Boolean(data['DB6,X1.2']),
        fault12: Boolean(data['DB6,X1.3']),
        fault13: Boolean(data['DB6,X1.4']),
        fault14: Boolean(data['DB6,X1.5'])
    };

    // Debug log formatted data
    //console.log('Formatted faults:', faults);

    return {
        faults,
        activeFaultCount: () => Object.values(faults).filter(Boolean).length,
        getActiveFaults: () => Object.entries(faults)
            .filter(([_, value]) => value)
            .map(([key, _]) => key)
    };
}

function logDBFaultsValues(formattedData) {
    /*
    //console.log('\n=== DB6 Faults Values ===');
    //console.log('\nFault States:');
    Object.entries(formattedData.faults).forEach(([fault, state]) => {
        //console.log(`  ${fault}: ${state}`);
    });
    //console.log(`\nTotal Active Faults: ${formattedData.activeFaultCount()}`);
    //console.log('\nActive Faults List:');
    formattedData.getActiveFaults().forEach(fault => {
        //console.log(`  - ${fault}`);
    });
    //console.log('\n=================\n');
    */
}

module.exports = {
    getDBFaultsItems,
    formatDBFaultsData,
    logDBFaultsValues
}; 
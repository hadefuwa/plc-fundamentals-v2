const db1Structure = require('./db1.json');

function getDB1Items() {
    const items = [
        // HMI Buttons
        'DB1,X0.0',  // Clear Forcing
        'DB1,X0.1',  // Fault Reset

        // Digital Inputs Bank A (0-7) with forced states
        'DB1,X2.0', 'DB1,X2.1', 'DB1,X2.2',   // DI A0
        'DB1,X4.0', 'DB1,X4.1', 'DB1,X4.2',   // DI A1
        'DB1,X6.0', 'DB1,X6.1', 'DB1,X6.2',   // DI A2
        'DB1,X8.0', 'DB1,X8.1', 'DB1,X8.2',   // DI A3
        'DB1,X10.0', 'DB1,X10.1', 'DB1,X10.2', // DI A4
        'DB1,X12.0', 'DB1,X12.1', 'DB1,X12.2', // DI A5
        'DB1,X14.0', 'DB1,X14.1', 'DB1,X14.2', // DI A6
        'DB1,X16.0', 'DB1,X16.1', 'DB1,X16.2', // DI A7
        
        // Digital Inputs Bank B (0-5) with forced states
        'DB1,X18.0', 'DB1,X18.1', 'DB1,X18.2', // DI B0
        'DB1,X20.0', 'DB1,X20.1', 'DB1,X20.2', // DI B1
        'DB1,X22.0', 'DB1,X22.1', 'DB1,X22.2', // DI B2
        'DB1,X24.0', 'DB1,X24.1', 'DB1,X24.2', // DI B3
        'DB1,X26.0', 'DB1,X26.1', 'DB1,X26.2', // DI B4
        'DB1,X28.0', 'DB1,X28.1', 'DB1,X28.2', // DI B5

        // Analogue Inputs with correct addresses
        'DB1,INT30',   // AI0 Raw value
        'DB1,REAL32',  // AI0 Scaled value
        'DB1,REAL36',  // AI0 Offset
        'DB1,REAL40',  // AI0 Scalar
        'DB1,INT44',   // AI1 Raw value (corrected from INT34)
        'DB1,REAL46',  // AI1 Scaled value (corrected from REAL36)
        'DB1,REAL50',  // AI1 Offset
        'DB1,REAL54',  // AI1 Scalar

        // Digital Outputs Bank A (0-7) with forced states
        'DB1,X58.0', 'DB1,X58.1', 'DB1,X58.2',   // DO A0
        'DB1,X60.0', 'DB1,X60.1', 'DB1,X60.2',   // DO A1
        'DB1,X62.0', 'DB1,X62.1', 'DB1,X62.2',   // DO A2
        'DB1,X64.0', 'DB1,X64.1', 'DB1,X64.2',   // DO A3
        'DB1,X66.0', 'DB1,X66.1', 'DB1,X66.2',   // DO A4
        'DB1,X68.0', 'DB1,X68.1', 'DB1,X68.2',   // DO A5
        'DB1,X70.0', 'DB1,X70.1', 'DB1,X70.2',   // DO A6
        'DB1,X72.0', 'DB1,X72.1', 'DB1,X72.2',   // DO A7
        
        // Digital Outputs Bank B with forced states
        'DB1,X74.0', 'DB1,X74.1', 'DB1,X74.2',   // DO B0
        'DB1,X76.0', 'DB1,X76.1', 'DB1,X76.2'    // DO B1
    ];

    return items;
}

function formatDB1Data(data) {
    return {
        hmiButtons: {
            clearForcing: data['DB1,X0.0'],
            faultReset: data['DB1,X0.1']
        },
        inputs: {
            a: {
                0: {
                    state: data['DB1,X2.0'],
                    forcedState: data['DB1,X2.1'],
                    forcedStatus: data['DB1,X2.2']
                },
                1: {
                    state: data['DB1,X4.0'],
                    forcedState: data['DB1,X4.1'],
                    forcedStatus: data['DB1,X4.2']
                },
                2: {
                    state: data['DB1,X6.0'],
                    forcedState: data['DB1,X6.1'],
                    forcedStatus: data['DB1,X6.2']
                },
                3: {
                    state: data['DB1,X8.0'],
                    forcedState: data['DB1,X8.1'],
                    forcedStatus: data['DB1,X8.2']
                },
                4: {
                    state: data['DB1,X10.0'],
                    forcedState: data['DB1,X10.1'],
                    forcedStatus: data['DB1,X10.2']
                },
                5: {
                    state: data['DB1,X12.0'],
                    forcedState: data['DB1,X12.1'],
                    forcedStatus: data['DB1,X12.2']
                },
                6: {
                    state: data['DB1,X14.0'],
                    forcedState: data['DB1,X14.1'],
                    forcedStatus: data['DB1,X14.2']
                },
                7: {
                    state: data['DB1,X16.0'],
                    forcedState: data['DB1,X16.1'],
                    forcedStatus: data['DB1,X16.2']
                }
            },
            b: {
                0: {
                    state: data['DB1,X18.0'],
                    forcedState: data['DB1,X18.1'],
                    forcedStatus: data['DB1,X18.2']
                },
                1: {
                    state: data['DB1,X20.0'],
                    forcedState: data['DB1,X20.1'],
                    forcedStatus: data['DB1,X20.2']
                },
                2: {
                    state: data['DB1,X22.0'],
                    forcedState: data['DB1,X22.1'],
                    forcedStatus: data['DB1,X22.2']
                },
                3: {
                    state: data['DB1,X24.0'],
                    forcedState: data['DB1,X24.1'],
                    forcedStatus: data['DB1,X24.2']
                },
                4: {
                    state: data['DB1,X26.0'],
                    forcedState: data['DB1,X26.1'],
                    forcedStatus: data['DB1,X26.2']
                },
                5: {
                    state: data['DB1,X28.0'],
                    forcedState: data['DB1,X28.1'],
                    forcedStatus: data['DB1,X28.2']
                }
            }
        },
        analogue: {
            ai0: {
                raw: data['DB1,INT30'],
                scaled: data['DB1,REAL32'],
                offset: data['DB1,REAL36'],
                scalar: data['DB1,REAL40']
            },
            ai1: {
                raw: data['DB1,INT44'],    // Updated from INT34
                scaled: data['DB1,REAL46'], // Updated from REAL36
                offset: data['DB1,REAL50'],
                scalar: data['DB1,REAL54']
            }
        },
        outputs: {
            a: {
                0: {
                    state: data['DB1,X58.0'],
                    forcedState: data['DB1,X58.1'],
                    forcedStatus: data['DB1,X58.2']
                },
                1: {
                    state: data['DB1,X60.0'],
                    forcedState: data['DB1,X60.1'],
                    forcedStatus: data['DB1,X60.2']
                },
                2: {
                    state: data['DB1,X62.0'],
                    forcedState: data['DB1,X62.1'],
                    forcedStatus: data['DB1,X62.2']
                },
                3: {
                    state: data['DB1,X64.0'],
                    forcedState: data['DB1,X64.1'],
                    forcedStatus: data['DB1,X64.2']
                },
                4: {
                    state: data['DB1,X66.0'],
                    forcedState: data['DB1,X66.1'],
                    forcedStatus: data['DB1,X66.2']
                },
                5: {
                    state: data['DB1,X68.0'],
                    forcedState: data['DB1,X68.1'],
                    forcedStatus: data['DB1,X68.2']
                },
                6: {
                    state: data['DB1,X70.0'],
                    forcedState: data['DB1,X70.1'],
                    forcedStatus: data['DB1,X70.2']
                },
                7: {
                    state: data['DB1,X72.0'],
                    forcedState: data['DB1,X72.1'],
                    forcedStatus: data['DB1,X72.2']
                }
            },
            b: {
                0: {
                    state: data['DB1,X74.0'],
                    forcedState: data['DB1,X74.1'],
                    forcedStatus: data['DB1,X74.2']
                },
                1: {
                    state: data['DB1,X76.0'],
                    forcedState: data['DB1,X76.1'],
                    forcedStatus: data['DB1,X76.2']
                }
            }
        }
    };
}

function logDB1Values(data) {
    console.log('\n=== DB1 Values ===');
    
    // HMI Buttons
    console.log('\nHMI Buttons:');
    console.log(`  Clear_Forcing (X0.0): ${data['DB1,X0.0']}`);
    console.log(`  Fault_Reset (X0.1): ${data['DB1,X0.1']}`);
    
    // Digital Inputs Bank A
    console.log('\nDigital Inputs Bank A:');
    
    // A0-A7 with all states
    console.log('  A0:');
    console.log(`    State (X2.0): ${data['DB1,X2.0']}`);
    console.log(`    ForcedState (X2.1): ${data['DB1,X2.1']}`);
    console.log(`    ForcedStatus (X2.2): ${data['DB1,X2.2']}`);
    
    console.log('  A1:');
    console.log(`    State (X4.0): ${data['DB1,X4.0']}`);
    console.log(`    ForcedState (X4.1): ${data['DB1,X4.1']}`);
    console.log(`    ForcedStatus (X4.2): ${data['DB1,X4.2']}`);
    
    console.log('  A2:');
    console.log(`    State (X6.0): ${data['DB1,X6.0']}`);
    console.log(`    ForcedState (X6.1): ${data['DB1,X6.1']}`);
    console.log(`    ForcedStatus (X6.2): ${data['DB1,X6.2']}`);
    
    console.log('  A3:');
    console.log(`    State (X8.0): ${data['DB1,X8.0']}`);
    console.log(`    ForcedState (X8.1): ${data['DB1,X8.1']}`);
    console.log(`    ForcedStatus (X8.2): ${data['DB1,X8.2']}`);
    
    console.log('  A4:');
    console.log(`    State (X10.0): ${data['DB1,X10.0']}`);
    console.log(`    ForcedState (X10.1): ${data['DB1,X10.1']}`);
    console.log(`    ForcedStatus (X10.2): ${data['DB1,X10.2']}`);
    
    console.log('  A5:');
    console.log(`    State (X12.0): ${data['DB1,X12.0']}`);
    console.log(`    ForcedState (X12.1): ${data['DB1,X12.1']}`);
    console.log(`    ForcedStatus (X12.2): ${data['DB1,X12.2']}`);
    
    console.log('  A6:');
    console.log(`    State (X14.0): ${data['DB1,X14.0']}`);
    console.log(`    ForcedState (X14.1): ${data['DB1,X14.1']}`);
    console.log(`    ForcedStatus (X14.2): ${data['DB1,X14.2']}`);
    
    console.log('  A7:');
    console.log(`    State (X16.0): ${data['DB1,X16.0']}`);
    console.log(`    ForcedState (X16.1): ${data['DB1,X16.1']}`);
    console.log(`    ForcedStatus (X16.2): ${data['DB1,X16.2']}`);
    
    // Digital Inputs Bank B
    console.log('\nDigital Inputs Bank B:');
    
    // B0-B5 with all states
    console.log('  B0:');
    console.log(`    State (X18.0): ${data['DB1,X18.0']}`);
    console.log(`    ForcedState (X18.1): ${data['DB1,X18.1']}`);
    console.log(`    ForcedStatus (X18.2): ${data['DB1,X18.2']}`);
    
    console.log('  B1:');
    console.log(`    State (X20.0): ${data['DB1,X20.0']}`);
    console.log(`    ForcedState (X20.1): ${data['DB1,X20.1']}`);
    console.log(`    ForcedStatus (X20.2): ${data['DB1,X20.2']}`);
    
    console.log('  B2:');
    console.log(`    State (X22.0): ${data['DB1,X22.0']}`);
    console.log(`    ForcedState (X22.1): ${data['DB1,X22.1']}`);
    console.log(`    ForcedStatus (X22.2): ${data['DB1,X22.2']}`);
    
    console.log('  B3:');
    console.log(`    State (X24.0): ${data['DB1,X24.0']}`);
    console.log(`    ForcedState (X24.1): ${data['DB1,X24.1']}`);
    console.log(`    ForcedStatus (X24.2): ${data['DB1,X24.2']}`);
    
    console.log('  B4:');
    console.log(`    State (X26.0): ${data['DB1,X26.0']}`);
    console.log(`    ForcedState (X26.1): ${data['DB1,X26.1']}`);
    console.log(`    ForcedStatus (X26.2): ${data['DB1,X26.2']}`);
    
    console.log('  B5:');
    console.log(`    State (X28.0): ${data['DB1,X28.0']}`);
    console.log(`    ForcedState (X28.1): ${data['DB1,X28.1']}`);
    console.log(`    ForcedStatus (X28.2): ${data['DB1,X28.2']}`);
    
    // Analogue Inputs with correct addresses
    console.log('\nAnalogue Inputs:');
    console.log(`  AI0:`);
    console.log(`    Raw (INT30): ${data['DB1,INT30']}`);
    console.log(`    Scaled (REAL32): ${data['DB1,REAL32']}V`);
    console.log(`    Offset (REAL36): ${data['DB1,REAL36']}`);
    console.log(`    Scalar (REAL40): ${data['DB1,REAL40']}`);
    
    console.log(`  AI1:`);
    console.log(`    Raw (INT44): ${data['DB1,INT44']}`);
    console.log(`    Scaled (REAL46): ${data['DB1,REAL46']}V`);
    console.log(`    Offset (REAL50): ${data['DB1,REAL50']}`);
    console.log(`    Scalar (REAL54): ${data['DB1,REAL54']}`);

    // Digital Outputs Bank A with forced states
    console.log('\nDigital Outputs Bank A:');
    console.log('  A0:');
    console.log(`    State (X58.0): ${data['DB1,X58.0']}`);
    console.log(`    ForcedState (X58.1): ${data['DB1,X58.1']}`);
    console.log(`    ForcedStatus (X58.2): ${data['DB1,X58.2']}`);
    
    console.log('  A1:');
    console.log(`    State (X60.0): ${data['DB1,X60.0']}`);
    console.log(`    ForcedState (X60.1): ${data['DB1,X60.1']}`);
    console.log(`    ForcedStatus (X60.2): ${data['DB1,X60.2']}`);
    
    console.log('  A2:');
    console.log(`    State (X62.0): ${data['DB1,X62.0']}`);
    console.log(`    ForcedState (X62.1): ${data['DB1,X62.1']}`);
    console.log(`    ForcedStatus (X62.2): ${data['DB1,X62.2']}`);
    
    console.log('  A3:');
    console.log(`    State (X64.0): ${data['DB1,X64.0']}`);
    console.log(`    ForcedState (X64.1): ${data['DB1,X64.1']}`);
    console.log(`    ForcedStatus (X64.2): ${data['DB1,X64.2']}`);
    
    console.log('  A4:');
    console.log(`    State (X66.0): ${data['DB1,X66.0']}`);
    console.log(`    ForcedState (X66.1): ${data['DB1,X66.1']}`);
    console.log(`    ForcedStatus (X66.2): ${data['DB1,X66.2']}`);
    
    console.log('  A5:');
    console.log(`    State (X68.0): ${data['DB1,X68.0']}`);
    console.log(`    ForcedState (X68.1): ${data['DB1,X68.1']}`);
    console.log(`    ForcedStatus (X68.2): ${data['DB1,X68.2']}`);
    
    console.log('  A6:');
    console.log(`    State (X70.0): ${data['DB1,X70.0']}`);
    console.log(`    ForcedState (X70.1): ${data['DB1,X70.1']}`);
    console.log(`    ForcedStatus (X70.2): ${data['DB1,X70.2']}`);
    
    console.log('  A7:');
    console.log(`    State (X72.0): ${data['DB1,X72.0']}`);
    console.log(`    ForcedState (X72.1): ${data['DB1,X72.1']}`);
    console.log(`    ForcedStatus (X72.2): ${data['DB1,X72.2']}`);
    
    // Digital Outputs Bank B with forced states
    console.log('\nDigital Outputs Bank B:');
    console.log('  B0:');
    console.log(`    State (X74.0): ${data['DB1,X74.0']}`);
    console.log(`    ForcedState (X74.1): ${data['DB1,X74.1']}`);
    console.log(`    ForcedStatus (X74.2): ${data['DB1,X74.2']}`);
    
    console.log('  B1:');
    console.log(`    State (X76.0): ${data['DB1,X76.0']}`);
    console.log(`    ForcedState (X76.1): ${data['DB1,X76.1']}`);
    console.log(`    ForcedStatus (X76.2): ${data['DB1,X76.2']}`);
    
    console.log('\n=================\n');
}

module.exports = {
    getDB1Items,
    formatDB1Data,
    logDB1Values
}; 
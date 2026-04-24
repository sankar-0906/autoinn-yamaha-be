// Test script to verify hierarchical data flow
import axios from 'axios';

async function testHierarchicalFlow() {
    console.log('=== Testing Hierarchical Vehicle Stock Inward Flow ===\n');
    
    // Sample data that matches PDF extraction format
    const testData = {
        dealerName: "PACER MOTORS PVT LTD(75700)",
        address: "M/S PACER MOTORS PVT. LTD. 1/A BELLARY MAIN ROAD NEAR SAGA HOTEL HEBBAL,BANGALORE KARNATAKA 560024",
        deliveryAddress: "M/S Kasthuri Industrial Estate,M/S. SUPERCITY SITE No.39/2, NAGARUR DASANAPURA HOBLI HUSKUR ROAD NEAR TO GOLDEN PALM RESORT Bangalore -562123.",
        invoiceNo: "I125011397",
        date: "2026-01-31T00:00:00.000Z",
        placeOfSupply: "BANGALORE, KARNATAKA",
        daNumber: "011397",
        daDate: "2026-01-31T00:00:00.000Z",
        modeOfTransport: "Truck",
        transporter: "DEEP FREIGHT CARRIER",
        from: "SRIPERUNBUDUR",
        to: "BANGALORE",
        insuranceCo: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED",
        policyNumber: "2457/00101315/000/01",
        vehicleNo: "HR55AD-2408",
        vehicles: [
            {
                modelCode: "BKXD00-010A",
                productName: null,
                qty: 1,
                chassisNo: "ME1SEL8F1T0031865",
                engineNo: "E33SE1173583",
                colorCode: "S8"
            },
            {
                modelCode: "BKXF00-010A",
                productName: null,
                qty: 5,
                chassisNo: "ME1SEB48F1T0079745",
                engineNo: "E33SE1179694",
                colorCode: "MNM3"
            },
            {
                modelCode: "BKXF00-010A",
                productName: null,
                qty: 5,
                chassisNo: "ME1SEB48F1T0079752",
                engineNo: "E33SE1179544",
                colorCode: "MNM3"
            }
        ]
    };

    try {
        // Step 1: Create a new record using hierarchical structure
        console.log('1. Creating new hierarchical record...');
        const createResponse = await axios.post('http://localhost:4000/vehicle-stock-inward', testData);
        
        if (createResponse.data.success) {
            console.log('   Record created successfully!');
            const recordId = createResponse.data.data.id;
            console.log(`   Record ID: ${recordId}`);
            
            // Step 2: Retrieve the record to verify data preservation
            console.log('\n2. Retrieving record to verify data preservation...');
            const getResponse = await axios.get(`http://localhost:4000/vehicle-stock-inward/${recordId}`);
            
            if (getResponse.data.success) {
                const retrievedData = getResponse.data.data;
                console.log('   Record retrieved successfully!');
                
                // Step 3: Verify the VEHICLES array contains all original data
                console.log('\n3. Verifying data preservation:');
                console.log(`   Expected vehicles: ${testData.vehicles.length}`);
                console.log(`   Retrieved vehicles: ${retrievedData.VEHICLES.length}`);
                
                let allDataPreserved = true;
                retrievedData.VEHICLES.forEach((vehicle, index) => {
                    const original = testData.vehicles[index];
                    console.log(`\n   Vehicle ${index + 1}:`);
                    console.log(`     Model Code: ${vehicle.modelCode} (expected: ${original.modelCode}) ${vehicle.modelCode === original.modelCode ? 'PASS' : 'FAIL'}`);
                    console.log(`     Qty: ${vehicle.qty} (expected: ${original.qty}) ${vehicle.qty === original.qty ? 'PASS' : 'FAIL'}`);
                    console.log(`     Chassis No: ${vehicle.chassisNo} (expected: ${original.chassisNo}) ${vehicle.chassisNo === original.chassisNo ? 'PASS' : 'FAIL'}`);
                    console.log(`     Engine No: ${vehicle.engineNo} (expected: ${original.engineNo}) ${vehicle.engineNo === original.engineNo ? 'PASS' : 'FAIL'}`);
                    console.log(`     Color Code: ${vehicle.colorCode} (expected: ${original.colorCode}) ${vehicle.colorCode === original.colorCode ? 'PASS' : 'FAIL'}`);
                    
                    if (vehicle.modelCode !== original.modelCode || 
                        vehicle.qty !== original.qty || 
                        vehicle.chassisNo !== original.chassisNo ||
                        vehicle.engineNo !== original.engineNo ||
                        vehicle.colorCode !== original.colorCode) {
                        allDataPreserved = false;
                    }
                });
                
                console.log(`\n=== RESULT: ${allDataPreserved ? 'SUCCESS' : 'FAILURE'} ===`);
                console.log(`All original data preserved: ${allDataPreserved ? 'YES' : 'NO'}`);
                
                if (allDataPreserved) {
                    console.log('\n   The hierarchical implementation works perfectly!');
                    console.log('   All Model Code, Qty, and Color data are preserved.');
                    console.log('   Frontend will receive complete data in the expected flat format.');
                }
                
            } else {
                console.log('   Failed to retrieve record');
            }
        } else {
            console.log('   Failed to create record');
            console.log('   Error:', createResponse.data.message);
        }
        
    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testHierarchicalFlow();

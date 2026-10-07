const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('====================================================');
  console.log('🚀 Running End-to-End Validation Test Suite');
  console.log('====================================================\n');

  let adminToken = '';
  let userToken = '';
  let createdVehicleId = '';
  let createdBookingId = '';
  let createdContactId = '';

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthData.status, 'online');
    console.log('   ✓ Health check passed:', healthData.appName);

    // 2. Admin Login
    console.log('\n2️⃣ Testing Admin Authentication...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@whatnext.com',
        password: 'Admin@1234',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert.strictEqual(adminLoginRes.status, 200);
    assert.strictEqual(adminLoginData.user.role, 'admin');
    assert.ok(adminLoginData.token);
    adminToken = adminLoginData.token;
    console.log(`   ✓ Admin login successful! Token issued for ${adminLoginData.user.name}`);

    // 3. User Registration & Login
    console.log('\n3️⃣ Testing User Registration & Authentication...');
    const testUserEmail = `driver_${Date.now()}@test.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alexander Vance',
        email: testUserEmail,
        phone: '+1 (555) 987-6543',
        password: 'TestPassword@123',
      }),
    });
    const regData = await regRes.json();
    assert.strictEqual(regRes.status, 201);
    assert.ok(regData.token);
    userToken = regData.token;
    console.log(`   ✓ User registered successfully: ${testUserEmail}`);

    // 4. Vehicle Inventory & Filters
    console.log('\n4️⃣ Testing Vehicle Showcase, Search & Filters...');
    const vehiclesRes = await fetch(`${BASE_URL}/vehicles`);
    const vehiclesData = await vehiclesRes.json();
    assert.strictEqual(vehiclesRes.status, 200);
    assert.ok(vehiclesData.vehicles.length >= 10);
    console.log(`   ✓ Fetched ${vehiclesData.vehicles.length} vehicles from database`);

    // Test Search Regex
    const searchRes = await fetch(`${BASE_URL}/vehicles?search=Hyperion`);
    const searchData = await searchRes.json();
    assert.strictEqual(searchRes.status, 200);
    assert.ok(searchData.vehicles.length >= 1);
    console.log(`   ✓ Search for "Hyperion" matched: ${searchData.vehicles[0].name}`);

    // Test Filter by VehicleType (SUV)
    const suvRes = await fetch(`${BASE_URL}/vehicles?vehicleType=SUV`);
    const suvData = await suvRes.json();
    assert.strictEqual(suvRes.status, 200);
    suvData.vehicles.forEach((v) => assert.strictEqual(v.vehicleType, 'SUV'));
    console.log(`   ✓ VehicleType filter (SUV) matched ${suvData.vehicles.length} SUVs`);

    // Test Featured Vehicles
    const featRes = await fetch(`${BASE_URL}/vehicles/featured`);
    const featData = await featRes.json();
    assert.strictEqual(featRes.status, 200);
    assert.ok(featData.vehicles.length > 0);
    console.log(`   ✓ Fetched ${featData.vehicles.length} featured showcase vehicles`);

    // 5. Admin Vehicle CRUD
    console.log('\n5️⃣ Testing Admin Vehicle CRUD Operations...');
    const createVehRes = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'WhatNext Apex Quantum GT',
        model: 'Quantum-GT',
        vehicleType: 'Hypercar',
        price: 290000,
        fuelType: 'EV',
        rangeOrMileage: '620 Miles',
        transmission: 'Single-Speed EV',
        seatingCapacity: 2,
        topSpeed: '280 mph',
        acceleration: '0-60 mph in 1.7s',
        horsepower: '1,500 hp',
        batteryCapacity: '145 kWh Quantum Matrix',
        releaseYear: 2027,
        description: 'Test vehicle created during automated suite execution.',
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
        features: ['Active Aerodynamic Diffusers', 'Quantum Compute HUD'],
        isAvailable: true,
        isFeatured: true,
      }),
    });
    const createVehData = await createVehRes.json();
    assert.strictEqual(createVehRes.status, 201);
    createdVehicleId = createVehData.vehicle._id;
    console.log(`   ✓ Vehicle created: ${createVehData.vehicle.name} (ID: ${createdVehicleId})`);

    // Update Vehicle
    const updateVehRes = await fetch(`${BASE_URL}/vehicles/${createdVehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 295000,
        topSpeed: '285 mph',
      }),
    });
    const updateVehData = await updateVehRes.json();
    assert.strictEqual(updateVehRes.status, 200);
    assert.strictEqual(updateVehData.vehicle.price, 295000);
    console.log(`   ✓ Vehicle updated successfully: New Price = $${updateVehData.vehicle.price}`);

    // 6. Test Drive Booking Workflow
    console.log('\n6️⃣ Testing Test Drive Booking Workflow...');
    const targetVehicle = vehiclesData.vehicles[0];
    const bookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        vehicleId: targetVehicle._id,
        customerName: 'Alexander Vance',
        email: testUserEmail,
        phone: '+1 (555) 987-6543',
        preferredDate: '2026-10-25',
        preferredTime: '11:30 AM - 12:30 PM',
        dealershipLocation: 'WhatNext Silicon Valley Experience Center',
        notes: 'Looking forward to high-speed track testing.',
      }),
    });
    const bookingData = await bookingRes.json();
    assert.strictEqual(bookingRes.status, 201);
    assert.ok(bookingData.booking.bookingReference);
    createdBookingId = bookingData.booking._id;
    console.log(`   ✓ Test drive booked! Ref: ${bookingData.booking.bookingReference} (Status: ${bookingData.booking.status})`);

    // User viewing own bookings
    const userBookingsRes = await fetch(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const userBookingsData = await userBookingsRes.json();
    assert.strictEqual(userBookingsRes.status, 200);
    assert.ok(userBookingsData.bookings.length >= 1);
    console.log(`   ✓ User retrieved ${userBookingsData.bookings.length} test drive booking(s) in personal portal`);

    // Admin updating booking status to Confirmed
    const updateStatusRes = await fetch(`${BASE_URL}/bookings/${createdBookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'Confirmed',
        notes: 'VIP Concierge assigned for track testing.',
      }),
    });
    const updateStatusData = await updateStatusRes.json();
    assert.strictEqual(updateStatusRes.status, 200);
    assert.strictEqual(updateStatusData.booking.status, 'Confirmed');
    console.log(`   ✓ Admin updated booking status to: ${updateStatusData.booking.status}`);

    // 7. Contact Inquiries Workflow
    console.log('\n7️⃣ Testing Contact Inquiry Workflow...');
    const contactRes = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Marcus Sterling',
        email: 'marcus.s@luxurycap.com',
        phone: '+1 (415) 555-4321',
        subject: 'Fleet procurement for executive security',
        inquiryType: 'Fleet Solutions',
        message: 'Requesting commercial catalog for 10 armored EV sedans.',
      }),
    });
    const contactData = await contactRes.json();
    assert.strictEqual(contactRes.status, 201);
    createdContactId = contactData.contact._id;
    console.log(`   ✓ Contact inquiry submitted: "${contactData.contact.subject}"`);

    // Admin reading contact inquiries
    const adminInquiriesRes = await fetch(`${BASE_URL}/contact`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminInquiriesData = await adminInquiriesRes.json();
    assert.strictEqual(adminInquiriesRes.status, 200);
    assert.ok(adminInquiriesData.messages.length >= 1);
    console.log(`   ✓ Admin fetched ${adminInquiriesData.messages.length} inquiries`);

    // 8. Admin Dashboard Analytics & User Management
    console.log('\n8️⃣ Testing Admin Analytics & User Operations...');
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsData = await statsRes.json();
    assert.strictEqual(statsRes.status, 200);
    assert.ok(statsData.stats.totalVehicles > 0);
    assert.ok(statsData.stats.totalBookings > 0);
    console.log('   ✓ Dashboard Stats Verified:');
    console.log(`     - Total Vehicles: ${statsData.stats.totalVehicles}`);
    console.log(`     - Total Users: ${statsData.stats.totalUsers}`);
    console.log(`     - Total Bookings: ${statsData.stats.totalBookings} (Pending: ${statsData.stats.pendingBookings}, Confirmed: ${statsData.stats.confirmedBookings})`);
    console.log(`     - Total Inquiries: ${statsData.stats.totalInquiries}`);

    // Clean up created test vehicle
    await fetch(`${BASE_URL}/vehicles/${createdVehicleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('   ✓ Test cleanup completed.');

    console.log('\n====================================================');
    console.log('🎉 ALL 8 TEST SUITES PASSED FLAWLESSLY! (100% SUCCESS)');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    process.exit(1);
  }
};

runTests();

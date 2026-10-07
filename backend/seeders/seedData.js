const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const TestDriveBooking = require('../models/TestDriveBooking');
const ContactMessage = require('../models/ContactMessage');

const seedVehicles = [
  {
    name: 'WhatNext Vision Hyperion GT',
    model: 'Hyperion-GT',
    vehicleType: 'Hypercar',
    price: 245000,
    fuelType: 'EV',
    rangeOrMileage: '580 Miles / 933 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 2,
    topSpeed: '260 mph (418 km/h)',
    acceleration: '0-60 mph in 1.9s',
    horsepower: '1,200 hp',
    batteryCapacity: '130 kWh Solid-State Matrix',
    releaseYear: 2026,
    badge: 'Flagship Hypercar',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 3,
    description:
      'The pinnacle of electrified performance. WhatNext Vision Hyperion GT unites revolutionary solid-state cell architecture with aerospace carbon-composite chassis engineering. Engineered to deliver mind-bending zero-to-sixty acceleration under two seconds while maintaining unmatched grand-touring refinement.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Quad-Motor Vectoring All-Wheel Drive',
      'Quantum Neural Autopilot (Level 4 Ready)',
      'Active Morphing Carbon Aero Wings',
      'Bespoke Biometric Cockpit & HUD',
      '900V Ultra-Fast Megawatt Charging Architecture',
      'F1-Derived Ceramic-Matrix Regenerative Brakes',
    ],
    specs: {
      motor: 'Quad Synchronous Electric Motors',
      drivetrain: 'Intelligent Torque-Vectoring AWD',
      chargingTime: '10% to 80% in 12 min (400kW DC)',
      dimensions: '4,780mm L x 2,040mm W x 1,190mm H',
      warranty: '10-Year / 150,000-Mile Battery & Powertrain',
      cargoSpace: '380 Litres Front & Rear Combined',
    },
  },
  {
    name: 'WhatNext Aetheria X-Matrix',
    model: 'Aetheria-X',
    vehicleType: 'SUV',
    price: 115000,
    fuelType: 'EV',
    rangeOrMileage: '480 Miles / 772 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 7,
    topSpeed: '185 mph (298 km/h)',
    acceleration: '0-60 mph in 3.1s',
    horsepower: '750 hp',
    batteryCapacity: '115 kWh Ultium Pack',
    releaseYear: 2026,
    badge: 'Luxury 7-Seater EV',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 8,
    description:
      'Uncompromising luxury meets supreme family versatility. The Aetheria X-Matrix redefines the modern electric full-size SUV with panoramic glass skyroof, executive captain chairs with hot-stone massage, and adaptive multi-chamber air suspension that floats effortlessly across any terrain.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      '3-Row Executive Seating with Zero-Gravity Recline',
      '38-inch Curved OLED Panoramic Cockpit',
      'Electrochromic Variable Smart Glass Roof',
      'Air Suspension with Terrain Scanner AI',
      'Bi-Directional Vehicle-to-Home (V2H) Powering',
      'Dolby Atmos 28-Speaker Studio Sound System',
    ],
    specs: {
      motor: 'Dual High-Output Permanent Magnet Motors',
      drivetrain: 'Adaptive All-Weather AWD',
      chargingTime: '10% to 80% in 18 min (350kW DC)',
      dimensions: '5,080mm L x 2,010mm W x 1,740mm H',
      warranty: '8-Year / 120,000-Mile Complete Warranty',
      cargoSpace: '920 Litres (Expands to 2,240L)',
    },
  },
  {
    name: 'WhatNext Chronos Cyber Sedan',
    model: 'Chronos-V',
    vehicleType: 'Sedan',
    price: 89000,
    fuelType: 'EV',
    rangeOrMileage: '520 Miles / 836 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 5,
    topSpeed: '190 mph (305 km/h)',
    acceleration: '0-60 mph in 2.6s',
    horsepower: '620 hp',
    batteryCapacity: '105 kWh Silicon-Anode Battery',
    releaseYear: 2026,
    badge: 'Executive Electric Sedan',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 12,
    description:
      'The modern benchmark for intelligent executive sedans. Sculpted with aerodynamic purity (0.198 Cd drag coefficient), the Chronos Cyber Sedan seamlessly blends effortless long-range touring capability with athletic road agility and futuristic AI voice assistance.',
    images: [
      'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Autonomous Highway Pilot with Lane Change AI',
      'Continuous Matrix LED Cyber Lightbar',
      'Sustainable Vegan Nappa Leather & Open-Pore Walnut',
      'Rear Seat Interactive Climate & Entertainment Tablets',
      'Acoustic Dual-Pane Privacy Glass',
      'Over-The-Air (OTA) Performance Firmware Updates',
    ],
    specs: {
      motor: 'Dual Synchronous AC Motors',
      drivetrain: 'Dynamic Torque-Split AWD',
      chargingTime: '10% to 80% in 16 min (300kW DC)',
      dimensions: '4,960mm L x 1,940mm W x 1,430mm H',
      warranty: '8-Year / 100,000-Mile Battery Warranty',
      cargoSpace: '650 Litres Frunk & Trunk',
    },
  },
  {
    name: 'WhatNext Apex Nomad Crossover',
    model: 'Nomad-AT',
    vehicleType: 'Crossover',
    price: 72000,
    fuelType: 'EV',
    rangeOrMileage: '440 Miles / 708 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 5,
    topSpeed: '160 mph (257 km/h)',
    acceleration: '0-60 mph in 3.6s',
    horsepower: '500 hp',
    batteryCapacity: '95 kWh Ruggedized Pack',
    releaseYear: 2026,
    badge: 'All-Terrain Adventure EV',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 6,
    description:
      'Engineered for fearless explorers who demand sustainability without borders. With 10.5-inch variable ground clearance, reinforced underbody skid plating, and solar camping auxiliary integration, the Apex Nomad dominates gravel, snow, and urban streets with equal poise.',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Trail-Trek 4WD with Rock Crawl & Deep Mud Modes',
      'Integrated Solar Roof Auxiliary Range Booster',
      'Washable All-Weather Interior with Tactical Storage',
      '360-Degree Drone Scout Launch Platform',
      'Heavy-Duty 6,000 lbs Towing Capacity',
      'Exterior 120V/240V Camp Power Outlets',
    ],
    specs: {
      motor: 'Dual High-Torque Electric Motors',
      drivetrain: 'Active Terrain AWD with Locking E-Diff',
      chargingTime: '15% to 80% in 20 min (250kW DC)',
      dimensions: '4,750mm L x 1,980mm W x 1,680mm H',
      warranty: '8-Year / 100,000-Mile Adventure Warranty',
      cargoSpace: '810 Litres',
    },
  },
  {
    name: 'WhatNext Solaria Concept Spider',
    model: 'Solaria-GT',
    vehicleType: 'Concept',
    price: 320000,
    fuelType: 'EV',
    rangeOrMileage: '600 Miles / 965 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 2,
    topSpeed: '275 mph (442 km/h)',
    acceleration: '0-60 mph in 1.75s',
    horsepower: '1,450 hp',
    batteryCapacity: '140 kWh Quantum-Graphite Matrix',
    releaseYear: 2027,
    badge: 'Limited Edition Concept',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 2,
    description:
      'A breathtaking glimpse into WhatNext Vision Motors 2030 design manifesto. An open-cockpit aerodynamic sculpture that harnesses ambient solar radiation through micro-crystalline skin paint while deploying 1,450 all-electric horsepower.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Full Monocoque Carbon Titanium Body',
      'Photovoltaic Nano-Coating Surface for Passive Charging',
      'Holographic Augmented Reality Windshield HUD',
      'Active Ground Effect Venturi Tunnels',
      'Titanium 3D-Printed Suspension Wishbones',
    ],
    specs: {
      motor: 'Quad In-Wheel Axial Flux Motors',
      drivetrain: 'Hyper-Vectoring 4-Wheel Drive',
      chargingTime: '10% to 80% in 10 min (500kW DC)',
      dimensions: '4,650mm L x 2,080mm W x 1,120mm H',
      warranty: 'Bespoke Concierge Lifetime Support',
      cargoSpace: '220 Litres',
    },
  },
  {
    name: 'WhatNext Elysium Luxury Grand Tourer',
    model: 'Elysium-GT',
    vehicleType: 'Luxury GT',
    price: 165000,
    fuelType: 'Hybrid',
    rangeOrMileage: '680 Miles Combined (120 Miles Pure EV)',
    transmission: 'Dual-Clutch 8-Speed',
    seatingCapacity: 4,
    topSpeed: '215 mph (346 km/h)',
    acceleration: '0-60 mph in 2.7s',
    horsepower: '880 hp',
    batteryCapacity: '45 kWh + Twin-Turbo Hybrid V8',
    releaseYear: 2026,
    badge: 'Hybrid Super GT',
    isFeatured: true,
    isAvailable: true,
    inventoryCount: 4,
    description:
      'Crafted for transcontinental voyages of supreme elegance. The Elysium pairs a twin-turbocharged hybrid powertrain with hand-stitched semi-aniline leather, crystal glass switchgear, and active noise-cancellation acoustics.',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Plug-in Hybrid with 120 Miles Zero-Emission Pure EV Range',
      'Handcrafted Open-Pore Yacht Wood Trim',
      'Active Acoustic Anti-Noise Cancellation Cabin',
      'Thermal Night Vision Pedestrian Detection',
      'Smart Valet Auto-Parking via Mobile App',
    ],
    specs: {
      motor: 'Twin-Turbocharged 4.0L V8 + Dual Front Motors',
      drivetrain: 'Hybrid All-Wheel Drive',
      chargingTime: '10% to 100% in 35 min (50kW DC)',
      dimensions: '5,020mm L x 1,970mm W x 1,380mm H',
      warranty: '8-Year / 100,000-Mile Complete Warranty',
      cargoSpace: '480 Litres',
    },
  },
  {
    name: 'WhatNext Pulse Cyber Hatch',
    model: 'Pulse-E',
    vehicleType: 'Sedan',
    price: 46000,
    fuelType: 'EV',
    rangeOrMileage: '360 Miles / 579 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 5,
    topSpeed: '140 mph (225 km/h)',
    acceleration: '0-60 mph in 4.5s',
    horsepower: '320 hp',
    batteryCapacity: '68 kWh Matrix Pack',
    releaseYear: 2026,
    badge: 'Urban Performance EV',
    isFeatured: false,
    isAvailable: true,
    inventoryCount: 15,
    description:
      'Nimble, energetic, and ultra-connected. The Pulse Cyber Hatch is the premier urban electric vehicle, featuring tight turning radius, fast acceleration, and next-gen smartphone digital key sharing.',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Wireless Apple CarPlay & Android Auto 2.0',
      'Tight 9.8m Urban Turning Circle',
      'Smart Regenerative One-Pedal Driving',
      'Wireless Fast Qi-Charging Pads for 4 Devices',
      'Rear Reversing Camera with 3D Bird-Eye View',
    ],
    specs: {
      motor: 'Single Rear Permanent Magnet Synchronous Motor',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      chargingTime: '10% to 80% in 22 min (150kW DC)',
      dimensions: '4,320mm L x 1,820mm W x 1,460mm H',
      warranty: '8-Year / 100,000-Mile Battery Warranty',
      cargoSpace: '450 Litres (Expands to 1,200L)',
    },
  },
  {
    name: 'WhatNext Stratos Hydrogen Hybrid',
    model: 'Stratos-H2',
    vehicleType: 'Concept',
    price: 198000,
    fuelType: 'Hydrogen',
    rangeOrMileage: '720 Miles / 1,158 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 4,
    topSpeed: '220 mph (354 km/h)',
    acceleration: '0-60 mph in 2.4s',
    horsepower: '950 hp',
    batteryCapacity: 'Next-Gen 700-Bar Hydrogen Fuel Cell + 30kWh Buffer',
    releaseYear: 2026,
    badge: 'Zero-Emission Hydrogen GT',
    isFeatured: false,
    isAvailable: true,
    inventoryCount: 2,
    description:
      'Refueling in just 3 minutes with water vapor as its only emission. The Stratos marries a state-of-the-art hydrogen fuel cell with high-discharge buffer batteries to achieve unmatched cross-country range.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      '3-Minute 700-Bar Hydrogen Refueling Process',
      'Clean Air Purifying Intake System (Filters 99.9% PM2.5)',
      'Carbon-Fiber Reinforced Type-IV Hydrogen Storage Tanks',
      'Formula-E Inverter Technology',
    ],
    specs: {
      motor: 'Tri-Motor Electric Drivetrain',
      drivetrain: 'Torque Vectoring Electric AWD',
      chargingTime: '3-Minute Hydrogen Refuel',
      dimensions: '4,980mm L x 2,010mm W x 1,320mm H',
      warranty: '8-Year Fuel Cell & Drivetrain Warranty',
      cargoSpace: '510 Litres',
    },
  },
  {
    name: 'WhatNext Nebula Pure SUV',
    model: 'Nebula-5',
    vehicleType: 'SUV',
    price: 68000,
    fuelType: 'EV',
    rangeOrMileage: '410 Miles / 660 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 5,
    topSpeed: '155 mph (250 km/h)',
    acceleration: '0-60 mph in 4.1s',
    horsepower: '420 hp',
    batteryCapacity: '88 kWh Lithium-Iron-Phosphate (LFP)',
    releaseYear: 2026,
    badge: 'Popular Family SUV',
    isFeatured: false,
    isAvailable: true,
    inventoryCount: 10,
    description:
      'The ultimate modern family sanctuary on wheels. Featuring ultra-durable cobalt-free LFP battery chemistry, child-friendly stain-resistant interiors, built-in air ionization, and best-in-class 5-Star safety rating.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Full 5-Star Euro NCAP / NHTSA Safety Structure',
      'HEPA Hospital-Grade Air Purification System',
      'Panoramic Star-Gazing Glass Roof',
      'Heated & Ventilated Front and Rear Seats',
    ],
    specs: {
      motor: 'Dual Induction Electric Motors',
      drivetrain: 'Intelligent All-Wheel Drive',
      chargingTime: '10% to 80% in 25 min (200kW DC)',
      dimensions: '4,800mm L x 1,920mm W x 1,650mm H',
      warranty: '8-Year / 120,000-Mile Battery Warranty',
      cargoSpace: '780 Litres',
    },
  },
  {
    name: 'WhatNext Zenith Hyper-Coupe',
    model: 'Zenith-Track',
    vehicleType: 'Coupe',
    price: 285000,
    fuelType: 'EV',
    rangeOrMileage: '500 Miles / 804 Km',
    transmission: 'Single-Speed EV',
    seatingCapacity: 2,
    topSpeed: '265 mph (426 km/h)',
    acceleration: '0-60 mph in 1.85s',
    horsepower: '1,350 hp',
    batteryCapacity: '125 kWh Graphene-Infused Core',
    releaseYear: 2026,
    badge: 'Track Master Edition',
    isFeatured: false,
    isAvailable: true,
    inventoryCount: 2,
    description:
      'Engineered for track dominance without sacrificing highway grand-touring serenity. Dynamic telemetry, active rear-wheel steering, and downforce generating ground-effects keep you glued to the tarmac.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'Telemetry Racing Suite with Real-Time Lap Analysis',
      'Active Rear-Wheel Steering (up to 5 degrees)',
      'Carbon Ceramic 6-Piston Track Calipers',
      'Alcantara Wrapped Racing Cockpit',
    ],
    specs: {
      motor: 'Tri-Motor High-RPM Synchronous Powertrain',
      drivetrain: 'Track-Vectoring AWD',
      chargingTime: '10% to 80% in 14 min (350kW DC)',
      dimensions: '4,710mm L x 2,020mm W x 1,220mm H',
      warranty: '8-Year / 100,000-Mile Powertrain Warranty',
      cargoSpace: '320 Litres',
    },
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Checking database state...');

    // 1. Seed Admin User
    let adminUser = await User.findOne({ email: 'admin@whatnext.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'WhatNext Administrator',
        email: 'admin@whatnext.com',
        phone: '+1 (800) 555-0199',
        password: 'Admin@1234',
        role: 'admin',
      });
      console.log('[Seeder] Admin user created: admin@whatnext.com / Admin@1234');
    }

    // 2. Seed Demo User
    let demoUser = await User.findOne({ email: 'sarah.chen@example.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+1 (415) 555-8392',
        password: 'User@1234',
        role: 'user',
      });
      console.log('[Seeder] Demo user created: sarah.chen@example.com / User@1234');
    }

    // 3. Seed Vehicles
    const vehicleCount = await Vehicle.countDocuments();
    let seededVehicles = [];
    if (vehicleCount === 0) {
      seededVehicles = await Vehicle.insertMany(seedVehicles);
      console.log(`[Seeder] Seeded ${seededVehicles.length} vehicles into inventory.`);
    } else {
      seededVehicles = await Vehicle.find();
      console.log(`[Seeder] Inventory already contains ${vehicleCount} vehicles.`);
    }

    // 4. Seed Sample Bookings if empty
    const bookingCount = await TestDriveBooking.countDocuments();
    if (bookingCount === 0 && seededVehicles.length > 0) {
      await TestDriveBooking.create([
        {
          user: demoUser._id,
          vehicle: seededVehicles[0]._id,
          customerName: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          phone: '+1 (415) 555-8392',
          preferredDate: '2026-10-15',
          preferredTime: '11:00 AM - 12:00 PM',
          dealershipLocation: 'WhatNext Silicon Valley Experience Center',
          notes: 'Interested in track mode and charging infrastructure.',
          status: 'Confirmed',
        },
        {
          customerName: 'Marcus Vance',
          email: 'marcus.vance@techcorp.io',
          phone: '+1 (212) 555-0144',
          vehicle: seededVehicles[1]._id,
          preferredDate: '2026-10-18',
          preferredTime: '02:00 PM - 03:00 PM',
          dealershipLocation: 'WhatNext New York Flagship Gallery',
          notes: 'Looking to evaluate the 7-seat configuration.',
          status: 'Pending',
        },
      ]);
      console.log('[Seeder] Seeded sample test drive bookings.');
    }

    // 5. Seed Sample Inquiries if empty
    const contactCount = await ContactMessage.countDocuments();
    if (contactCount === 0) {
      await ContactMessage.create([
        {
          name: 'David Reynolds',
          email: 'dreynolds@globalcapital.com',
          phone: '+44 20 7946 0912',
          subject: 'Commercial Fleet Inquiries for Executive Transportation',
          inquiryType: 'Fleet Solutions',
          message:
            'Hello WhatNext team, we are considering acquiring 15 Chronos Cyber Sedans for our executive fleet in London and Geneva. Please connect us with your corporate solutions director.',
          status: 'New',
        },
        {
          name: 'Elena Rostova',
          email: 'elena.rostova@designweekly.com',
          phone: '+1 (310) 555-7182',
          subject: 'Press Feature on Solaria Concept Aerodynamics',
          inquiryType: 'Press & Media',
          message:
            'We would love to feature the design team behind WhatNext Vision Motors in our upcoming automotive innovation issue.',
          status: 'Read',
          adminNotes: 'Contacted editorial desk for scheduling interview.',
        },
      ]);
      console.log('[Seeder] Seeded sample contact inquiries.');
    }

    console.log('[Seeder] Database seeding completed successfully!');
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error.message);
  }
};

module.exports = { seedDatabase, seedVehicles };

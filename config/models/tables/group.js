const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Business = require('./business');
const User = require('./user');
const fs = require('fs');
const path = require('path');
const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs-node');
let useModel = null;

async function loadUSEModel() {
  if (!useModel) {
    useModel = await use.load();
  }
  return useModel;
}

async function getGroupEmbedding({ description, category, price, discount, size }) {
  const model = await loadUSEModel();
  const enrichedText = `
    ${description}
    Category: ${category}.
    Price: $${price}.
    Group size: ${size}.
    Discount: $${discount}.
  `;
  const embeddings = await model.embed([enrichedText]);
  const embeddingArray = await embeddings.array();

  return `[${embeddingArray[0].join(',')}]`;
}

const ensureVectorColumn = async () => {
  const result = await sequelize.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'Group' AND column_name = 'groupEmbedding';
  `);

  if (result[0].length === 0) {
    console.log('Adding groupEmbedding column as vector(512)...');
    await sequelize.query(`
      ALTER TABLE "Group"
      ADD COLUMN "groupEmbedding" vector(512);
    `);
  } else {
    console.log('groupEmbedding column already exists');
  }
};

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Business,
      key: 'businessNumber'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  purchaseMade: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  groupEmbedding: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Group',
  timestamps: false
});

const readImage = (imagePath) => {
  const resolvedPath = path.resolve('/app/Group/images', imagePath);
  try {
    return fs.readFileSync(resolvedPath);
  } catch (err) {
    console.error(`Error reading image at ${resolvedPath}:`, err.message);
    return null;
  }
};

const categories = [
  'Electronics', 'Home Appliances', 'Fitness', 'Office Supplies', 'Kitchen',
  'Outdoor', 'Pet Care', 'Beauty', 'Baby', 'Gardening', 'Travel', 'Smart Home',
  'Fashion', 'Health', 'Books', 'Automotive', 'Music', 'Gaming', 'Photography',
  'Cycling', 'Camping', 'Art', 'Home Decor', 'Jewelry', 'Sports'
];


const insertInitialGroups = async () => {
  await ensureVectorColumn();
  const existingGroups = await Group.findAll();
  console.log('Trying to insert initial groups');
  if (existingGroups.length > 0) {
    console.log('Initial groups already exist');
    return;
  }

  const groupItems = [
    // Electronics
    { name: 'iPhone 13', description: 'Join the group to get a discount on the Apple iPhone 13 smartphone.', category: 'Electronics' },
    { name: 'iPhone 14', description: 'Group buy for the new Apple iPhone 14 smartphone at a special price.', category: 'Electronics' },
    { name: 'iPhone 15', description: 'Get the Apple iPhone 15 smartphone with a group discount.', category: 'Electronics' },
    { name: 'Samsung Galaxy S22', description: 'Group buy for Samsung Galaxy S22 5G smartphone.', category: 'Electronics' },
    { name: 'Samsung Galaxy S23', description: 'Join the group for a Samsung Galaxy S23 Ultra smartphone deal.', category: 'Electronics' },
    { name: 'Google Pixel 7', description: 'Group buy for Google Pixel 7 Pro smartphone.', category: 'Electronics' },
    { name: 'Google Pixel 8', description: 'Group buy for Google Pixel 8 smartphone.', category: 'Electronics' },
    { name: 'Sony WF-1000XM5 Earbuds', description: 'Group buy for Sony WF-1000XM5 noise-cancelling earbuds.', category: 'Electronics' },
    { name: 'Bose QuietComfort Earbuds', description: 'Discounted Bose QuietComfort Earbuds II for group buyers.', category: 'Electronics' },
    { name: 'AirPods Pro 2', description: 'Get Apple AirPods Pro 2nd Gen at a lower price.', category: 'Electronics' },
    { name: 'Samsung Galaxy Watch 6', description: 'Group buy for Samsung Galaxy Watch 6.', category: 'Electronics' },
    { name: 'Apple Watch Series 8', description: 'Group buy for Apple Watch Series 8.', category: 'Electronics' },
    { name: 'Samsung Galaxy Tab S9', description: 'Group buy for Samsung Galaxy Tab S9 tablet.', category: 'Electronics' },
    { name: 'iPad Air 5', description: 'Discounted Apple iPad Air 5th Gen for group buyers.', category: 'Electronics' },
    { name: 'Dell XPS 13 Laptop', description: 'Get a Dell XPS 13 ultrabook at a group price.', category: 'Electronics' },
    { name: 'MacBook Air M2', description: 'Group buy for Apple MacBook Air M2 laptops.', category: 'Electronics' },

    // Home Appliances
    { name: 'Samsung 65 QLED 4K TV', description: 'Get a great deal on a Samsung 65-inch QLED 4K TV.', category: 'Home Appliances' },
    { name: 'LG 55 OLED C3 TV', description: 'Group buy for LG 55-inch OLED C3 TVs.', category: 'Home Appliances' },
    { name: 'Sony Bravia XR 75 TV', description: 'Discounted Sony Bravia XR 75-inch TVs for group buyers.', category: 'Home Appliances' },
    { name: 'iRobot Roomba j7+', description: 'Group buy for iRobot Roomba j7+ robot vacuums.', category: 'Home Appliances' },
    { name: 'Roborock S8 Pro Ultra', description: 'Discounted Roborock S8 Pro Ultra robot vacuums.', category: 'Home Appliances' },
    { name: 'Dyson Pure Cool TP07 Air Purifier', description: 'Get a Dyson Pure Cool TP07 air purifier at a group price.', category: 'Home Appliances' },
    { name: 'Levoit Core 600S Air Purifier', description: 'Discounted Levoit Core 600S air purifiers for group buyers.', category: 'Home Appliances' },
    { name: 'Panasonic NN-SN966S Microwave Oven', description: 'Group buy for Panasonic NN-SN966S microwave ovens.', category: 'Home Appliances' },
    { name: 'Toshiba EM131A5C-BS Microwave', description: 'Discounted Toshiba EM131A5C-BS microwaves for group buyers.', category: 'Home Appliances' },
    { name: 'LG InstaView Door-in-Door Refrigerator', description: 'Group buy for LG InstaView Door-in-Door refrigerators.', category: 'Home Appliances' },
    { name: 'Bosch 800 Series Dishwasher', description: 'Discounted Bosch 800 Series dishwashers for group buyers.', category: 'Home Appliances' },

    // Fitness
    { name: 'NordicTrack Commercial 1750 Treadmill', description: 'Purchase a NordicTrack Commercial 1750 treadmill at a discounted price.', category: 'Fitness' },
    { name: 'Bowflex Max Trainer M9', description: 'Group buy for Bowflex Max Trainer M9 elliptical machines.', category: 'Fitness' },
    { name: 'Manduka PRO Yoga Mat', description: 'Group buy for Manduka PRO yoga mats.', category: 'Fitness' },
    { name: 'Bowflex SelectTech 552 Adjustable Dumbbells', description: 'Discounted Bowflex SelectTech 552 adjustable dumbbells.', category: 'Fitness' },
    { name: 'TRX All-in-One Suspension Training System', description: 'Get a TRX All-in-One suspension trainer at a group price.', category: 'Fitness' },
    { name: 'Fit Simplify Resistance Bands Set', description: 'Group buy for Fit Simplify resistance bands.', category: 'Fitness' },

    // Office Supplies
    { name: 'Herman Miller Aeron Office Chair', description: 'Get a Herman Miller Aeron ergonomic office chair at a lower price.', category: 'Office Supplies' },
    { name: 'Flexispot E7 Standing Desk', description: 'Group buy for Flexispot E7 adjustable standing desks.', category: 'Office Supplies' },
    { name: 'BenQ e-Reading LED Desk Lamp', description: 'Discounted BenQ e-Reading LED desk lamps for group buyers.', category: 'Office Supplies' },
    { name: 'VIVO Dual Monitor Desk Mount', description: 'Get a VIVO dual monitor desk mount at a group price.', category: 'Office Supplies' },
    { name: 'Logitech MX Keys Wireless Keyboard', description: 'Group buy for Logitech MX Keys wireless keyboards.', category: 'Office Supplies' },

    // Kitchen
    { name: 'Vitamix 5200 Blender', description: 'Join the group to buy a Vitamix 5200 professional blender.', category: 'Kitchen' },
    { name: 'Ninja Foodi Power Blender', description: 'Discounted Ninja Foodi Power blenders for group buyers.', category: 'Kitchen' },
    { name: 'T-fal Ultimate Hard Anodized Cookware Set', description: 'Group buy for T-fal Ultimate cookware sets.', category: 'Kitchen' },
    { name: 'All-Clad D3 Stainless Cookware Set', description: 'Discounted All-Clad D3 stainless cookware sets.', category: 'Kitchen' },
    { name: 'Philips Premium Airfryer XXL', description: 'Group buy for Philips Premium Airfryer XXL.', category: 'Kitchen' },
    { name: 'COSORI Pro II Air Fryer', description: 'Discounted COSORI Pro II air fryers for group buyers.', category: 'Kitchen' },
    { name: 'DeLonghi La Specialista Espresso Machine', description: 'Get a DeLonghi La Specialista espresso machine at a group price.', category: 'Kitchen' },
    { name: 'Breville Barista Express Espresso Machine', description: 'Group buy for Breville Barista Express espresso machines.', category: 'Kitchen' },

    // Outdoor
    { name: 'Coleman Sundome 4-Person Tent', description: 'Get a Coleman Sundome 4-person tent at a discounted price.', category: 'Outdoor' },
    { name: 'Osprey Atmos AG 65 Backpack', description: 'Group buy for Osprey Atmos AG 65 hiking backpacks.', category: 'Outdoor' },
    { name: 'Weber Q1200 Portable Gas Grill', description: 'Discounted Weber Q1200 portable gas grills for group buyers.', category: 'Outdoor' },
    { name: 'YETI Tundra 45 Cooler', description: 'Group buy for YETI Tundra 45 coolers.', category: 'Outdoor' },

    // Pet Care
    { name: 'Blue Buffalo Life Protection Formula Dog Food', description: 'Buy Blue Buffalo Life Protection Formula dog food at a lower price.', category: 'Pet Care' },
    { name: 'Go Pet Club 72 Cat Tree', description: 'Group buy for Go Pet Club 72-inch cat trees.', category: 'Pet Care' },
    { name: 'Furhaven Orthopedic Dog Bed', description: 'Discounted Furhaven orthopedic dog beds for group buyers.', category: 'Pet Care' },
    { name: 'PetSafe ScoopFree Self-Cleaning Litter Box', description: 'Group buy for PetSafe ScoopFree self-cleaning litter boxes.', category: 'Pet Care' },

    // Beauty
    { name: 'CeraVe Hydrating Skincare Set', description: 'Join the group to get a discount on CeraVe hydrating skincare set.', category: 'Beauty' },
    { name: 'Dyson Supersonic Hair Dryer', description: 'Group buy for Dyson Supersonic hair dryers.', category: 'Beauty' },
    { name: 'NanoSteamer Large 3-in-1 Facial Steamer', description: 'Discounted NanoSteamer facial steamers for group buyers.', category: 'Beauty' },
    { name: 'Revlon One-Step Volumizer Hair Dryer', description: 'Group buy for Revlon One-Step Volumizer hair dryers.', category: 'Beauty' },

    // Baby
    { name: 'UPPAbaby Vista V2 Stroller', description: 'Purchase a UPPAbaby Vista V2 stroller at a discounted price.', category: 'Baby' },
    { name: 'Infant Optics DXR-8 PRO Baby Monitor', description: 'Discounted Infant Optics DXR-8 PRO baby monitors.', category: 'Baby' },
    { name: 'Ergobaby Omni 360 Baby Carrier', description: 'Group buy for Ergobaby Omni 360 baby carriers.', category: 'Baby' },
    { name: 'Graco Pack and Play Playard', description: 'Discounted Graco Pack \'n Play playards for group buyers.', category: 'Baby' },

    // Gardening
    { name: 'Fiskars 3-Piece Garden Tool Set', description: 'Get a Fiskars 3-piece garden tool set at a lower price.', category: 'Gardening' },
    { name: 'Flexzilla 50ft Garden Hose', description: 'Group buy for Flexzilla 50ft garden hoses.', category: 'Gardening' },
    { name: 'Classic Home 10 Ceramic Plant Pot', description: 'Discounted Classic Home 10-inch ceramic plant pots.', category: 'Gardening' },
    { name: 'Scotts Turf Builder EdgeGuard Spreader', description: 'Group buy for Scotts Turf Builder EdgeGuard spreaders.', category: 'Gardening' },

    // Travel
    { name: 'Samsonite Winfield 3 DLX Hardside Luggage', description: 'Join the group to buy Samsonite Winfield 3 DLX luggage.', category: 'Travel' },
    { name: 'Cabeau Evolution S3 Travel Pillow', description: 'Discounted Cabeau Evolution S3 travel pillows.', category: 'Travel' },
    { name: 'BAGAIL 8 Set Packing Cubes', description: 'Group buy for BAGAIL 8 set packing cubes.', category: 'Travel' },
    { name: 'EPICKA Universal Travel Adapter', description: 'Discounted EPICKA universal travel adapters.', category: 'Travel' },

    // Smart Home
    { name: 'Philips Hue White and Color Ambiance Starter Kit', description: 'Get a Philips Hue starter kit at a lower price.', category: 'Smart Home' },
    { name: 'TP-Link Kasa Smart Plug HS103P4', description: 'Group buy for TP-Link Kasa smart plugs.', category: 'Smart Home' },
    { name: 'Google Nest Hub 2nd Gen', description: 'Discounted Google Nest Hub 2nd Gen for group buyers.', category: 'Smart Home' },
    { name: 'Amazon Echo Show 8', description: 'Group buy for Amazon Echo Show 8 smart displays.', category: 'Smart Home' },

    // Fashion
    { name: 'Casio G-Shock GA2100 Watch', description: 'Join the group to get a discount on Casio G-Shock GA2100 watches.', category: 'Fashion' },
    { name: 'Nike Air Max 270 Sneakers', description: 'Group buy for Nike Air Max 270 sneakers.', category: 'Fashion' },
    { name: 'Levis Mens Leather Belt', description: 'Discounted Levi\'s men\'s leather belts for group buyers.', category: 'Fashion' },
    { name: 'Ray-Ban RB2132 New Wayfarer Sunglasses', description: 'Group buy for Ray-Ban RB2132 New Wayfarer sunglasses.', category: 'Fashion' },

    // Health
    { name: 'Nature Made Vitamin D3 2000 IU', description: 'Buy Nature Made Vitamin D3 2000 IU at a discounted price.', category: 'Health' },
    { name: 'Oral-B Pro 1000 Electric Toothbrush', description: 'Group buy for Oral-B Pro 1000 electric toothbrushes.', category: 'Health' },
    { name: 'Omron Platinum Blood Pressure Monitor', description: 'Discounted Omron Platinum blood pressure monitors.', category: 'Health' },
    { name: 'Fitbit Charge 5 Fitness Tracker', description: 'Group buy for Fitbit Charge 5 fitness trackers.', category: 'Health' },

    // Books
    { name: 'Moleskine Classic Notebook Large', description: 'Get a Moleskine Classic Large notebook at a lower price.', category: 'Books' },
    { name: '2024 Bestselling Fiction Book Bundle', description: 'Group buy for a bundle of 2024 bestselling fiction books.', category: 'Books' },
    { name: 'Oxford Spiral Notebook 5-Pack', description: 'Discounted Oxford spiral notebook 5-packs.', category: 'Books' },
    { name: 'The Complete Works of Shakespeare', description: 'Group buy for The Complete Works of Shakespeare.', category: 'Books' },

    // Automotive
    { name: 'Meguiars Gold Class Car Wax', description: 'Purchase Meguiar\'s Gold Class car wax at a discounted price.', category: 'Automotive' },
    { name: 'Vantrue N4 3 Channel Dash Cam', description: 'Group buy for Vantrue N4 3 channel dash cams.', category: 'Automotive' },
    { name: 'Armor All 2.5 Gallon Utility Wet&Dry Vacuum', description: 'Discounted Armor All 2.5 gallon utility vacuums.', category: 'Automotive' },
    { name: 'NOCO Boost Plus GB40 Jump Starter', description: 'Group buy for NOCO Boost Plus GB40 jump starters.', category: 'Automotive' },

    // Music
    { name: 'Yamaha FG800 Acoustic Guitar', description: 'Join the group to buy a Yamaha FG800 acoustic guitar.', category: 'Music' },
    { name: 'JBL Flip 6 Bluetooth Speaker', description: 'Discounted JBL Flip 6 Bluetooth speakers.', category: 'Music' },
    { name: 'Casio Privia PX-160 Digital Piano', description: 'Group buy for Casio Privia PX-160 digital pianos.', category: 'Music' },
    { name: 'Shure SM58 Vocal Microphone', description: 'Discounted Shure SM58 vocal microphones.', category: 'Music' },

    // Gaming
    { name: 'Sony PlayStation 5 Console', description: 'Get a Sony PlayStation 5 console at a discounted price.', category: 'Gaming' },
    { name: 'Microsoft Xbox Series X', description: 'Group buy for Microsoft Xbox Series X consoles.', category: 'Gaming' },
    { name: 'Logitech G502 HERO Gaming Mouse', description: 'Discounted Logitech G502 HERO gaming mice.', category: 'Gaming' },
    { name: 'Razer BlackWidow V4 Mechanical Keyboard', description: 'Group buy for Razer BlackWidow V4 mechanical keyboards.', category: 'Gaming' },

    // Photography
    { name: 'Canon EOS R8 Mirrorless Camera', description: 'Join the group to buy a Canon EOS R8 mirrorless camera.', category: 'Photography' },
    { name: 'Sony Alpha a7 IV Camera', description: 'Group buy for Sony Alpha a7 IV cameras.', category: 'Photography' },
    { name: 'Manfrotto Befree Advanced Tripod', description: 'Discounted Manfrotto Befree Advanced tripods.', category: 'Photography' },
    { name: 'Lowepro ProTactic 450 AW II Camera Bag', description: 'Group buy for Lowepro ProTactic 450 AW II camera bags.', category: 'Photography' },

    // Cycling
    { name: 'Giant Contend 3 Road Bike', description: 'Get a Giant Contend 3 road bike at a discounted price.', category: 'Cycling' },
    { name: 'Trek Marlin 7 Mountain Bike', description: 'Group buy for Trek Marlin 7 mountain bikes.', category: 'Cycling' },
    { name: 'Giro Register MIPS Cycling Helmet', description: 'Discounted Giro Register MIPS cycling helmets.', category: 'Cycling' },
    { name: 'Kryptonite New-U Evolution Mini-7 Bike Lock', description: 'Group buy for Kryptonite New-U Evolution Mini-7 bike locks.', category: 'Cycling' },

    // Camping
    { name: 'Coleman Camping Gear Set', description: 'Join the group to buy a Coleman camping gear set.', category: 'Camping' },
    { name: 'Marmot Trestles 30 Sleeping Bag', description: 'Discounted Marmot Trestles 30 sleeping bags.', category: 'Camping' },
    { name: 'Jetboil Flash Camping Stove', description: 'Group buy for Jetboil Flash camping stoves.', category: 'Camping' },
    { name: 'Black Diamond Spot 400 Headlamp', description: 'Discounted Black Diamond Spot 400 headlamps.', category: 'Camping' },

    // Art
    { name: 'Winsor & Newton Cotman Watercolor Paint Set', description: 'Get a Winsor & Newton Cotman watercolor paint set.', category: 'Art' },
    { name: 'Arteza 24x36 Inch Stretched Canvas 2-Pack', description: 'Group buy for Arteza 24x36 inch stretched canvas 2-packs.', category: 'Art' },
    { name: 'Princeton Velvetouch Paint Brush Set', description: 'Discounted Princeton Velvetouch paint brush sets.', category: 'Art' },
    { name: 'Liquitex BASICS Acrylic Paint Set', description: 'Group buy for Liquitex BASICS acrylic paint sets.', category: 'Art' },

    // Home Decor
    { name: 'Safavieh Madison Area Rug 8x10', description: 'Join the group to buy a Safavieh Madison 8x10 area rug.', category: 'Home Decor' },
    { name: 'Umbra Ribbon Wall Clock', description: 'Discounted Umbra Ribbon wall clocks.', category: 'Home Decor' },
    { name: 'Brightech Maxwell Table Lamp', description: 'Group buy for Brightech Maxwell table lamps.', category: 'Home Decor' },
    { name: 'NICETOWN Blackout Curtain Set', description: 'Discounted NICETOWN blackout curtain sets.', category: 'Home Decor' },

    // Jewelry
    { name: 'Swarovski Crystal Tennis Bracelet', description: 'Get a Swarovski crystal tennis bracelet at a discounted price.', category: 'Jewelry' },
    { name: 'Sterling Silver Heart Necklace', description: 'Group buy for sterling silver heart necklaces.', category: 'Jewelry' },
    { name: '14K Gold Hoop Earrings', description: 'Discounted 14K gold hoop earrings.', category: 'Jewelry' },
    { name: 'Cultured Pearl Pendant Necklace', description: 'Group buy for cultured pearl pendant necklaces.', category: 'Jewelry' },

    // Sports
    { name: 'Wilson Evolution Indoor Basketball', description: 'Join the group to buy a Wilson Evolution indoor basketball.', category: 'Sports' },
    { name: 'Spalding NBA Street Outdoor Basketball', description: 'Discounted Spalding NBA Street outdoor basketballs.', category: 'Sports' },
    { name: 'HEAD Ti.S6 Tennis Racket', description: 'Group buy for HEAD Ti.S6 tennis rackets.', category: 'Sports' },
    { name: 'Trideer Extra Thick Yoga Ball', description: 'Discounted Trideer extra thick yoga balls.', category: 'Sports' }
  ];

  // Generate 300 groups, cycling through businesses and users, with all fields as in the example
  const groups = [];
  for (let i = 0; i < 300; i++) {
    const item = groupItems[i % groupItems.length];
    const businessIdx = i % 25;
    const userIdx = i % 50;
    // Example values for price, discount, size for more variety
    const basePrice = 500 + ((i * 37) % 2500);
    const baseDiscount = 50 + ((i * 13) % 400);
    const baseSize = 5 + (i % 20);

    groups.push({
      name: item.name,
      creator: `user${userIdx + 1}@example.com`,
      description: item.description,
      image: readImage(`${item.name}.jpeg`),
      price: basePrice,
      discount: baseDiscount,
      size: baseSize,
      category: item.category,
      businessNumber: `B${String(businessIdx + 1).padStart(3, '0')}`
    });
  }

  await Group.bulkCreate(groups);
  console.log('Initial groups inserted');

  const allGroups = await Group.findAll();
  for (const group of allGroups) {
    const embedding = await getGroupEmbedding({
      description: group.description,
      category: group.category,
      price: group.price,
      discount: group.discount,
      size: group.size
    });

    await sequelize.query(`
      UPDATE "Group"
      SET "groupEmbedding" = '${embedding}'
      WHERE id = ${group.id}
    `);
  }

  console.log('Embeddings updated for all groups');
};

if (process.env.RUN_GROUP_SEED === 'true') {
  insertInitialGroups().catch(error => {
    console.error('Error inserting initial groups:', error.message);
  });
}

module.exports = Group;

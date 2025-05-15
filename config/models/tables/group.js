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
  return embeddingArray[0]; // 512-dimension vector
}

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creator: { //email of the user
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
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true
  }
}, {
  tableName: 'Group', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

const readImage = (imagePath) => {
  const resolvedPath = path.resolve('/app/Group/images', imagePath);
  console.log(`Reading image from: ${resolvedPath}`);
  try {
    const files = fs.readdirSync('/app/Group/images');
    console.log('Files in /app/Group/images:', files);
  } catch (err) {
    console.error('Error reading /app/Group/images directory:', err.message);
  }
  return fs.readFileSync(resolvedPath);
};

const insertInitialGroups = async () => {
  const existingGroups = await Group.findAll();
  console.log('Trying to insert initial groups');
  if (existingGroups.length > 0) {
    console.log('Initial groups already exist');
    return;
  }

  const groups = [
    { name: 'iPhone 13', creator: 'user1@example.com', description: 'Join the group to get a discount on the latest iPhone 13.', image: readImage('iPhone 13.jpeg'), price: 1000, discount: 100, size: 5, category: 'Electronics', businessNumber: 'B001' },
    { name: 'Samsung TV', creator: 'user2@example.com', description: 'Get a great deal on a Samsung 4K TV by joining this group.', image: readImage('Samsung TV.jpeg'), price: 2000, discount: 200, size: 10, category: 'Home Appliances', businessNumber: 'B002' },
    { name: 'Treadmill', creator: 'user3@example.com', description: 'Purchase a high-quality treadmill at a discounted price.', image: readImage('Treadmill.jpeg'), price: 1500, discount: 150, size: 8, category: 'Fitness', businessNumber: 'B003' },
    { name: 'Office Chair', creator: 'user4@example.com', description: 'Get an ergonomic office chair at a lower price.', image: readImage('Office Chair.jpeg'), price: 500, discount: 50, size: 20, category: 'Office Supplies', businessNumber: 'B004' },
    { name: 'Blender', creator: 'user5@example.com', description: 'Join the group to buy a high-performance blender.', image: readImage('Blender.jpeg'), price: 800, discount: 80, size: 15, category: 'Kitchen', businessNumber: 'B005' },
    { name: 'Camping Tent', creator: 'user6@example.com', description: 'Get a durable camping tent at a discounted price.', image: readImage('Camping Tent.jpeg'), price: 1200, discount: 120, size: 10, category: 'Outdoor', businessNumber: 'B006' },
    { name: 'Pet Food', creator: 'user7@example.com', description: 'Buy premium pet food at a lower price.', image: readImage('Pet Food.jpeg'), price: 300, discount: 30, size: 25, category: 'Pet Care', businessNumber: 'B007' },
    { name: 'Skincare Set', creator: 'user8@example.com', description: 'Join the group to get a discount on a skincare set.', image: readImage('Skincare Set.jpeg'), price: 700, discount: 70, size: 12, category: 'Beauty', businessNumber: 'B008' },
    { name: 'Baby Stroller', creator: 'user9@example.com', description: 'Purchase a high-quality baby stroller at a discounted price.', image: readImage('Baby Stroller.jpeg'), price: 600, discount: 60, size: 18, category: 'Baby', businessNumber: 'B009' },
    { name: 'Gardening Tools', creator: 'user10@example.com', description: 'Get a complete set of gardening tools at a lower price.', image: readImage('Gardening Tools.jpeg'), price: 400, discount: 40, size: 22, category: 'Gardening', businessNumber: 'B010' },
    { name: 'Travel Luggage', creator: 'user11@example.com', description: 'Join the group to buy travel luggage at a discounted price.', image: readImage('Travel Luggage.jpeg'), price: 900, discount: 90, size: 14, category: 'Travel', businessNumber: 'B011' },
    { name: 'Smart Home Kit', creator: 'user12@example.com', description: 'Get a smart home kit at a lower price.', image: readImage('Smart Home Kit.jpeg'), price: 1100, discount: 110, size: 7, category: 'Smart Home', businessNumber: 'B012' },
    { name: 'Watches', creator: 'user13@example.com', description: 'Join the group to get a discount on stylish watches.', image: readImage('Watches.jpeg'), price: 500, discount: 50, size: 20, category: 'Fashion', businessNumber: 'B013' },
    { name: 'Vitamins', creator: 'user14@example.com', description: 'Buy health supplements at a discounted price.', image: readImage('Vitamins.jpeg'), price: 300, discount: 30, size: 25, category: 'Health', businessNumber: 'B014' },
    { name: 'Stationery Set', creator: 'user15@example.com', description: 'Get a collection of stationery items at a lower price.', image: readImage('Stationery Set.jpeg'), price: 200, discount: 20, size: 30, category: 'Books', businessNumber: 'B015' },
    { name: 'Car Paint', creator: 'user16@example.com', description: 'Purchase automotive paint at a discounted price.', image: readImage('Car Paint.jpeg'), price: 700, discount: 70, size: 12, category: 'Automotive', businessNumber: 'B016' },
    { name: 'Guitar', creator: 'user17@example.com', description: 'Join the group to buy a guitar at a lower price.', image: readImage('Guitar.jpeg'), price: 1500, discount: 150, size: 8, category: 'Music', businessNumber: 'B017' },
    { name: 'Gaming Console', creator: 'user18@example.com', description: 'Get a gaming console at a discounted price.', image: readImage('Gaming Console.jpeg'), price: 1000, discount: 100, size: 10, category: 'Gaming', businessNumber: 'B018' },
    { name: 'Camera', creator: 'user19@example.com', description: 'Join the group to buy a professional camera at a lower price.', image: readImage('Camera.jpeg'), price: 2000, discount: 200, size: 5, category: 'Photography', businessNumber: 'B019' },
    { name: 'Bicycle', creator: 'user20@example.com', description: 'Get a high-quality bicycle at a discounted price.', image: readImage('Bicycle.jpeg'), price: 800, discount: 80, size: 15, category: 'Cycling', businessNumber: 'B020' },
    { name: 'Camping Gear', creator: 'user21@example.com', description: 'Join the group to buy camping gear at a lower price.', image: readImage('Camping Gear.jpeg'), price: 600, discount: 60, size: 18, category: 'Camping', businessNumber: 'B021' },
    { name: 'Art Supplies', creator: 'user22@example.com', description: 'Get art supplies at a discounted price.', image: readImage('Art Supplies.jpeg'), price: 400, discount: 40, size: 22, category: 'Art', businessNumber: 'B022' },
    { name: 'Home Decor', creator: 'user23@example.com', description: 'Join the group to buy home decor items at a lower price.', image: readImage('Home Decor.jpeg'), price: 900, discount: 90, size: 14, category: 'Home Decor', businessNumber: 'B023' },
    { name: 'Jewelry', creator: 'user24@example.com', description: 'Get beautiful jewelry at a discounted price.', image: readImage('Jewelry.jpeg'), price: 1200, discount: 120, size: 10, category: 'Jewelry', businessNumber: 'B024' },
    { name: 'Sports Gear', creator: 'user25@example.com', description: 'Join the group to buy sports equipment at a lower price.', image: readImage('Sports Gear.jpeg'), price: 1000, discount: 100, size: 10, category: 'Sports', businessNumber: 'B025' }
  ];

  for (const group of groups) {
    const embedding = await getGroupEmbedding({
      description: group.description,
      category: group.category,
      price: group.price,
      discount: group.discount,
      size: group.size
    });
  
    group.groupEmbedding = embedding; // נוסיף את הוקטור ישירות לאובייקט
  }
  
  await Group.bulkCreate(groups);
  console.log('Initial groups inserted');
};

insertInitialGroups().catch(error => {
  console.error('Error inserting initial groups:', error.message);
});

module.exports = Group;

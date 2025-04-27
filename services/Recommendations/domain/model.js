const tf = require('@tensorflow/tfjs-node');
const { Group } = require('./models'); // Adjust to your path
const sequelize = require('./db');

// 1. Define category vocabulary
const categories = [
  'Electronics', 'Home Appliances', 'Fitness', 'Office Supplies', 'Kitchen',
  'Outdoor', 'Pet Care', 'Beauty', 'Baby', 'Gardening', 'Travel',
  'Smart Home', 'Fashion', 'Health', 'Books', 'Automotive', 'Music',
  'Gaming', 'Photography', 'Cycling', 'Camping', 'Art', 'Home Decor', 'Jewelry', 'Sports'
];

// 2. Encode a group
function encodeGroup(group, categories) {
  const categoryVector = categories.map(cat => group.category === cat ? 1 : 0);

  const maxPrice = 2000;
  const maxDiscount = 200;
  const maxSize = 30;

  const priceNorm = parseFloat(group.price) / maxPrice;
  const discountNorm = parseFloat(group.discount) / maxDiscount;
  const sizeNorm = parseFloat(group.size) / maxSize;

  return [...categoryVector, priceNorm, discountNorm, sizeNorm];
}

// 3. Create simple MLP model
const createMLPModel = (inputSize) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [inputSize] }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

// 4. Main training function
async function trainRecommendationModel() {
  await sequelize.sync(); // Make sure DB is connected

  const groups = await Group.findAll();

  if (groups.length === 0) {
    console.log("No groups found in DB!");
    return;
  }

  console.log(`Fetched ${groups.length} groups`);

  // Prepare X (features) and Y (labels)
  const X = groups.map(group => encodeGroup(group, categories));

  // 🚨 For now: Fake labels (simulate user liked 50% randomly)
  const Y = groups.map(() => Math.random() > 0.5 ? 1 : 0);

  // Create tensors
  const xTensor = tf.tensor2d(X);
  const yTensor = tf.tensor2d(Y, [Y.length, 1]);

  console.log("X shape:", xTensor.shape);
  console.log("Y shape:", yTensor.shape);

  const inputSize = X[0].length;
  const model = createMLPModel(inputSize);

  // Train model
  await model.fit(xTensor, yTensor, {
    epochs: 50,
    batchSize: 16,
    validationSplit: 0.2,
    shuffle: true,
    callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 5 })
  });

  console.log("Training complete!");

  // Save model
  await model.save('file://./recommendation_model');
  console.log("Model saved to ./recommendation_model");
}


module.exports = {
    trainRecommendationModel
  };

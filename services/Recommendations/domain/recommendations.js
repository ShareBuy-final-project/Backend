const { Group, User, SavedGroup, GroupUser, Business } = require('models');
const tf = require('@tensorflow/tfjs-node'); // TensorFlow.js for Node.js

/**
 * Load the AI model for recommendations.
 */
const loadModel = async () => {
  return await tf.loadLayersModel('file://path/to/your/model.json'); // Replace with your model path
};

/**
 * Get recommendations for a user based on an AI model.
 * @param {string} userEmail - The email of the user.
 * @param {Object} options - Additional options for generating recommendations.
 * @returns {Array} - A list of recommended groups.
 */
async function getRecommendationsForUser(userEmail, options = {}) {
  try {
    // Step 1: Fetch groups the user is already a part of
    const userGroupIds = await getUserGroups(userEmail);

    // Step 2: Fetch groups the user has saved
    const savedGroupIds = await getSavedGroups(userEmail);

    // Combine the two lists to exclude these groups from recommendations
    const excludedGroupIds = [...new Set([...userGroupIds, ...savedGroupIds])];

    // Step 3: Fetch all groups excluding the ones the user is already associated with
    const allGroups = await Group.findAll({
      where: {
        id: { [Group.sequelize.Op.notIn]: excludedGroupIds }
      }
    });

    // Step 4: Load the AI model
    const model = await loadModel();

    // Step 5: Prepare input data for the model
    const inputData = allGroups.map(group => {
      return [
        /* Example features: user preferences, group tags, etc. */
        ...group.tags, // Group tags
        /* Add more features as needed */
      ];
    });

    // Step 6: Predict scores for each group
    const predictions = model.predict(tf.tensor2d(inputData)).arraySync();

    // Step 7: Sort groups by predicted scores
    const recommendedGroups = allGroups
      .map((group, index) => ({ ...group, score: predictions[index] }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, options.limit || 10); // Limit the number of recommendations

    // Step 8: Format the recommendations
    return recommendedGroups.map(group => ({
      id: group.id,
      name: group.name,
      tags: group.tags,
      score: group.score
    }));
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

const getUserGroups = async (userEmail) => {
  try {
    const groupUsers = await GroupUser.findAll({ where: { userEmail,  paymentConfirmed:true} });
    const groupIds = groupUsers.map(gu => gu.groupId);
    return groupIds;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getSavedGroups = async (userEmail) => {
  const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
  const groupIds = savedGroups.map(sg => sg.groupId);
  return groupIds;
};


module.exports = {
  getRecommendationsForUser
};
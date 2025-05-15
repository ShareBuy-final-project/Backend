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

    // Step 4: Fetch user's preferences (you'll need to implement this)
    const userProfile = await getUserProfileFeatures(userEmail);

    // Step 5: Prepare input data for all groups
    const groupFeatures = allGroups.map(group => ({
      id: group.id,
      name: group.name,
      tags: group.tags,
      features: extractGroupFeatures(group) // function that transforms group to feature vector
    }));

    // Step 6: Compute distances between user profile and each group
    const scoredGroups = groupFeatures.map(group => {
      const distance = euclideanDistance(userProfile, group.features);
      return { ...group, distance };
    });

    // Step 7: Sort by ascending distance (smaller distance = more similar)
    const recommendedGroups = scoredGroups
      .sort((a, b) => a.distance - b.distance)
      .slice(0, options.limit || 10);

    // Step 8: Format the recommendations
    return recommendedGroups.map(group => ({
      id: group.id,
      name: group.name,
      tags: group.tags,
      score: 1 / (1 + group.distance) // Higher score = closer
    }));
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];    
  }
}

/**
 * Calculates Euclidean distance between two vectors.
 * @param {Array} vec1 
 * @param {Array} vec2 
 * @returns {number}
 */
function euclideanDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) throw new Error('Vectors must be of same length');
  return Math.sqrt(vec1.reduce((sum, val, idx) => sum + Math.pow(val - vec2[idx], 2), 0));
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
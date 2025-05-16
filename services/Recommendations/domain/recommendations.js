const { Group, User, SavedGroup, GroupUser, Business } = require('models');
const { Sequelize } = require('sequelize');


/**
 * Get recommendations for a user based on an AI model.
 * @param {string} userEmail - The email of the user.
 * @param {Object} options - Additional options for generating recommendations.
 * @returns {Array} - A list of recommended groups.
 */
const getRecommendationsForUser = async (userEmail, options = {}) => {
  try {
    console.log(`[INFO] Fetching recommendations for user: ${userEmail}`);

    const userGroupIds = await getUserGroups(userEmail);
    console.log(`[INFO] User is part of groups: ${JSON.stringify(userGroupIds)}`);

    const savedGroupIds = await getSavedGroups(userEmail);
    console.log(`[INFO] User has saved groups: ${JSON.stringify(savedGroupIds)}`);

    const groupsVectors = await getGroupsVectors([...userGroupIds, ...savedGroupIds]);
    console.log(`[INFO] Retrieved group vectors for user: ${JSON.stringify(groupsVectors)}`);

    const forYou = await getForYouGroups(groupsVectors);
    console.log(`[INFO] Generated recommendations for user: ${JSON.stringify(forYou)}`);

    return forYou;
  } catch (error) {
    console.error(`[ERROR] Error generating recommendations for user ${userEmail}:`, error);
    return [];
  }
};

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
    console.log(`[INFO] Fetching groups for user: ${userEmail}`);
    const groupUsers = await GroupUser.findAll({ where: { userEmail } });
    const groupIds = groupUsers.map(gu => gu.groupId);
    console.log(`[INFO] Found groups for user: ${JSON.stringify(groupIds)}`);
    return groupIds;
  } catch (error) {
    console.error(`[ERROR] Error fetching groups for user ${userEmail}:`, error);
    throw new Error(error.toString());
  }
};

const getSavedGroups = async (userEmail) => {
  try {
    console.log(`[INFO] Fetching saved groups for user: ${userEmail}`);
    const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
    const groupIds = savedGroups.map(sg => sg.groupId);
    console.log(`[INFO] Found saved groups for user: ${JSON.stringify(groupIds)}`);
    return groupIds;
  } catch (error) {
    console.error(`[ERROR] Error fetching saved groups for user ${userEmail}:`, error);
    throw new Error(error.toString());
  }
};

const getForYouGroups = async (groupsVectors) => {
  try {
    console.log(`[INFO] Generating recommendations based on group vectors: ${JSON.stringify(groupsVectors)}`);
    const recommendations = [];

    for (const userVector of groupsVectors) {
      console.log(`[INFO] Processing user vector: ${JSON.stringify(userVector)}`);
      const nearestNeighbors = await Group.findAll({
        attributes: ['id'],
        order: [
          [
            Sequelize.literal(`
              "groupEmbedding" <#> '${JSON.stringify(userVector)}'
            `),
            'ASC'
          ]
        ],
        limit: 3 // Limit to top 3 nearest neighbors
      });

      console.log(`[INFO] Found nearest neighbors: ${JSON.stringify(nearestNeighbors)}`);
      recommendations.push(...nearestNeighbors.map(neighbor => neighbor.id));
    }

    console.log(`[INFO] Final recommendations: ${JSON.stringify(recommendations)}`);
    return [...new Set(recommendations)]; // Remove duplicates
  } catch (error) {
    console.error(`[ERROR] Error generating recommendations:`, error);
    throw new Error('Error fetching recommendations: ' + error.toString());
  }
};


const getGroupsVectors = async (groupIds) => {
  try {
    console.log(`[INFO] Fetching group vectors for group IDs: ${JSON.stringify(groupIds)}`);
    const groups = await Group.findAll({
      where: {
        id: groupIds
      },
      attributes: ['groupEmbedding'] 
    });
    console.log(`[INFO] Number of groups found: ${groups.length}`);
    console.log(`[INFO] Found groups: ${groups}`);
    const vectors = groups.map(group => group.groupEmbedding);
    console.log(`[INFO] Retrieved group vectors: ${JSON.stringify(vectors)}`);
    return vectors;
  } catch (error) {
    console.error(`[ERROR] Error fetching group vectors:`, error);
    throw new Error(error.toString());
  }
};



module.exports = {
  getRecommendationsForUser
};
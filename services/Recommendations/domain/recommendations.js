const { get } = require('lodash');
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
    //console.log(`[INFO] Retrieved group vectors for user: ${JSON.stringify(groupsVectors)}`);

    const forYou = await getForYouGroups(groupsVectors);
    console.log(`[INFO] Generated recommendations for user: ${JSON.stringify(forYou)}`);
     
    const filteredRecommendations = forYou.filter(groupId => 
      !userGroupIds.includes(groupId) && !savedGroupIds.includes(groupId)
    );
    return getGroupGeneric(userEmail, filteredRecommendations);
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
    //console.log(`[INFO] Generating recommendations based on group vectors: ${JSON.stringify(groupsVectors)}`);
    const recommendations = [];

    for (const userVector of groupsVectors) {
      //console.log(`[INFO] Processing user vector: ${JSON.stringify(userVector)}`);
      const nearestNeighbors = await Group.findAll({
        attributes: ['id', 'name'],
        order: [
          [
            Sequelize.literal(`
              "groupEmbedding" <#> '${JSON.stringify(userVector)}'
            `),
            'ASC'
          ]
        ],
        limit: 10 // Limit to top 10 nearest neighbors
      });

      // Filter nearestNeighbors to have unique names
      const uniqueNeighbors = [];
      const seenNames = new Set();
      for (const neighbor of nearestNeighbors) {
        if (!seenNames.has(neighbor.name)) {
          uniqueNeighbors.push(neighbor);
          seenNames.add(neighbor.name);
        }
      }

      console.log(`[INFO] Found nearest neighbors: ${JSON.stringify(uniqueNeighbors)}`);
      recommendations.push(...uniqueNeighbors.map(neighbor => neighbor.id));
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
      where: { id: groupIds },
      attributes: ['id', 'groupEmbedding'] // Ensure groupEmbedding is included
    });

    console.log(`[INFO] Number of groups found: ${groups.length}`);

    // Parse groupEmbedding from JSON string to array
    const vectors = groups.map(group => {
      group = group.toJSON(); // Convert Sequelize instance to plain object
      console.log(`[INFO] Processing group: ${group}`);
      try {
        return JSON.parse(group.groupEmbedding);
      } catch (error) {
        console.error(`[ERROR] Failed to parse groupEmbedding for group ID ${group.id}:`, error);
        return null; // Handle parsing errors gracefully
      }
    });

    //console.log(`[INFO] Retrieved group vectors: ${JSON.stringify(vectors)}`);
    return vectors;
  } catch (error) {
    console.error(`[ERROR] Error fetching group vectors:`, error);
    throw new Error(error.toString());
  }
};

const getGroupGeneric = async (userEmail, groupIds) => {
  console.log('groupIds', groupIds);
  const groups = await Group.findAll({ where: { id: groupIds, isActive: true } });
  console.log('groups', groups.map(g => g.id));
  const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
  const savedGroupIds = savedGroups.map(sg => sg.groupId);

  const groupsWithTotalAmount = await Promise.all(groups.map(async group => {
    const totalAmount = await getTotalAmount(group.id);
    const {image, ...groupData } = group.toJSON();

    return {
      ...groupData,
      isSaved: savedGroupIds.includes(group.id),
      totalAmount,  
      imageBase64: convertImageToBase64(image)
    };
  }));
  return groupsWithTotalAmount;
}

const getTotalAmount = async (id) =>{ 
  return await GroupUser.sum('amount', { where: { groupId: id, paymentConfirmed: true  } }
)};

const convertImageToBase64 = (image) => {
  return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
};



module.exports = {
  getRecommendationsForUser
};
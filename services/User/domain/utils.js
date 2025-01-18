const bcrypt = require('bcrypt');

const comparePassword = async (user, currentPassword) => {
    return bcrypt.compare(currentPassword, user.password);
  };


module.exports = {
    comparePassword,
};
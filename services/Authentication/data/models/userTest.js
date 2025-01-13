const findOne = async (email) => {
    return {
        email: email,
        password: 'password',
        _id: '1'
    }
}
const comparePassword = async (password) => {
    return true;
}
module.exports = {findOne, comparePassword};
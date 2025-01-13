import test from 'node:test'
import assert from 'node:assert'
import app from '../../User/api/userApi'
const { register, getUser } = require('../../User/domain/user');
const callTracker = new assert.callTracker;
process.on('exit',() => callTracker.verify())
test('User Registration',async(t) => {
    await t.test('Happy Ending', async () => {

    })
})
import http from 'k6/http'
import ws from 'k6/ws'
import {SharedArray} from 'k6/data'
//import { response } from 'express';
//const {faker} = require('@faker-js/faker')
//const fs = require('node:fs');
const baseWS = 'ws://132.73.84.56:443/'
const baseURL = 'http://132.73.84.56:443/'
export const options = {
    vus: 1,
    duration: '10s'
}
var data = new SharedArray('users',function() {
  return JSON.parse(open('../data.json'));
})
var index = 0; //starts at 0 for users and 600 for businesses
const num_users = 5; //can be up to 1000 as there are 1000 entries in data.json
var tokens = [];
for (let i = 0; i < num_users; i++)
  tokens.push('');
/*function generate_users_file() {
  var users = [];
  for (let i = 0; i < 1000; i++)
  {
    users.push([faker.person.fullName(),faker.internet.email(),faker.internet.password()])
  }
  fs.writeFile('data.json',JSON.stringify(users),(err) => {
    if (err) throw err;
  });
}*/
function generate_many_users() {
  const url = baseURL+'user/register';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
  });
  let element = data[index]
  index++;
  let name = element[0]
  let email = element[1]
  let password = element[2]
  let payload = {
          fullName: name,
          password: password,
          email: email,
          phone: '1234567890',
          state: 'State',
          city: 'City',
          street: 'Street',
          streetNumber: '123',
          zipCode: '12345'
        }
  http.post(url, payload, params);
}
function generate_many_businesses() {
  const url = baseURL+'user/registerBusiness';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
  });
  let element = data[index]
  index++;
  let name = element[0]
  let email = element[1]
  let password = element[2]
  let payload = {
    fullName: name,
    password: password,
    email: email,
    phone: '1234567890',
    state: 'State',
    city: 'City',
    street: 'Street',
    streetNumber: '123',
    zipCode: '12345',
    businessName: 'Business ' + index,
    businessNumber: '1234567890',
    description: 'Description ' + index,
    category: 'Category ' + index,
    websiteLink: 'https://www.example.com',
    contactEmail: 'contact@example.com'
  }
  http.post(url, payload, params);
}
function mass_login(isBusiness = false)
{
  const url = baseURL+'auth/login';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
  });
  
  for (let i = 0; i < num_users; i++)
  {
    let element = data[isBusiness ? i+600 : i]
    let email = element[1]
    let password = element[2]
    let payload = {
            email: email,
        password: password
          }
    let response = http.post(url, payload, params);
    tokens[i] = response.body.accessToken;
  }
}
var groupId = 304; //replace with valid group id
function init_chat_test() {
  mass_login(false);
  const url = baseURL+'group/joinGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    let payload = {
      groupId: groupId,
        amount: 1
    }
    http.post(url, payload, params);
  }
}
function chat_test() {
  const chatServiceURL = 'ws://132.73.84.56:9000/socket.io/?EIO=4&transport=websocket';
  const socket = ws.connect(chatServiceURL, {}, function (socket) {
    socket.on('open', function() {
      socket.send('42/chat,["joinGroup",{"groupId":' + groupId + '}]');
      for (let i = 0; i < num_users; i++) {
        let element = data[i]
        let email = element[1]
        const messageData = {
          groupId: groupId,
          userEmail: email,
          content: "i am user " + i
        };
        socket.send('42/chat,["sendMessage",' + JSON.stringify(messageData) + ']');
      }
      /*setTimeout(() => {
        socket.close();
      }, 1000);*/
    });
  });
}
function join_unjoin_test() {
  const url = baseURL+'group/joinGroup';
  const url2 = baseURL+'group/leaveGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    let payload = {
      groupId: groupId,
        amount: 1
    }
    http.post(url, payload, params);
    payload = {
      groupId: groupId
    }
    http.post(url2, payload, params);
  }
}
function save_unsave_test() {
  const url = baseURL+'group/saveGroup';
  const url2 = baseURL+'group/unSaveGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    let payload = {
      groupId: groupId
    }
    http.post(url, payload, params);
    http.post(url2, payload, params);
  }
}
function create_group_test() {
  const url = baseURL+'group/create';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    let index = i
    let payload = {
      name: 'Group ' + index,
      description: 'Description ' + index,
      base64Image: null,
      price: 100,
      discount: 0.1,
      size: 10
    }
    http.post(url, payload, params);
    index += num_users;
  }
}
// uncomment to perform tests
//test 1
/*export default () => {
  generate_many_users();
}*/
//test 1.5
/*index=600;
export default () => {
  generate_many_businesses();
}*/
//test 2
/*export function setup() {
  init_chat_test()
}
export default () => {
  chat_test();
}*/
//test 3
export function setup() {
  mass_login(true)
}
export default () => {
  create_group_test();
}
//test 4
/*export function setup() {
  mass_login(false)
}
export default () => {
  save_unsave_test();
}*/


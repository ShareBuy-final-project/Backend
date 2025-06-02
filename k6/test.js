import http from 'k6/http'
import {SharedArray} from 'k6/data'
import { response } from 'express';
//const {faker} = require('@faker-js/faker')
//const fs = require('node:fs');
const baseURL = 'http://132.73.84.56/'
export const options = {
    vus: 1,
    duration: '10s'
}
var data = new SharedArray('users',function() {
  return JSON.parse(open('../data.json'));
})
var index = 0;
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
  const url = baseURL+'userApi/register';
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
function mass_login()
{
  const url = baseURL+'authApi/login';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
  });
  
  for (let i = 0; i < num_users; i++)
  {
    let element = data[i]
    let email = element[1]
    let password = element[2]
    let payload = {
            email: email,
        password: password,
        isBusiness: false
          }
    response = http.post(url, payload, params);
    tokens[i] = response.body.accessToken;
  }
}
var groupId = 304; //replace with valid group id
function init_chat_test() {
  mass_login();
  const url = baseURL+'groupApi/joinGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    payload = {
      groupId: id,
        amount: 1
    }
     http.post(url, payload, params);
  }
}
function chat_test() {
  ws.connect(url, params, function (socket) {
    for (let i = 0; i < num_users; i++) {
      let element = data[i]
      let email = element[1]
      socket.sendMessage("i am user "+i,groupId,email);
    }
  });
}
function join_unjoin_test() {
  const url = baseURL+'groupApi/joinGroup';
  const url2 = baseURL+'groupApi/leaveGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    payload = {
      groupId: id,
        amount: 1
    }
    http.post(url, payload, params);
    payload = {
      groupId: id
    }
    http.post(url2, payload, params);
  }
}
function save_unsave_test() {
  const url = baseURL+'groupApi/saveGroup';
  const url2 = baseURL+'groupApi/unSaveGroup';
  for (let i = 0; i < num_users; i++)
  {
    const accessToken = tokens[i]
    const params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    payload = {
      groupId: id
    }
    http.post(url, payload, params);
    http.post(url2, payload, params);
  }
}
/*export default () => {
  const accessToken = 'valid-token';
  const url = baseURL+'groupApi/getPage';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  });

  const payload = {
    filters: {price:50,page:1,limit:1}
  };
  http.get(url, payload, params);
}*/
// uncomment to perform tests
//test 1
/*export default () => {
  generate_many_users();
}*/
//test 2
/*init_chat_test()
export default () => {
  chat_test();
}*/
//test 3
/*mass_login()
export default () => {
  join_unjoin();
}*/

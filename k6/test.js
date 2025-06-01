import http from 'k6/http'
import {SharedArray} from 'k6/data'
//const {faker} = require('@faker-js/faker')
//const fs = require('node:fs');
export const options = {
    vus: 1,
    duration: '10s'
}
var data = new SharedArray('users',function() {
  return JSON.parse(open('../data.json'));
})
var index = 0;

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
  const url = 'http://132.73.84.56/userApi/register';
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
/*export default () => {
  const accessToken = 'valid-token';
  const url = 'http://132.73.84.56/groupApi/getPage';
  const params = JSON.stringify({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  });

  const payload = {
    filters: {price:50,page:1,limit:1}
  };
  http.get(url, payload, params);
}*/
export default () => {
  generate_many_users();
}
//generate_users_file();

const http = require('k6/http');
const baseURL = 'http://132.73.84.56:443/'
function login_concurrency_test() {
    let url = baseURL+'auth/login';
    const params = JSON.stringify({
        'Content-Type': 'application/json',
    });
    let payload1 = {
        email: 'useer1@example.com',
        password: 'password1'
    }
    let payload2 = {
        email: 'useer2@example.com',
        password: 'password2'
    }
    let call1 = new Promise((resolve, reject) => {
        let result1 = http.post(url, payload1, params);
        resolve(result1);
    });
    let call2 = new Promise((resolve, reject) => {
        let result2 = http.post(url, payload2, params);
        resolve(result2);
    });
    Promise.all([call1, call2]).then((results) => {
        console.log(results[0].body);
        console.log(results[1].body);
    })
}
function login_same_user_test() {
    const url = baseURL+'auth/login';
    const params = JSON.stringify({
      'Content-Type': 'application/json',
    });
    let payload1 = {
      email: 'useer1@example.com',
      password: 'password1'
    }
    let call1 = new Promise((resolve, reject) => {
      let result1 = http.post(url, payload1, params);
      resolve(result1);
    });
    let call2 = new Promise((resolve, reject) => {
      let result2 = http.post(url, payload1, params);
      resolve(result2);
    });
    Promise.all([call1, call2]).then((results) => {
      console.log(results[0].body);
      console.log(results[1].body);
    })
}
function save_unsave_concurrency_test() {
    let url = baseURL+'auth/login';
    const loginParams = JSON.stringify({
      'Content-Type': 'application/json',
    });
    let login_payload = {
      email: 'useer1@example.com',
      password: 'password1'
    }
    let login_result = http.post(url, login_payload, loginParams);
    let accessToken = login_result.body.accessToken;
    let refreshToken = login_result.body.refreshToken;
    let params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    url = baseURL+'group/saveGroup';
    let url2 = baseURL+'group/unSaveGroup';
    let save_payload = {
      userEmail: 'useer1@example.com',
      groupId: 305,
    }
    let unsave_payload = {
      userEmail: 'useer1@example.com',
      groupId: 305,
    }
    let save_call = new Promise((resolve, reject) => {
      let save_result = http.post(url, save_payload, params);
      resolve(save_result);
    });
    let unsave_call = new Promise((resolve, reject) => {
      let unsave_result = http.post(url2, unsave_payload, params);
      resolve(unsave_result);
    });
    Promise.all([save_call, unsave_call]).then((results) => {
      console.log(results[0].body);
      console.log(results[1].body);
    })
}
function create_2groups_concurrency_test() {
    let url = baseURL+'auth/login';
    let params = JSON.stringify({
      'Content-Type': 'application/json',
    });
    //change this to a business account
    let login_payload = {
      email: 'useer1@example.com',
      password: 'password1'
    }
    let login_result = http.post(url, login_payload, params);
    let accessToken = login_result.body.accessToken;
    let refreshToken = login_result.body.refreshToken;
    params = JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    url = baseURL+'group/create';
    let create_payload = {
      name: 'Group 1',
      description: 'Description 1',
      base64Image: null,
      price: 100,
      discount: 0.1,
      size: 10
    }
    let create_payload2 = {
        name: 'Group 2',
        description: 'Description 2',
        base64Image: null,
        price: 100,
        discount: 0.1,
        size: 10
      } 
    let create_call = new Promise((resolve, reject) => {
      let create_result = http.post(url, create_payload, params);
      resolve(create_result);
    });
    let create_call2 = new Promise((resolve, reject) => {
      let create_result2 = http.post(url, create_payload2, params);
      resolve(create_result2);
    });
    Promise.all([create_call, create_call2]).then((results) => {
      console.log(results[0].body);
      console.log(results[1].body);
    })
}
//to run the tests, replace the below function with the one you want to test
//install k6 https://grafana.com/docs/k6/latest/set-up/install-k6/
//then run k6 run concurrency.js
export function setup() {
    create_2groups_concurrency_test()
  }
export default () => {
}
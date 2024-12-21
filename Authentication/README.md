# Authentication Service

This authentication service provides a way to log in and receive an access token, which can be used to authenticate subsequent requests to other services. The service includes endpoints for logging in and verifying tokens. 
##### Note
 After token verification, you will receive the details of the user performing the action. At this point, you should check if the user is permitted to perform this action and present only the data that is visible to them.

## Flow of the Authentication Service

### 1. Login

To log in, send a POST request to the `/auth/login` endpoint with your email and password in the request body. If the login is successful, you will receive an access token and refresh token in JSON format.

#### Request
```http
POST /auth/login
```
Content-Type: application/json
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
#### Response
```json
{
  "accessToken": "your-access-token",
  "refreshToken": "your-refresh-token"
}
```

### 2. Verify Token
Whenever you want to call a function that requires authentication from any service, you should call the verifyToken function and supply the token in the Authorization header.

#### Request
```http
GET /auth/validate-token
Authorization: Bearer your-access-token
```
#### Response
If the token is valid, you will receive a JSON response indicating that the token is valid, along with the decoded token data.
```json
{
  "valid": true,
  "data": {
    "email": "somemail@example.com",
    "additionalData": "..."
  }
}
```
If the token is invalid, you will receive a JSON response indicating that the token is invalid.
```json
{
  "valid": false,
  "message": "Invalid token",
  "error": "Error message"
}
```

### 3. Refresh Token
Whenever your access token is expired (15 minutes), you should address the /auth/token API with the following body:

#### Request
```http
POST /auth/token
```
Content-Type: application/json
```json
{
  "token": "your-refresh-token"
}
```
#### Response
```json
{
  "accessToken": "your-new-access-token"
}
```
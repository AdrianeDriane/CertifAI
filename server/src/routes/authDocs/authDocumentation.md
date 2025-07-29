# Frontend Authentication Implementation Guide

## Overview

This guide provides the requirements and API documentation for implementing authentication in your React frontend.
## Core Requirements

### 1. Device Fingerprinting
**CRITICAL**: Every authentication request must include a device fingerprint to prevent token theft.

**Required Library:**
```bash
npm install @fingerprintjs/fingerprintjs
```

**What you need to implement:**
- Generate a unique device fingerprint using FingerprintJS
- Include this fingerprint in all authentication API calls
- Send the same fingerprint in the `x-device-fingerprint` header for protected routes

**Fingerprint Generation:**
```javascript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Initialize the agent at application startup.
const fpPromise = FingerprintJS.load();

// Usage in your authentication functions
const generateFingerprint = async () => {
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};
```

### 2. Token Management
**Requirements:**
- Store JWT tokens in localStorage
- Include tokens in `Authorization: Bearer <token>` header for protected routes
- Handle token expiration and invalid token scenarios
- Clear tokens on logout

### 3. Protected Routes
**Requirements:**
- Implement route protection that checks for valid authentication
- Redirect unauthenticated users to login page
- Validate tokens before allowing access to protected content

---

## API Endpoints Documentation

### Backend/Server Base URL
```
${backendUrl}/api/auth
```

### 1. Manual Registration

**Endpoint:** `POST /register`

**Purpose:** Register a new user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "firstName": "John",
  "middleName": "Michael",  // Optional
  "lastName": "Doe",
  "fingerprint": "generated_device_fingerprint"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing required fields or email already exists
- `500` - Server error

**Possible Error Messages:**
- `"Missing required fields: email, password, firstName, lastName, fingerprint"`
- `"This email is already used with Google Sign-In. Please use 'Continue with Google'."`

### 2. Manual Login

**Endpoint:** `POST /login`

**Purpose:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "fingerprint": "generated_device_fingerprint"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Invalid credentials or cross-authentication issue
- `500` - Server error

**Possible Error Messages:**
- `"Email and password are required"`
- `"Missing device fingerprint"`
- `"Invalid credentials"`
- `"This email is registered using Google. Please use 'Continue with Google'."`

### 3. Google OAuth Login

**Endpoint:** `GET /google?fp={fingerprint}`

**Purpose:** Initiate Google OAuth flow

**Query Parameters:**
- `fp` (required): URL-encoded device fingerprint

**Implementation:**
```javascript
// Redirect user to this URL
const fingerprint = generateFingerprint();
window.location.href = `${API_BASE_URL}/auth/google?fp=${encodeURIComponent(fingerprint)}`;
```

**Flow:**
1. User is redirected to Google for authentication
2. After Google auth, user is redirected to: `{YOUR_FRONTEND_URL}/login/success?token={jwt_token}`
3. Extract token from URL parameters and store it

**What you need to handle:**
- Create a `/login/success` route to handle the callback
- Extract the token from URL parameters
- Store the token in your preferred storage
- Redirect user to dashboard/home page

### 4. Token Validation

**Endpoint:** `GET /validate`

**Purpose:** Validate current token and get user information

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
x-device-fingerprint: <current_device_fingerprint>
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fingerprint": "fingerprint_hash"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (missing/invalid token)
- `403` - Token used from different device (fingerprint mismatch)

**Error Messages:**
- `"Unauthorized"`
- `"Token used from different device"`
- `"Invalid token"`

---

## Implementation Goals

### Goal 1: Create Authentication Forms
**What to build:**
- Login form with email/password fields
- Registration form with required fields (firstName, lastName, email, password)
- Google login/register button (same API endpoint, I already hnadled sa backend)
- Error message display
- Loading states during authentication

**Key considerations:**
- Validate form inputs before submitting
- Handle and display API error messages appropriately
- Provide clear feedback for cross-authentication scenarios

### Goal 2: Implement Authentication State Management
**What to build:**
- Global state to track authentication status
- User information storage
- Token management functions
- Login/logout functionality

**Key considerations:**
- Check authentication status on app startup
- Validate tokens periodically or on route changes
- Handle token expiration gracefully

### Goal 3: Create Route Protection
**What to build:**
- Component or hook to protect routes
- Redirect logic for unauthenticated users
- Loading states while checking authentication

**Key considerations:**
- Don't flash protected content before auth check
- Provide smooth user experience during redirects

### Goal 4: Handle Google OAuth Callback
**What to build:**
- Route handler for `/login/success`
- Token extraction from URL parameters
- Redirect to appropriate page after successful authentication

**Key considerations:**
- Handle cases where token is missing or invalid
- Clean up URL parameters after token extraction

---

## Cross-Authentication Scenarios

Your implementation must handle these scenarios gracefully:

### Scenario 1: Manual Login with Google-Registered Email
- **Situation:** User registered with Google, tries to login manually
- **API Response:** `"This email is registered using Google. Please use 'Continue with Google'."`
- **Required Action:** Show message with prominent Google login button

### Scenario 2: Google Login with Manually-Registered Email
- **Situation:** User registered manually, uses Google login with same email
- **Backend Behavior:** Automatically merges accounts
- **Required Action:** Normal login flow (no special handling needed)

### Scenario 3: Email Already Exists During Registration
- **Situation:** User tries to register with existing email
- **API Response:** Specific error message based on existing account type
- **Required Action:** Show appropriate message and login option

---

## Security Requirements

### Device Fingerprint Validation
- Always send current device fingerprint with API requests
- Handle `403` responses (fingerprint mismatch) by forcing re-authentication
- Never store or reuse old fingerprints

### Token Security
- Store tokens securely (localStorage is acceptable for this implementation)
- Always include tokens in Authorization header for protected requests
- Clear tokens immediately on logout
- Handle token expiration by redirecting to login

### Error Handling
- Never expose sensitive error details to users
- Log authentication errors for debugging
- Provide user-friendly error messages
- Handle network errors gracefully

---

## Testing Scenarios

Test your implementation with these scenarios:

1. **Happy Path Registration:** New user registers successfully
2. **Happy Path Login:** Existing user logs in successfully
3. **Google OAuth:** User authenticates with Google successfully
4. **Cross-Authentication:** Test both cross-auth scenarios
5. **Token Validation:** Access protected routes with valid/invalid tokens
6. **Device Security:** Try using tokens from different "devices" (different fingerprints)
7. **Error Handling:** Test all error scenarios
8. **Session Persistence:** Refresh page and verify auth state persists

---

## Quick Start Checklist

- [ ] Install required dependencies (axios, react-router-dom, etc.)
- [ ] Implement device fingerprint generation
- [ ] Create authentication service/API calls
- [ ] Build login and registration forms
- [ ] Implement global authentication state
- [ ] Create route protection mechanism
- [ ] Handle Google OAuth callback
- [ ] Test all authentication scenarios
- [ ] Implement proper error handling
- [ ] Add loading states and user feedback

This documentation gives you the flexibility to implement the frontend however you prefer while ensuring compatibility with the authentication backend.

# Company Subscription Configuration API Usage

## Overview
This document explains how to use the company subscription configuration APIs in the application.

## API Endpoints

### 1. Get Subscription Configuration
**GET** `/companies/{companyId}/subscription-config`

Retrieves the subscription configuration for a specific company.

**Example:**
```javascript
const config = await companyService.getSubscriptionConfig('dc977acd-f998-464c-85c8-2c78a587f2e2');
```

**Response:**
- Returns the subscription config object if it exists
- Returns `null` if no configuration exists (404)

### 2. Update Subscription Configuration
**PUT** `/companies/{companyId}/subscription-config`

Updates the subscription configuration for a specific company.

**Example:**
```javascript
const configData = {
  default_plan_type: 'basic',
  default_validity_days: 3650,
  subscription_expiry_days: 3650,
  account_expiry_days: 3650,
  employee_limit: 50000,
  auto_assign_subscription: true,
  enforce_employee_limit: true,
  allowed_plan_types: ['basic']
};

const response = await companyService.updateSubscriptionConfig(
  'dc977acd-f998-464c-85c8-2c78a587f2e2',
  configData
);
```

### 3. Create Subscription Configuration
**POST** `/companies/{companyId}/subscription-config`

Creates a new subscription configuration for a company (if needed separately from update).

**Example:**
```javascript
const response = await companyService.createSubscriptionConfig(
  'dc977acd-f998-464c-85c8-2c78a587f2e2',
  configData
);
```

## Usage in Components

### SubscriptionManagement Component

The `SubscriptionManagement` component (`src/components/Admin/SubscriptionManagement.jsx`) has been updated to use these new APIs.

**Key Features:**
1. **Load Configuration**: Automatically loads existing subscription config on component mount
2. **Default Values**: Uses default configuration if none exists
3. **Update Configuration**: Saves changes using the PUT endpoint
4. **Error Handling**: Gracefully handles 404 responses when no config exists

**Workflow:**
```javascript
// 1. Component loads and fetches existing config
useEffect(() => {
  const config = await companyService.getSubscriptionConfig(companyId);
  if (config) {
    setSubscriptionConfig(config);
  }
  // If null, keeps default config
}, [companyId]);

// 2. User modifies config through form

// 3. On submit, update the config
const response = await companyService.updateSubscriptionConfig(companyId, configData);
```

## Configuration Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `default_plan_type` | string | Type of subscription plan (basic/premium/ultra) | 'basic' |
| `default_validity_days` | number | Default validity period in days | 3650 |
| `subscription_expiry_days` | number | Subscription expiry period in days | 3650 |
| `account_expiry_days` | number | Account expiry period in days | 3650 |
| `employee_limit` | number | Maximum number of employees | 50000 |
| `auto_assign_subscription` | boolean | Auto-assign subscriptions to new employees | true |
| `enforce_employee_limit` | boolean | Enforce the employee limit | true |
| `allowed_plan_types` | array | List of allowed plan types | ['basic'] |

## Company UUID Usage

The APIs work with different company UUIDs. Examples:

```javascript
// Example 1: Get config for company A
const configA = await companyService.getSubscriptionConfig(
  'dc977acd-f998-464c-85c8-2c78a587f2e2'
);

// Example 2: Get config for company B
const configB = await companyService.getSubscriptionConfig(
  '550e8400-e29b-41d4-a716-446655440000'
);

// Example 3: Update config for specific company
await companyService.updateSubscriptionConfig(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  {
    employee_limit: 100,
    default_plan_type: 'premium'
  }
);
```

## Error Handling

```javascript
try {
  const config = await companyService.getSubscriptionConfig(companyId);
  if (config === null) {
    console.log('No subscription config exists yet');
    // Use default configuration
  } else {
    console.log('Config loaded:', config);
  }
} catch (error) {
  console.error('Error fetching config:', error);
  // Handle error appropriately
}
```

## Navigation

To navigate to the subscription management page for a specific company:

```javascript
navigate(`/admin/companies/${companyId}/subscription`);
```

## Testing

You can test the APIs using the provided company UUID:
- Company ID: `dc977acd-f998-464c-85c8-2c78a587f2e2`
- Endpoint: `https://thoughtprob2b.thoughthealer.org/api/v1/companies/dc977acd-f998-464c-85c8-2c78a587f2e2/subscription-config`

## Implementation Summary

✅ **Added to `companyService.js`:**
- `getSubscriptionConfig(companyId)` - GET subscription config
- `updateSubscriptionConfig(companyId, configData)` - PUT subscription config
- `createSubscriptionConfig(companyId, configData)` - POST subscription config

✅ **Updated `SubscriptionManagement.jsx`:**
- Uses new API methods
- Handles null responses (no config yet)
- Proper error handling
- Works with any company UUID

The implementation is now complete and ready to use with different company UUIDs throughout your application!

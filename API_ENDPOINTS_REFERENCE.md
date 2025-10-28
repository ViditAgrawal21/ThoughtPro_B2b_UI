# ThoughtPro B2B API Endpoints Reference

**Base URL:** `https://thoughtprob2b.thoughthealer.org/api/v1`

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Admin Endpoints

### 1. Get Psychologists Overview
**GET** `/admin/psychologists-overview`

Get all psychologists with booking statistics.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "degree": "string",
      "languages": ["string"],
      "emergency_call_rate": number,
      "session_45_minute_rate": number,
      "session_20_minute_rate": number,
      "is_available": boolean,
      "total_bookings": number,
      "pending_bookings": number,
      "completed_bookings": number
    }
  ]
}
```

---

### 2. Get Psychologist Bookings
**GET** `/admin/psychologist-bookings/{psychologistId}`

Get all bookings for a specific psychologist.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "employee_id": "uuid",
      "psychologist_id": "uuid",
      "appointment_date": "YYYY-MM-DD",
      "start_time": "HH:MM:SS",
      "end_time": "HH:MM:SS",
      "session_type": "45_minute|20_minute|emergency",
      "status": "pending|completed|cancelled",
      "total_amount": number
    }
  ]
}
```

---

### 3. Get All Bookings
**GET** `/admin/all-bookings`

Get all bookings across all psychologists.

**Response:** Same as Get Psychologist Bookings

---

### 4. Reassign Booking
**PUT** `/admin/bookings/{bookingId}/reassign`

Reassign a booking to a different psychologist.

**Parameters:**
- `bookingId` (path) - UUID of the booking

**Request Body:**
```json
{
  "new_psychologist_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking reassigned successfully",
  "data": { /* booking object */ }
}
```

---

### 5. Disable Psychologist
**POST** `/admin/psychologists/{psychologistId}/disable`

Temporarily disable a psychologist.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "message": "Psychologist disabled successfully",
  "data": { /* psychologist object */ }
}
```

---

### 6. Enable Psychologist
**POST** `/admin/psychologists/{psychologistId}/enable`

Enable a previously disabled psychologist.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "message": "Psychologist enabled successfully",
  "data": { /* psychologist object */ }
}
```

---

### 7. Get Psychologist Status
**GET** `/admin/psychologists/{psychologistId}/status`

Get psychologist availability status.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "is_available": boolean,
    "weekly_bookings": number,
    "monthly_bookings": number
  }
}
```

---

### 8. Set Booking Limits
**PUT** `/admin/psychologists/{psychologistId}/booking-limits`

Set booking limits for a psychologist.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Request Body:**
```json
{
  "weekly_booking_limit": number,
  "monthly_booking_limit": number
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking limits updated successfully",
  "data": { /* limits object */ }
}
```

---

### 9. Get Booking Limits
**GET** `/admin/psychologists/{psychologistId}/booking-limits`

Get psychologist booking limits and current usage.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "data": {
    "psychologist": {
      "id": "uuid",
      "name": "string"
    },
    "limits": {
      "weekly_booking_limit": number,
      "monthly_booking_limit": number
    },
    "current_usage": {
      "weekly_bookings": number,
      "monthly_bookings": number,
      "weekly_remaining": number,
      "monthly_remaining": number
    }
  }
}
```

---

### 10. Get All Companies
**GET** `/admin/companies`

Get all companies for admin dashboard.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "industry": "string",
      "website": "string",
      "description": "string",
      "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "zipCode": "string"
      }
    }
  ]
}
```

---

### 11. Delete Company
**DELETE** `/admin/companies/{companyId}`

Delete a company (admin only).

**Parameters:**
- `companyId` (path) - UUID of the company

**Response:**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

---

### 12. Delete Psychologist
**DELETE** `/admin/psychologists/{psychologistId}`

Delete a psychologist (admin only).

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "message": "Psychologist deleted successfully"
}
```

---

## Availability Endpoints

### 1. Create Availability Slot
**POST** `/availability`

Create a single availability slot for a psychologist.

**Request Body:**
```json
{
  "psychologist_id": "uuid",
  "time_slot": "ISO 8601 date (YYYY-MM-DDTHH:MM:SS)",
  "availability_status": "Available|Unavailable|Break"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability slot created successfully",
  "data": {
    "id": "uuid",
    "psychologist_id": "uuid",
    "time_slot": "ISO date",
    "availability_status": "string"
  }
}
```

---

### 2. Get Availability by Psychologist
**GET** `/availability/{psychologistId}`

Get all availability slots for a specific psychologist.

**Parameters:**
- `psychologistId` (path) - UUID of the psychologist

**Response:**
```json
{
  "success": true,
  "message": "Availability retrieved successfully",
  "data": {
    "psychologist_id": "uuid",
    "count": number,
    "availability_slots": [
      {
        "id": "uuid",
        "time_slot": "ISO date",
        "availability_status": "string"
      }
    ]
  }
}
```

---

### 3. Update Availability Status
**PATCH** `/availability/{id}`

Update the status of an availability slot.

**Parameters:**
- `id` (path) - UUID of the availability slot

**Request Body:**
```json
{
  "availability_status": "Available|Unavailable|Break",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": { /* updated slot */ }
}
```

---

### 4. Delete Availability Slot
**DELETE** `/availability/{id}`

Delete an availability slot.

**Parameters:**
- `id` (path) - UUID of the availability slot

**Response:**
```json
{
  "success": true,
  "message": "Availability slot deleted successfully"
}
```

---

### 5. Create Bulk Availability (Populate N Days)
**POST** `/availability/populate-n-days`

Create availability slots for multiple psychologists across multiple days.

**Request Body:**
```json
{
  "psychologist_ids": ["uuid"],
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "start_time": "HH:MM",
  "end_time": "HH:MM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk availability created successfully",
  "data": {
    "slots_created": number
  }
}
```

---

### 6. Toggle Day Availability
**PATCH** `/availability/toggle-day`

Toggle availability for a psychologist for an entire day.

**Request Body:**
```json
{
  "psychologist_id": "uuid",
  "date": "YYYY-MM-DD",
  "availability_status": "Available|Unavailable|Break"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Day availability toggled successfully",
  "data": { /* updated slots */ }
}
```

---

### 7. Get All Holidays
**GET** `/holidays`

Get all holidays in the system.

**Response:**
```json
{
  "success": true,
  "message": "Holidays retrieved successfully",
  "data": {
    "holidays": [
      {
        "id": "uuid",
        "date": "YYYY-MM-DD",
        "description": "string",
        "created_at": "ISO date",
        "updated_at": "ISO date"
      }
    ]
  }
}
```

---

### 8. Add Holiday
**POST** `/holidays`

Add a new holiday to the system.

**Request Body:**
```json
{
  "date": "YYYY-MM-DD",
  "description": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Holiday added successfully",
  "data": {
    "id": "uuid",
    "date": "YYYY-MM-DD",
    "description": "string"
  }
}
```

---

### 9. Delete Holiday
**DELETE** `/holidays/{id}`

Delete a holiday from the system.

**Parameters:**
- `id` (path) - UUID of the holiday

**Response:**
```json
{
  "success": true,
  "message": "Holiday deleted successfully"
}
```

---

## Field Naming Conventions

### Frontend → Backend Mapping

The backend uses **snake_case** for all field names, while the frontend uses **camelCase**. The services automatically convert between formats.

**Common Conversions:**
- `psychologistId` → `psychologist_id`
- `weeklySessionsAllowed` → `weekly_booking_limit`
- `monthlySessionsAllowed` → `monthly_booking_limit`
- `timeSlot` → `time_slot`
- `availabilityStatus` → `availability_status`
- `startDate` → `start_date`
- `endDate` → `end_date`
- `startTime` → `start_time`
- `endTime` → `end_time`

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "type": "field",
      "msg": "Validation message",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
- `504` - Gateway Timeout

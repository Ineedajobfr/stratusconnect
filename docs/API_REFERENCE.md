# API Reference

This document provides a comprehensive reference for all APIs in the StratusConnect platform.

## Table of Contents

- [Authentication](#authentication)
- [Job Board API](#job-board-api)
- [Community API](#community-api)
- [Contract API](#contract-api)
- [Document API](#document-api)
- [Analytics API](#analytics-api)
- [Security API](#security-api)
- [User Management API](#user-management-api)

## Authentication

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "pilot",
    "company_id": "company-456"
  },
  "token": "jwt-token-here"
}
```

### Logout
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "token": "new-jwt-token-here"
}
```

## Job Board API

### Get Jobs
```http
GET /api/jobs
```

**Query Parameters:**
- `category` (string): Job category filter
- `location` (string): Location filter
- `job_type` (string): Job type filter (full-time, part-time, contract)
- `min_salary` (number): Minimum salary filter
- `max_salary` (number): Maximum salary filter
- `search` (string): Search term
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "jobs": [
    {
      "id": "job-123",
      "title": "Gulfstream G650 Pilot",
      "description": "Experienced pilot needed for Gulfstream G650 operations",
      "company": "Elite Aviation",
      "location": "New York, NY",
      "job_type": "full-time",
      "salary_range": {
        "min": 150000,
        "max": 200000
      },
      "required_skills": ["Gulfstream G650", "ATP License", "5000+ hours"],
      "posted_at": "2024-01-15T10:00:00Z",
      "application_deadline": "2024-02-15T23:59:59Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Apply for Job
```http
POST /api/jobs/{jobId}/apply
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cover_letter": "I am interested in this position...",
  "resume_url": "https://storage.example.com/resumes/resume.pdf",
  "additional_info": "Additional information about the applicant"
}
```

**Response:**
```json
{
  "application_id": "app-123",
  "status": "submitted",
  "message": "Application submitted successfully"
}
```

### Get Job Applications
```http
GET /api/jobs/applications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Application status filter
- `job_id` (string): Specific job ID filter

**Response:**
```json
{
  "applications": [
    {
      "id": "app-123",
      "job_id": "job-456",
      "job_title": "Gulfstream G650 Pilot",
      "status": "submitted",
      "applied_at": "2024-01-15T10:00:00Z",
      "cover_letter": "I am interested in this position...",
      "resume_url": "https://storage.example.com/resumes/resume.pdf"
    }
  ]
}
```

## Community API

### Get Forums
```http
GET /api/forums
```

**Response:**
```json
{
  "forums": [
    {
      "id": "forum-123",
      "name": "Pilot Discussions",
      "description": "General discussions for pilots",
      "category": "pilots",
      "post_count": 150,
      "last_post": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Forum Posts
```http
GET /api/forums/{forumId}/posts
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term

**Response:**
```json
{
  "posts": [
    {
      "id": "post-123",
      "title": "Best practices for long-haul flights",
      "content": "What are your best practices...",
      "author": {
        "id": "user-123",
        "name": "Captain John Doe",
        "role": "pilot"
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "comment_count": 5,
      "likes": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Create Forum Post
```http
POST /api/forums/{forumId}/posts
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content here...",
  "post_type": "discussion"
}
```

**Response:**
```json
{
  "post_id": "post-123",
  "message": "Post created successfully"
}
```

## Contract API

### Generate Contract
```http
POST /api/contracts/generate
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "deal_id": "deal-123",
  "template_id": "template-456",
  "custom_fields": {
    "client_name": "ABC Aviation",
    "aircraft_type": "Gulfstream G650",
    "flight_duration": "8 hours",
    "total_cost": 50000
  }
}
```

**Response:**
```json
{
  "contract_id": "contract-123",
  "pdf_url": "https://storage.example.com/contracts/contract-123.pdf",
  "status": "generated",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Get Contracts
```http
GET /api/contracts
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `deal_id` (string): Filter by deal ID
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "contracts": [
    {
      "id": "contract-123",
      "deal_id": "deal-456",
      "template_id": "template-789",
      "status": "signed",
      "pdf_url": "https://storage.example.com/contracts/contract-123.pdf",
      "created_at": "2024-01-15T10:00:00Z",
      "signed_at": "2024-01-16T10:00:00Z"
    }
  ]
}
```

### Sign Contract
```http
POST /api/contracts/{contractId}/sign
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "signature_data": "base64-encoded-signature",
  "signature_method": "digital"
}
```

**Response:**
```json
{
  "contract_id": "contract-123",
  "status": "signed",
  "signed_at": "2024-01-16T10:00:00Z"
}
```

## Document API

### Upload Document
```http
POST /api/documents/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <file>
title: "Document Title"
description: "Document description"
document_type: "contract"
tags: ["important", "legal"]
is_public: false
```

**Response:**
```json
{
  "document_id": "doc-123",
  "file_url": "https://storage.example.com/documents/doc-123.pdf",
  "file_name": "document.pdf",
  "file_size": 1024000,
  "mime_type": "application/pdf",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Get Documents
```http
GET /api/documents
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `document_type` (string): Filter by document type
- `deal_id` (string): Filter by deal ID
- `search` (string): Search term
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "documents": [
    {
      "id": "doc-123",
      "title": "Contract Document",
      "description": "Legal contract for flight services",
      "document_type": "contract",
      "file_url": "https://storage.example.com/documents/doc-123.pdf",
      "file_name": "contract.pdf",
      "file_size": 1024000,
      "mime_type": "application/pdf",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Download Document
```http
GET /api/documents/{documentId}/download
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"

<file content>
```

## Analytics API

### Get Analytics Dashboard
```http
GET /api/analytics/dashboard
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `time_range` (string): Time range (7d, 30d, 90d)
- `start_date` (string): Start date (ISO 8601)
- `end_date` (string): End date (ISO 8601)

**Response:**
```json
{
  "total_users": 1250,
  "active_users": 890,
  "total_jobs": 340,
  "active_jobs": 156,
  "total_revenue": 2500000,
  "monthly_revenue": 180000,
  "conversion_rate": 12.5,
  "average_response_time": 2.3,
  "user_growth": 15.2,
  "job_growth": 8.7,
  "revenue_growth": 22.1
}
```

### Get Performance Metrics
```http
GET /api/analytics/performance
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "response_time": 150,
  "throughput": 1250,
  "error_rate": 0.1,
  "memory_usage": 65,
  "cpu_usage": 45,
  "disk_usage": 78,
  "uptime": 99.9
}
```

## Security API

### Get Security Events
```http
GET /api/security/events
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `severity` (string): Filter by severity
- `type` (string): Filter by event type
- `resolved` (boolean): Filter by resolved status
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "events": [
    {
      "id": "event-123",
      "type": "failed_login",
      "severity": "high",
      "description": "Multiple failed login attempts detected",
      "user_id": "user-123",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:00:00Z",
      "resolved": false
    }
  ]
}
```

### Resolve Security Event
```http
POST /api/security/events/{eventId}/resolve
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "event_id": "event-123",
  "status": "resolved",
  "resolved_at": "2024-01-15T10:30:00Z"
}
```

## User Management API

### Get User Profile
```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "pilot",
  "company_id": "company-456",
  "verification_status": "verified",
  "profile": {
    "location": "New York, NY",
    "experience_years": 10,
    "total_flight_hours": 5000,
    "availability_status": "available",
    "skills": ["Gulfstream G650", "Boeing 737", "ATP License"],
    "certifications": ["ATP", "Type Rating G650", "First Class Medical"]
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Update User Profile
```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "profile": {
    "location": "Los Angeles, CA",
    "experience_years": 12,
    "total_flight_hours": 6000,
    "availability_status": "available",
    "skills": ["Gulfstream G650", "Boeing 737", "Boeing 777", "ATP License"],
    "certifications": ["ATP", "Type Rating G650", "Type Rating B777", "First Class Medical"]
  }
}
```

**Response:**
```json
{
  "id": "user-123",
  "message": "Profile updated successfully",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Rate limit exceeded
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 10 requests per 15 minutes
- **Job application endpoints**: 50 requests per hour
- **Forum posting endpoints**: 20 requests per 30 minutes
- **Document upload endpoints**: 5 requests per hour
- **General API endpoints**: 1000 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Authentication

All API endpoints (except public ones) require authentication via JWT token:

```
Authorization: Bearer <jwt-token>
```

Tokens expire after 24 hours and can be refreshed using the refresh endpoint.

## Webhooks

The platform supports webhooks for real-time notifications:

- **Job Application**: When a new job application is submitted
- **Contract Signed**: When a contract is digitally signed
- **Security Event**: When a security event is detected
- **User Activity**: When significant user activity occurs

Webhook payloads include event type, timestamp, and relevant data:

```json
{
  "event_type": "job_application",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "application_id": "app-123",
    "job_id": "job-456",
    "applicant_id": "user-789"
  }
}
```

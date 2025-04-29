# Error Handling Architecture

## Client-Side
1. **UI Boundaries**: ErrorBoundary components
2. **API Errors**: Structured error responses
3. **Validation**: Zod schema validation

## Server-Side
1. **Operational Errors**: 4xx status codes
2. **Programmatic Errors**: 5xx status codes
3. **Validation**: Middleware pipeline

## Error Codes Reference
| Code | Meaning | Resolution |
|------|---------|------------|
| AUTH_001 | Invalid credentials | Check email/password |
| VALID_002 | Missing required field | Review form inputs |

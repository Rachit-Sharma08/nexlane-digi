# Phase 2A Implementation Plan

## Overview
Replace single shared-password admin login with two named, allowlisted admin accounts using Supabase Auth, add login-attempt limiting, and move admin panel off predictable route.

## Tasks

### 1. Database & Supabase Setup
- [ ] Add @supabase/supabase-js and @supabase/ssr dependencies
- [ ] Create Supabase server client (server-side only, service role)
- [ ] Create database schema for login attempts table
- [ ] Document Supabase project setup in PROGRESS.md (owner creates project)

### 2. Admin Auth Library
- [ ] Create new admin auth library using Supabase Auth
- [ ] Implement login attempt tracking with lockout logic
- [ ] Implement account disable/enable functionality
- [ ] Implement password change functionality

### 3. Login UI Updates
- [ ] Update login form to use email + password
- [ ] Keep Forest & Sage visual style
- [ ] Add generic error messages (no email enumeration)

### 4. API Routes
- [ ] Update /api/admin/login route
- [ ] Update /api/admin/logout route
- [ ] Create /api/admin/accounts route for account management
- [ ] Create /api/admin/login-attempts route for viewing attempts

### 5. Route Renaming
- [ ] Add ADMIN_ROUTE_SLUG env var
- [ ] Update proxy.ts to use dynamic admin route
- [ ] Update all admin page paths to use the env var
- [ ] Ensure old /admin paths 404 in production

### 6. Admin Panel Updates
- [ ] Add account management UI (view attempts, clear lockout, disable/enable account)
- [ ] Add password change UI

### 7. Tests
- [ ] Add tests for auth, lockout, route logic
- [ ] Run existing tests to ensure no regressions

### 8. Verification & Documentation
- [ ] Run npx tsc --noEmit, npm run lint, npm run build, npm test, npm audit
- [ ] Take screenshots at 1440/768/360
- [ ] Update AGENTS.md with Admin auth section
- [ ] Update docs/PROGRESS.md with Phase 2A details
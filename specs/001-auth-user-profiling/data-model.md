# Data Model: User Authentication and Profile Collection

## Overview
This document defines the data models for the user authentication and profile collection system. The system uses Better-Auth for authentication and Neon Postgres for storing user profile data.

## Entity: User
Represents a registered user with authentication information managed by Better-Auth.

**Fields:**
- `id` (string): Unique identifier for the user, provided by Better-Auth
- `email` (string): User's email address, validated format
- `createdAt` (datetime): Timestamp when the user account was created
- `updatedAt` (datetime): Timestamp when the user account was last updated
- `emailVerified` (boolean): Whether the user's email has been verified

**Relationships:**
- One-to-One: UserProfile (linked via user_id)

## Entity: UserProfile
Contains user's software and hardware background information linked to the User via user ID.

**Fields:**
- `id` (integer): Auto-incrementing primary key
- `user_id` (string): Foreign key linking to the User entity (Better-Auth user ID)
- `software_level` (enum): User's software skill level - values: "Beginner", "Intermediate", "Advanced"
- `programming_languages` (array of strings): List of programming languages the user knows
- `hardware_knowledge` (array of enums): List of hardware areas the user knows - values: "IoT", "Robotics", "PC Hardware", "None"
- `experience_level` (enum): User's experience level - values: "Student", "Professional", "Hobbyist"
- `created_at` (datetime): Timestamp when the profile was created
- `updated_at` (datetime): Timestamp when the profile was last updated

**Relationships:**
- One-to-One: User (linked via user_id)

## Validation Rules
Based on the functional requirements:

1. **Email Validation (FR-010)**: Email format must follow standard email validation patterns
2. **Password Validation (FR-010)**: Password must have minimum length of 8 characters with complexity requirements
3. **Duplicate Email Prevention (FR-011)**: Email addresses must be unique across all users
4. **Programming Languages Validation (FR-014)**: Programming languages must be validated against a predefined list of valid options
5. **Profile Data Completeness (FR-003)**: All profile fields should be collected during registration

## State Transitions
1. **User Registration Flow**:
   - User entity created via Better-Auth
   - UserProfile entity created and linked to User
   - Both entities are active and accessible

2. **Profile Update Flow**:
   - UserProfile entity updated with new information
   - Updated timestamp is modified
   - User entity remains unchanged

3. **Account Deletion Flow**:
   - UserProfile entity deleted (following referential integrity)
   - User entity deleted via Better-Auth
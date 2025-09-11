# Data Model: Migrate Broken GitHub Web Application to Turborepo-Shadcn-Nextjs Structure

**Date**: September 11, 2025
**Source**: Feature Specification Requirements

## Core Entities

### User Entity
**Purpose**: Represents application users with authentication and profile data
**Fields**:
- `id`: Unique identifier (string/uuid)
- `email`: User email address (string, required, unique)
- `username`: Display name (string, required)
- `profile`: User profile information (object)
- `preferences`: User settings and preferences (object)
- `createdAt`: Account creation timestamp (datetime)
- `updatedAt`: Last update timestamp (datetime)
- `lastLogin`: Last login timestamp (datetime)

**Validation Rules**:
- Email must be valid format
- Username must be unique and 3-50 characters
- Profile data must conform to schema
- Timestamps must be valid ISO dates

**Relationships**:
- One-to-many with Application Data (user owns data)
- One-to-one with Authentication Flow (user auth state)

### Application Data Entity
**Purpose**: Represents existing data that must be preserved during migration
**Fields**:
- `id`: Unique identifier (string/uuid)
- `userId`: Owner user ID (foreign key to User)
- `type`: Data type/category (string, enum)
- `content`: Data payload (object/json)
- `metadata`: Additional data information (object)
- `createdAt`: Creation timestamp (datetime)
- `updatedAt`: Last update timestamp (datetime)
- `version`: Data version for migration tracking (integer)

**Validation Rules**:
- userId must reference existing User
- type must be from predefined enum
- content must validate against schema
- version must increment on updates

**Relationships**:
- Many-to-one with User (belongs to user)
- One-to-many with API Endpoints (data accessed via APIs)

### API Endpoints Entity
**Purpose**: Represents existing API interfaces that must be maintained
**Fields**:
- `id`: Unique identifier (string/uuid)
- `path`: API endpoint path (string)
- `method`: HTTP method (string, enum: GET, POST, PUT, DELETE)
- `description`: Endpoint purpose (string)
- `parameters`: Expected parameters (object/schema)
- `response`: Expected response format (object/schema)
- `authentication`: Auth requirements (string, enum)
- `deprecated`: Deprecation status (boolean)

**Validation Rules**:
- path must be valid URL path format
- method must be valid HTTP method
- parameters/response must be valid JSON schemas
- authentication must reference valid auth method

**Relationships**:
- Many-to-many with Application Data (endpoints access data)
- One-to-one with Database Schema (endpoints map to data operations)

### Database Schema Entity
**Purpose**: Represents current data structure that needs preservation or restructuring
**Fields**:
- `id`: Unique identifier (string/uuid)
- `tableName`: Database table/collection name (string)
- `schema`: Table structure definition (object)
- `indexes`: Database indexes (array)
- `relationships`: Foreign key relationships (array)
- `migrations`: Migration history (array)
- `version`: Schema version (string)

**Validation Rules**:
- tableName must be valid identifier
- schema must be valid database schema format
- indexes must reference valid columns
- relationships must reference existing tables

**Relationships**:
- One-to-many with Application Data (schema defines data structure)
- One-to-one with API Endpoints (schema supports API operations)

### UI Components Entity
**Purpose**: Represents user interface elements that need upgrading
**Fields**:
- `id`: Unique identifier (string/uuid)
- `name`: Component name (string)
- `type`: Component type (string, enum)
- `library`: Source library (string, enum: shadcn, magicui, animate-ui, reacbits)
- `props`: Component properties (object/schema)
- `dependencies`: Required dependencies (array)
- `status`: Migration status (string, enum: pending, migrated, optimized)

**Validation Rules**:
- name must be unique within library
- type must be from predefined component types
- library must be from approved UI libraries
- props must conform to component interface

**Relationships**:
- Many-to-one with Navigation Components (UI components used in navigation)
- One-to-many with Landing Components (UI components used in landing pages)

### Landing Page Component Entity
**Purpose**: Represents main landing page component from magic-template repository
**Fields**:
- `id`: Unique identifier (string/uuid)
- `name`: Component name (string)
- `source`: Source repository (string, default: magic-template)
- `layout`: Layout configuration (object)
- `sections`: Page sections (array)
- `dependencies`: Required components (array)
- `integrationPoints`: Connection points to layout.tsx/page.tsx (array)

**Validation Rules**:
- name must match source repository component
- layout must be valid configuration object
- sections must reference valid component types
- integrationPoints must reference existing app files

**Relationships**:
- One-to-many with Landing Components (landing page contains landing components)
- Many-to-one with UI Components (inherits from base UI component)

### Landing Components Entity
**Purpose**: Represents all components in components/landings folder
**Fields**:
- `id`: Unique identifier (string/uuid)
- `name`: Component name (string)
- `folder`: Source folder path (string)
- `type`: Component category (string)
- `props`: Component properties (object)
- `connections`: Links to layout.tsx/page.tsx (array)
- `dependencies`: Required dependencies (array)

**Validation Rules**:
- folder must exist in components/landings
- type must be from predefined categories
- connections must reference valid app files
- dependencies must be resolvable

**Relationships**:
- Many-to-one with Landing Page Component (components belong to landing page)
- One-to-many with Navigation Components (landing components may include navigation)

### Navigation Components Entity
**Purpose**: Represents navigation-related components and dependencies
**Fields**:
- `id`: Unique identifier (string/uuid)
- `name`: Component name (string)
- `type`: Navigation type (string, enum: header, footer, sidebar, menu)
- `routes`: Navigation routes (array)
- `state`: Navigation state management (object)
- `accessibility`: A11y features (object)
- `responsive`: Responsive behavior (object)

**Validation Rules**:
- type must be from predefined navigation types
- routes must be valid application routes
- state must conform to navigation state schema
- accessibility must meet WCAG standards

**Relationships**:
- Many-to-one with UI Components (navigation uses base UI components)
- One-to-many with Landing Components (navigation used across landing components)

### Authentication Flow Entity
**Purpose**: Represents login and authorization processes
**Fields**:
- `id`: Unique identifier (string/uuid)
- `userId`: Associated user ID (foreign key)
- `method`: Authentication method (string, enum)
- `token`: Auth token (string, encrypted)
- `expiresAt`: Token expiration (datetime)
- `permissions`: User permissions (array)
- `session`: Session data (object)

**Validation Rules**:
- userId must reference existing User
- method must be from supported auth methods
- token must be properly encrypted
- expiresAt must be future date
- permissions must be from predefined set

**Relationships**:
- One-to-one with User (user has one active auth flow)
- Many-to-one with API Endpoints (auth required for protected endpoints)

### Deployment Configuration Entity
**Purpose**: Represents setup needed for production deployment
**Fields**:
- `id`: Unique identifier (string/uuid)
- `environment`: Deployment environment (string, enum: dev, staging, prod)
- `config`: Environment configuration (object)
- `secrets`: Encrypted secrets (object)
- `endpoints`: Service endpoints (object)
- `monitoring`: Monitoring configuration (object)

**Validation Rules**:
- environment must be from predefined environments
- config must contain required environment variables
- secrets must be properly encrypted
- endpoints must be valid URLs

**Relationships**:
- One-to-one with Application Data (deployment config affects data handling)
- Many-to-one with API Endpoints (deployment config defines API hosts)

## Entity Relationships Diagram

```
User (1) ──── (N) Application Data
  │                    │
  │                    │
  └───── (1) Authentication Flow
               │
               │
API Endpoints (N) ──── (1) Database Schema
  │
  │
  └───── (N) UI Components
                    │
                    │
          ┌─────────┴─────────┐
          │                   │
Landing Page Component    Navigation Components
          │                   │
          │                   │
     (N) Landing Components   │
                              │
                              │
                         (1) Deployment Configuration
```

## Data Flow Patterns

1. **User Authentication Flow**:
   User → Authentication Flow → API Endpoints → Application Data

2. **Component Migration Flow**:
   Landing Page Component → Landing Components → Navigation Components → UI Components

3. **Data Preservation Flow**:
   Database Schema → Application Data → API Endpoints → User

## Validation Rules Summary

- All entities require unique IDs
- Foreign key relationships must be maintained
- Schema validation for complex objects
- Temporal fields must be valid ISO dates
- Enumerated fields must use predefined values
- Cross-entity references must be resolvable

## Migration Considerations

- Preserve existing User and Application Data relationships
- Maintain API Endpoints contracts during component updates
- Ensure Database Schema integrity during restructuring
- Validate UI Components compatibility with new libraries
- Test Authentication Flow continuity
- Verify Deployment Configuration portability

---

*Data model extracted from feature specification requirements - Phase 1 execution*</content>
<parameter name="filePath">/home/dice-wizard/dev/web-design-workbench/specs/001-create-a-specification/data-model.md

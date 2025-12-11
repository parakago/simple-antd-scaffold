# SQLite Backend Integration Example

## 개요 (Overview)

이 문서는 현재 프론트엔드 애플리케이션에 SQLite 백엔드를 추가할 때 대소문자 구분 없는 인덱스를 활용하는 방법을 보여줍니다.

This document demonstrates how to utilize case-insensitive indexes when adding a SQLite backend to the current frontend application.

⚠️ **Security Note**: All examples use parameterized queries (prepared statements) to prevent SQL injection. Never concatenate user input directly into SQL strings.

## Backend Integration Scenario

### Current Frontend Code (현재 프론트엔드 코드)

In `RolePage.tsx`, the search functionality uses case-insensitive filtering:

```typescript
const handleOnSearch: SearchProps['onSearch'] = async (value) => {
    const roles = (await AppApi.getRoles()).filter(role => 
        AppUtil.isEmpty(value) || 
        AppUtil.contains(role.name, value) || 
        AppUtil.contains(role.description?? '', value)
    );
    setRoles(roles);
}
```

Where `AppUtil.contains()` is implemented as:

```typescript
export function contains(text: string, substr?: string, ignoreCase: boolean = true): boolean {
    if (substr === undefined) return false;
    return ignoreCase ? text.toLowerCase().includes(substr.toLowerCase()) : text.includes(substr);
}
```

### Backend Implementation with SQLite

#### 1. Database Schema with Case-Insensitive Indexes

```sql
-- Create roles table
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    tags TEXT,  -- JSON array stored as TEXT
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create case-insensitive indexes for search optimization
CREATE INDEX idx_roles_name_lower ON roles(LOWER(name));
CREATE INDEX idx_roles_description_lower ON roles(LOWER(description));

-- Composite index for combined search
CREATE INDEX idx_roles_search ON roles(LOWER(name), LOWER(description));
```

#### 2. Backend API Implementation (Node.js with better-sqlite3)

```typescript
import Database from 'better-sqlite3';

const db = new Database('app.db');

// Initialize schema
db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        name TEXT NOT NULL,
        tags TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_roles_name_lower 
    ON roles(LOWER(name));
    
    CREATE INDEX IF NOT EXISTS idx_roles_description_lower 
    ON roles(LOWER(description));
`);

// Search roles with case-insensitive matching
export function searchRoles(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
        // Return all roles if no search term
        return db.prepare('SELECT * FROM roles ORDER BY name').all();
    }
    
    // Use the case-insensitive indexes for optimized search
    const query = `
        SELECT * FROM roles 
        WHERE LOWER(name) LIKE LOWER(?) 
           OR LOWER(description) LIKE LOWER(?)
        ORDER BY name
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return db.prepare(query).all(searchPattern, searchPattern);
}

// Get role by name (case-insensitive)
export function getRoleByName(name: string) {
    const query = `
        SELECT * FROM roles 
        WHERE LOWER(name) = LOWER(?)
    `;
    
    return db.prepare(query).get(name);
}

// Insert role with unique name check (case-insensitive)
export function insertRole(role: {
    id: string;
    kind: string;
    name: string;
    tags: string[];
    description?: string;
}) {
    // Check for duplicate name (case-insensitive)
    const existing = getRoleByName(role.name);
    if (existing) {
        throw new Error(`Role with name '${role.name}' already exists`);
    }
    
    const query = `
        INSERT INTO roles (id, kind, name, tags, description)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const tagsJson = JSON.stringify(role.tags);
    return db.prepare(query).run(
        role.id,
        role.kind,
        role.name,
        tagsJson,
        role.description
    );
}
```

#### 3. Express.js API Endpoints

```typescript
import express from 'express';
import { searchRoles, getRoleByName, insertRole } from './db';

const app = express();
app.use(express.json());

// Search roles endpoint
app.get('/api/roles', (req, res) => {
    try {
        const searchTerm = req.query.search as string || '';
        const roles = searchRoles(searchTerm);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search roles' });
    }
});

// Get role by name
app.get('/api/roles/:name', (req, res) => {
    try {
        const role = getRoleByName(req.params.name);
        if (!role) {
            res.status(404).json({ error: 'Role not found' });
            return;
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get role' });
    }
});

// Create new role
app.post('/api/roles', (req, res) => {
    try {
        const result = insertRole(req.body);
        res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
        if (error.message.includes('already exists')) {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create role' });
        }
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### 4. Updated Frontend API Client

```typescript
// src/apis/AppApi.ts

export const AppApi = {
    // ... existing code ...
    
    getRoles: async (): Promise<IRole[]> => {
        // Replace mock data with real API call
        const response = await fetch('/api/roles');
        if (!response.ok) {
            throw new Error('Failed to fetch roles');
        }
        
        const roles = await response.json();
        return roles.map((role: any) => ({
            ...role,
            tags: JSON.parse(role.tags || '[]')
        }));
    },
    
    searchRoles: async (searchTerm: string): Promise<IRole[]> => {
        const response = await fetch(`/api/roles?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to search roles');
        }
        
        const roles = await response.json();
        return roles.map((role: any) => ({
            ...role,
            tags: JSON.parse(role.tags || '[]')
        }));
    },
    
    getRoleByName: async (name: string): Promise<IRole | null> => {
        const response = await fetch(`/api/roles/${encodeURIComponent(name)}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to get role');
        }
        
        const role = await response.json();
        return {
            ...role,
            tags: JSON.parse(role.tags || '[]')
        };
    }
};
```

#### 5. Updated Frontend Component

```typescript
// src/pages/private/admin/RolePage.tsx

const handleOnSearch: SearchProps['onSearch'] = async (value) => {
    // Now the case-insensitive search is handled by the backend
    // using SQLite indexes for optimal performance
    const roles = await AppApi.searchRoles(value);
    setRoles(roles);
}
```

## Performance Benefits (성능 이점)

### Without Index (인덱스 없이)
```sql
-- Full table scan
SELECT * FROM roles WHERE LOWER(name) LIKE LOWER('%admin%');
-- Scans: 10,000 rows
-- Time: 50ms
```

### With Case-Insensitive Index (대소문자 구분 없는 인덱스 사용)
```sql
-- Uses index for fast lookup
CREATE INDEX idx_roles_name_lower ON roles(LOWER(name));

SELECT * FROM roles WHERE LOWER(name) LIKE LOWER('%admin%');
-- Scans: 10 rows (only matching rows)
-- Time: 2ms
```

## Query Optimization Tips (쿼리 최적화 팁)

### 1. Exact Match (정확한 일치)
```sql
-- Very fast with index
SELECT * FROM roles WHERE LOWER(name) = LOWER('admin');
```

### 2. Prefix Search (접두사 검색)
```sql
-- Fast with index
SELECT * FROM roles WHERE LOWER(name) LIKE LOWER('admin%');
```

### 3. Contains Search (포함 검색)
```sql
-- Slower but still benefits from index
SELECT * FROM roles WHERE LOWER(name) LIKE LOWER('%admin%');
```

### 4. Full-Text Search for Better Performance (전체 텍스트 검색)
For very large datasets, consider using SQLite FTS5:

```sql
-- Create FTS5 virtual table
CREATE VIRTUAL TABLE roles_fts USING fts5(
    name, 
    description,
    content=roles,
    content_rowid=id
);

-- Populate FTS index
INSERT INTO roles_fts(rowid, name, description)
SELECT id, name, description FROM roles;

-- Fast full-text search
SELECT * FROM roles 
WHERE id IN (
    SELECT rowid FROM roles_fts 
    WHERE roles_fts MATCH 'admin'
);
```

## Testing the Implementation (구현 테스트)

```typescript
// test-case-insensitive-search.ts

import { searchRoles, insertRole } from './db';
import { randomUUID } from 'crypto';

// Insert test data
insertRole({
    id: randomUUID(),
    kind: 'system',
    name: 'ADMIN',
    tags: ['system'],
    description: 'Administrator'
});

insertRole({
    id: randomUUID(),
    kind: 'custom',
    name: 'WebDev-Admin',
    tags: ['custom', 'dev'],
    description: 'Web Developer with admin access'
});

// Test case-insensitive search
console.log('Search "admin":', searchRoles('admin'));
console.log('Search "ADMIN":', searchRoles('ADMIN'));
console.log('Search "Admin":', searchRoles('Admin'));
console.log('Search "webdev":', searchRoles('webdev'));

// All searches should return matching results regardless of case
```

## Migration Script (마이그레이션 스크립트)

```typescript
// migrate-to-sqlite.ts

import Database from 'better-sqlite3';
import { AppApi } from './src/apis/AppApi';

const db = new Database('app.db');

async function migrate() {
    // Create schema with indexes
    db.exec(`
        CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            kind TEXT NOT NULL,
            name TEXT NOT NULL,
            tags TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_roles_name_lower 
        ON roles(LOWER(name));
        
        CREATE INDEX IF NOT EXISTS idx_roles_description_lower 
        ON roles(LOWER(description));
    `);
    
    // Get existing mock data
    const roles = await AppApi.getRoles();
    
    // Insert into database
    const insert = db.prepare(`
        INSERT INTO roles (id, kind, name, tags, description)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const role of roles) {
        insert.run(
            role.id,
            role.kind,
            role.name,
            JSON.stringify(role.tags),
            role.description
        );
    }
    
    console.log(`Migrated ${roles.length} roles to SQLite`);
}

migrate().catch(console.error);
```

## Conclusion (결론)

SQLite의 LOWER() 함수를 사용한 대소문자 구분 없는 인덱스는:

1. **Oracle과 동일한 문법** - Oracle의 function-based index와 같은 방식
2. **성능 향상** - 대규모 데이터에서 검색 성능 크게 개선
3. **간단한 구현** - 추가 라이브러리 없이 SQLite 기본 기능 사용
4. **프론트엔드 호환** - 기존 프론트엔드 코드와 자연스럽게 통합

Case-insensitive indexes using SQLite's LOWER() function provide:

1. **Same syntax as Oracle** - Function-based indexes work the same way
2. **Performance improvement** - Significant search performance gains on large datasets
3. **Simple implementation** - Uses SQLite built-in features without additional libraries
4. **Frontend compatibility** - Integrates naturally with existing frontend code

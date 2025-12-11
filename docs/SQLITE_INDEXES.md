# SQLite Case-Insensitive Indexes (대소문자 구분 없는 인덱스)

## Overview (개요)

SQLite에서 Oracle처럼 LOWER() 함수를 사용하여 대소문자를 구분하지 않는 인덱스를 생성할 수 있습니다.

In SQLite, you can create case-insensitive indexes using the LOWER() function, similar to Oracle's function-based indexes.

## Basic Syntax (기본 문법)

### Simple Column Index (일반 컬럼 인덱스)
```sql
CREATE INDEX idx_user_email ON users(email);
```

### Case-Insensitive Index with LOWER() (LOWER() 함수를 사용한 대소문자 구분 없는 인덱스)
```sql
CREATE INDEX idx_user_email_lower ON users(LOWER(email));
```

## Usage Examples (사용 예제)

### 1. Basic Case-Insensitive Index (기본 대소문자 구분 없는 인덱스)

**Table Creation:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Index Creation:**
```sql
-- Create case-insensitive index on email
CREATE INDEX idx_user_email_lower ON users(LOWER(email));

-- Create case-insensitive index on username
CREATE INDEX idx_user_username_lower ON users(LOWER(username));
```

**Query Usage:**
```sql
-- This query will use the index
SELECT * FROM users WHERE LOWER(email) = LOWER('User@Example.Com');

-- This query will also use the index
SELECT * FROM users WHERE LOWER(username) = 'john';
```

### 2. Composite Index with LOWER() (복합 인덱스와 LOWER())

```sql
-- Create composite index with case-insensitive columns
CREATE INDEX idx_user_name_email 
ON users(LOWER(username), LOWER(email));

-- Query that uses the composite index
SELECT * FROM users 
WHERE LOWER(username) = 'john' AND LOWER(email) = 'john@example.com';
```

### 3. Partial Index with LOWER() (부분 인덱스와 LOWER())

```sql
-- Create partial index for active users only
CREATE INDEX idx_active_user_email 
ON users(LOWER(email)) 
WHERE is_active = 1;

-- Query that uses the partial index
SELECT * FROM users 
WHERE LOWER(email) = 'user@example.com' AND is_active = 1;
```

## Comparison with Oracle (Oracle과의 비교)

### Oracle Function-Based Index
```sql
-- Oracle syntax
CREATE INDEX idx_user_email_lower 
ON users (LOWER(email));
```

### SQLite Equivalent
```sql
-- SQLite syntax (same!)
CREATE INDEX idx_user_email_lower 
ON users (LOWER(email));
```

The syntax is identical! SQLite supports function-based indexes just like Oracle.

## Best Practices (모범 사례)

### 1. Use COLLATE NOCASE for Simple Cases (단순한 경우 COLLATE NOCASE 사용)

For basic ASCII case-insensitive comparisons, you can use COLLATE NOCASE:

```sql
-- Option 1: Column-level collation
CREATE TABLE users (
    email TEXT COLLATE NOCASE
);

CREATE INDEX idx_user_email ON users(email);

-- Query without LOWER()
SELECT * FROM users WHERE email = 'User@Example.Com';
```

### 2. Use LOWER() for Unicode Support (유니코드 지원을 위해 LOWER() 사용)

For proper Unicode case handling, use LOWER():

```sql
CREATE INDEX idx_user_email_lower ON users(LOWER(email));

SELECT * FROM users WHERE LOWER(email) = LOWER('Ümit@Example.Com');
```

### 3. Index Performance Tips (인덱스 성능 팁)

```sql
-- Good: Query uses the same function as the index
CREATE INDEX idx_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Bad: Query doesn't match the index definition
CREATE INDEX idx_email_lower ON users(LOWER(email));
SELECT * FROM users WHERE email = 'user@example.com';  -- Won't use the index!
```

## Complete Example Schema (완전한 스키마 예제)

```sql
-- Create table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create case-insensitive indexes
CREATE UNIQUE INDEX idx_user_email_unique 
ON users(LOWER(email));

CREATE INDEX idx_user_username_lower 
ON users(LOWER(username));

CREATE INDEX idx_user_fullname_lower 
ON users(LOWER(first_name), LOWER(last_name));

-- Create partial index for active users
CREATE INDEX idx_active_user_search 
ON users(LOWER(username), LOWER(email)) 
WHERE is_active = 1;

-- Insert sample data
INSERT INTO users (email, username, first_name, last_name) 
VALUES 
    ('John.Doe@Example.Com', 'JohnDoe', 'John', 'Doe'),
    ('jane.smith@Example.COM', 'JaneSmith', 'Jane', 'Smith');

-- Query examples that use indexes
SELECT * FROM users WHERE LOWER(email) = 'john.doe@example.com';
SELECT * FROM users WHERE LOWER(username) = 'johndoe';
SELECT * FROM users WHERE LOWER(first_name) = 'john' AND LOWER(last_name) = 'doe';
```

## Checking Index Usage (인덱스 사용 확인)

Use EXPLAIN QUERY PLAN to verify index usage:

```sql
EXPLAIN QUERY PLAN 
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Expected output should mention: SEARCH users USING INDEX idx_user_email_lower
```

## References (참고 자료)

- [SQLite CREATE INDEX documentation](https://www.sqlite.org/lang_createindex.html)
- [SQLite Core Functions](https://www.sqlite.org/lang_corefunc.html)
- [Oracle Function-Based Indexes](https://docs.oracle.com/en/database/oracle/oracle-database/)

## Notes (참고 사항)

1. **Function-based indexes work in SQLite**: SQLite fully supports creating indexes on expressions, including function calls like LOWER().

2. **Query must match index**: To use a function-based index, your WHERE clause must use the exact same expression as the index.

3. **Performance**: Function-based indexes can significantly improve query performance for case-insensitive searches.

4. **Storage**: Function-based indexes store the computed values, so they take up additional space.

5. **Maintenance**: The index is automatically maintained when data changes.

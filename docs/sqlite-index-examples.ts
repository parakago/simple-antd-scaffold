/**
 * SQLite Index Generator Utilities
 * 
 * This file provides utility functions for generating SQLite index creation statements,
 * including case-insensitive indexes using LOWER() function.
 * 
 * 이 파일은 LOWER() 함수를 사용한 대소문자 구분 없는 인덱스를 포함하여
 * SQLite 인덱스 생성 구문을 생성하는 유틸리티 함수들을 제공합니다.
 */

export namespace SQLiteIndexUtil {
    
    /**
     * Interface for index configuration
     */
    export interface IndexConfig {
        indexName: string;
        tableName: string;
        columns: string[];
        unique?: boolean;
        caseInsensitive?: boolean;
        partial?: string; // WHERE clause for partial index
    }

    /**
     * Generate a simple index creation statement
     * 단순 인덱스 생성 구문 생성
     * 
     * @param tableName - Table name
     * @param columnName - Column name
     * @param indexName - Optional custom index name
     * @returns SQL CREATE INDEX statement
     * 
     * @example
     * createSimpleIndex('users', 'email')
     * // Returns: "CREATE INDEX idx_users_email ON users(email);"
     */
    export function createSimpleIndex(
        tableName: string,
        columnName: string,
        indexName?: string
    ): string {
        const idxName = indexName || `idx_${tableName}_${columnName}`;
        return `CREATE INDEX ${idxName} ON ${tableName}(${columnName});`;
    }

    /**
     * Generate a case-insensitive index using LOWER()
     * LOWER() 함수를 사용한 대소문자 구분 없는 인덱스 생성
     * 
     * @param tableName - Table name
     * @param columnName - Column name
     * @param indexName - Optional custom index name
     * @returns SQL CREATE INDEX statement with LOWER()
     * 
     * @example
     * createCaseInsensitiveIndex('users', 'email')
     * // Returns: "CREATE INDEX idx_users_email_lower ON users(LOWER(email));"
     */
    export function createCaseInsensitiveIndex(
        tableName: string,
        columnName: string,
        indexName?: string
    ): string {
        const idxName = indexName || `idx_${tableName}_${columnName}_lower`;
        return `CREATE INDEX ${idxName} ON ${tableName}(LOWER(${columnName}));`;
    }

    /**
     * Generate a unique case-insensitive index
     * 유일 대소문자 구분 없는 인덱스 생성
     * 
     * @param tableName - Table name
     * @param columnName - Column name
     * @param indexName - Optional custom index name
     * @returns SQL CREATE UNIQUE INDEX statement with LOWER()
     * 
     * @example
     * createUniqueCaseInsensitiveIndex('users', 'email')
     * // Returns: "CREATE UNIQUE INDEX idx_users_email_unique ON users(LOWER(email));"
     */
    export function createUniqueCaseInsensitiveIndex(
        tableName: string,
        columnName: string,
        indexName?: string
    ): string {
        const idxName = indexName || `idx_${tableName}_${columnName}_unique`;
        return `CREATE UNIQUE INDEX ${idxName} ON ${tableName}(LOWER(${columnName}));`;
    }

    /**
     * Generate a composite index with case-insensitive columns
     * 대소문자 구분 없는 복합 인덱스 생성
     * 
     * @param tableName - Table name
     * @param columns - Array of column names
     * @param indexName - Optional custom index name
     * @param caseInsensitive - Whether to apply LOWER() to all columns
     * @returns SQL CREATE INDEX statement
     * 
     * @example
     * createCompositeIndex('users', ['first_name', 'last_name'], undefined, true)
     * // Returns: "CREATE INDEX idx_users_first_name_last_name ON users(LOWER(first_name), LOWER(last_name));"
     */
    export function createCompositeIndex(
        tableName: string,
        columns: string[],
        indexName?: string,
        caseInsensitive: boolean = false
    ): string {
        const idxName = indexName || `idx_${tableName}_${columns.join('_')}`;
        const columnList = caseInsensitive
            ? columns.map(col => `LOWER(${col})`).join(', ')
            : columns.join(', ');
        return `CREATE INDEX ${idxName} ON ${tableName}(${columnList});`;
    }

    /**
     * Generate a partial index with optional case-insensitivity
     * 부분 인덱스 생성 (선택적 대소문자 구분 없음)
     * 
     * @param tableName - Table name
     * @param columnName - Column name
     * @param whereClause - WHERE clause condition
     * @param indexName - Optional custom index name
     * @param caseInsensitive - Whether to apply LOWER()
     * @returns SQL CREATE INDEX statement with WHERE clause
     * 
     * @example
     * createPartialIndex('users', 'email', 'is_active = 1', undefined, true)
     * // Returns: "CREATE INDEX idx_users_email_partial ON users(LOWER(email)) WHERE is_active = 1;"
     */
    export function createPartialIndex(
        tableName: string,
        columnName: string,
        whereClause: string,
        indexName?: string,
        caseInsensitive: boolean = false
    ): string {
        const idxName = indexName || `idx_${tableName}_${columnName}_partial`;
        const column = caseInsensitive ? `LOWER(${columnName})` : columnName;
        return `CREATE INDEX ${idxName} ON ${tableName}(${column}) WHERE ${whereClause};`;
    }

    /**
     * Generate index from configuration object
     * 설정 객체로부터 인덱스 생성
     * 
     * @param config - Index configuration
     * @returns SQL CREATE INDEX statement
     * 
     * @example
     * createIndexFromConfig({
     *   indexName: 'idx_users_email',
     *   tableName: 'users',
     *   columns: ['email'],
     *   unique: true,
     *   caseInsensitive: true
     * })
     */
    export function createIndexFromConfig(config: IndexConfig): string {
        const { indexName, tableName, columns, unique, caseInsensitive, partial } = config;
        
        const uniqueKeyword = unique ? 'UNIQUE ' : '';
        const columnList = caseInsensitive
            ? columns.map(col => `LOWER(${col})`).join(', ')
            : columns.join(', ');
        const whereClause = partial ? ` WHERE ${partial}` : '';
        
        return `CREATE ${uniqueKeyword}INDEX ${indexName} ON ${tableName}(${columnList})${whereClause};`;
    }

    /**
     * Generate a batch of index creation statements
     * 여러 인덱스 생성 구문을 일괄 생성
     * 
     * @param configs - Array of index configurations
     * @returns Array of SQL CREATE INDEX statements
     * 
     * @example
     * createBatchIndexes([
     *   { indexName: 'idx1', tableName: 'users', columns: ['email'], caseInsensitive: true },
     *   { indexName: 'idx2', tableName: 'users', columns: ['username'], caseInsensitive: true }
     * ])
     */
    export function createBatchIndexes(configs: IndexConfig[]): string[] {
        return configs.map(config => createIndexFromConfig(config));
    }

    /**
     * Generate corresponding query for a case-insensitive index
     * 대소문자 구분 없는 인덱스에 대응하는 쿼리 생성
     * 
     * @param tableName - Table name
     * @param columnName - Column name
     * @param value - Search value (will be wrapped in LOWER())
     * @returns SQL SELECT statement that uses the index
     * 
     * @example
     * generateCaseInsensitiveQuery('users', 'email', 'user@example.com')
     * // Returns: "SELECT * FROM users WHERE LOWER(email) = LOWER('user@example.com');"
     */
    export function generateCaseInsensitiveQuery(
        tableName: string,
        columnName: string,
        value: string
    ): string {
        return `SELECT * FROM users WHERE LOWER(${columnName}) = LOWER('${value}');`;
    }
}

// Example usage / 사용 예제
export const exampleUsage = {
    // Simple index
    simpleIndex: SQLiteIndexUtil.createSimpleIndex('users', 'created_at'),
    
    // Case-insensitive index
    caseInsensitiveIndex: SQLiteIndexUtil.createCaseInsensitiveIndex('users', 'email'),
    
    // Unique case-insensitive index
    uniqueIndex: SQLiteIndexUtil.createUniqueCaseInsensitiveIndex('users', 'username'),
    
    // Composite case-insensitive index
    compositeIndex: SQLiteIndexUtil.createCompositeIndex(
        'users',
        ['first_name', 'last_name'],
        undefined,
        true
    ),
    
    // Partial index
    partialIndex: SQLiteIndexUtil.createPartialIndex(
        'users',
        'email',
        'is_active = 1',
        undefined,
        true
    ),
    
    // Using configuration
    configBasedIndex: SQLiteIndexUtil.createIndexFromConfig({
        indexName: 'idx_users_email_search',
        tableName: 'users',
        columns: ['email', 'username'],
        unique: false,
        caseInsensitive: true,
        partial: 'deleted_at IS NULL'
    }),
    
    // Batch creation
    batchIndexes: SQLiteIndexUtil.createBatchIndexes([
        {
            indexName: 'idx_users_email_lower',
            tableName: 'users',
            columns: ['email'],
            unique: true,
            caseInsensitive: true
        },
        {
            indexName: 'idx_users_username_lower',
            tableName: 'users',
            columns: ['username'],
            caseInsensitive: true
        }
    ]),
    
    // Corresponding query
    query: SQLiteIndexUtil.generateCaseInsensitiveQuery('users', 'email', 'user@example.com')
};

/**
 * Complete example schema with indexes
 * 인덱스를 포함한 완전한 스키마 예제
 */
export const completeSchemaExample = `
-- Create table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    is_active INTEGER DEFAULT 1,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
${SQLiteIndexUtil.createUniqueCaseInsensitiveIndex('users', 'email')}
${SQLiteIndexUtil.createCaseInsensitiveIndex('users', 'username')}
${SQLiteIndexUtil.createCompositeIndex('users', ['first_name', 'last_name'], undefined, true)}
${SQLiteIndexUtil.createPartialIndex('users', 'email', 'is_active = 1 AND deleted_at IS NULL', undefined, true)}

-- Example queries that use the indexes
${SQLiteIndexUtil.generateCaseInsensitiveQuery('users', 'email', 'John.Doe@Example.Com')}
${SQLiteIndexUtil.generateCaseInsensitiveQuery('users', 'username', 'JohnDoe')}
`;

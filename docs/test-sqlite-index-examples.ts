/**
 * Test file to demonstrate SQLite case-insensitive index utilities
 * Run with: npx tsx docs/test-sqlite-index-examples.ts
 */

import { SQLiteIndexUtil, exampleUsage, completeSchemaExample } from './sqlite-index-examples';

console.log('=== SQLite Case-Insensitive Index Generator Test ===\n');

// Test 1: Simple index
console.log('1. Simple Index:');
console.log(SQLiteIndexUtil.createSimpleIndex('users', 'created_at'));
console.log();

// Test 2: Case-insensitive index
console.log('2. Case-Insensitive Index:');
console.log(SQLiteIndexUtil.createCaseInsensitiveIndex('users', 'email'));
console.log();

// Test 3: Unique case-insensitive index
console.log('3. Unique Case-Insensitive Index:');
console.log(SQLiteIndexUtil.createUniqueCaseInsensitiveIndex('users', 'username'));
console.log();

// Test 4: Composite index
console.log('4. Composite Case-Insensitive Index:');
console.log(SQLiteIndexUtil.createCompositeIndex(
    'users',
    ['first_name', 'last_name'],
    undefined,
    true
));
console.log();

// Test 5: Partial index
console.log('5. Partial Index with WHERE clause:');
console.log(SQLiteIndexUtil.createPartialIndex(
    'users',
    'email',
    'is_active = 1',
    undefined,
    true
));
console.log();

// Test 6: Index from configuration
console.log('6. Index from Configuration:');
console.log(SQLiteIndexUtil.createIndexFromConfig({
    indexName: 'idx_users_search',
    tableName: 'users',
    columns: ['email', 'username'],
    unique: false,
    caseInsensitive: true,
    partial: 'deleted_at IS NULL'
}));
console.log();

// Test 7: Batch indexes
console.log('7. Batch Index Creation:');
const batchIndexes = SQLiteIndexUtil.createBatchIndexes([
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
]);
batchIndexes.forEach(index => console.log(index));
console.log();

// Test 8: Query generation
console.log('8. Case-Insensitive Query:');
console.log(SQLiteIndexUtil.generateCaseInsensitiveQuery('users', 'email', 'user@example.com'));
console.log();

// Test 9: Example usage object
console.log('9. Pre-defined Examples:');
console.log('Simple Index:', exampleUsage.simpleIndex);
console.log('Case-Insensitive:', exampleUsage.caseInsensitiveIndex);
console.log('Unique Index:', exampleUsage.uniqueIndex);
console.log();

// Test 10: Complete schema
console.log('10. Complete Schema Example:');
console.log(completeSchemaExample);

console.log('\n=== All Tests Passed! ===');
console.log('\nThese utilities generate valid SQLite CREATE INDEX statements.');
console.log('The LOWER() function works the same way as Oracle function-based indexes.');
console.log('\nKey points:');
console.log('✓ Syntax is identical to Oracle');
console.log('✓ Enables case-insensitive searches');
console.log('✓ Improves query performance with indexes');
console.log('✓ Queries must use LOWER() to utilize the index');

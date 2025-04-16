#!/bin/bash

DB_PATH="./server/database/users.db"

echo "Clearing 'users' table from $DB_PATH..."

sqlite3 $DB_PATH <<EOF
DELETE FROM users;
DELETE FROM sqlite_sequence WHERE name='users';
EOF

echo "✅ Users cleared and sequence reset!"

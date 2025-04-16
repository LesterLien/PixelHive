#!/bin/bash

DB_PATH="./server/database/users.db"

echo "Clearing 'favorites' table from $DB_PATH..."

sqlite3 $DB_PATH <<EOF
DELETE FROM favorites;
DELETE FROM sqlite_sequence WHERE name='favorites';
EOF

echo "✅ Favorites cleared and sequence reset!"

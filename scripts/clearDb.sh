#!/bin/bash

echo "✅ Running full DB cleanup..."

bash ./scripts/clearUsers.sh
bash ./scripts/clearFavorites.sh

echo "✅ Database cleanup complete!"

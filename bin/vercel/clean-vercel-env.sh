# #!/bin/bash

# set -e

# # Ensure VERCEL_TOKEN is set
# if [[ -z "$VERCEL_TOKEN" ]]; then
#   echo "❌ VERCEL_TOKEN is not set."
#   exit 1
# fi

# echo "🔍 Fetching Vercel preview environment variables..."

# echo "🔍 Listing Vercel environment variables for preview..."
# vercel env ls preview --token="$VERCEL_TOKEN" > tmp_vercel_envs.txt

# echo "🧼 Extracting variable names..."
# # Extract variable names (skip header and separator lines)
# vars=$(awk 'NR>2 {print $1}' tmp_vercel_envs.txt)

# if [[ -z "$vars" ]]; then
#   echo "✅ No environment variables to remove."
#   rm tmp_vercel_envs.txt
#   exit 0
# fi

# for var in $vars; do
#   echo "❌ Removing $var from preview environment..."
#   vercel env rm "$var" preview --yes --token="$VERCEL_TOKEN"
# done

# rm tmp_vercel_envs.txt
# echo "✅ All preview environment variables removed successfully."
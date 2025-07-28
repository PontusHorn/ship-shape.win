#!/bin/sh

#
# Script to install Git hooks by creating symbolic links
#

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get the Git hooks directory for the repository
GIT_DIR="$(git rev-parse --git-dir)"
HOOKS_DIR="$GIT_DIR/hooks"

echo "Installing Git hooks..."

# Create the hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# If an existing pre-push hook exists, ask for confirmation to remove it
PRE_PUSH_HOOK="$HOOKS_DIR/pre-push"
if [ -f "$PRE_PUSH_HOOK" ] || [ -L "$PRE_PUSH_HOOK" ]; then
  echo "A pre-push hook already exists at $PRE_PUSH_HOOK."
  read -p "Do you want to remove it? (y/n): " confirm
  if [ "$confirm" = "y" ]; then
    echo "Removing existing pre-push hook..."
    rm "$PRE_PUSH_HOOK"
  else
    echo "pre-push hook will not be installed. Exiting."
    exit 0
  fi
fi

echo "Creating symbolic link for pre-push hook"
ln -s "$SCRIPT_DIR/pre-push" "$PRE_PUSH_HOOK"

# Make sure the hook is executable
chmod +x "$SCRIPT_DIR/pre-push"

echo "✅ Git hooks installed successfully!"
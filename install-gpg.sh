#! /usr/bin/env bash

set -e

# gpg 2.0 doesn't work with emacs easypg or whatever it is. gpg 2.1 works well
# with it, but homebrew doesn't want to make it easy because of backwards
# compatibility reasons.

# homebrew upgraded gnupg to use 2.1!

# Ensure we don't have an existing gpg in the way. Ignore errors because some
# packages might have it locked down to use them.
# brew uninstall gnupg2 gpg-agent dirmngr --force || true
# Actually we probably don't need to do this repair step anymore.
brew install gnupg || brew upgrade gnupg

echo "linking gpg settings..."
mkdir -p ~/.gnupg
# if [ ! -f ~/.gnupg/gpg-agent.conf ] || [ ! -f ~/.gnupg/gpg.conf  ]; then
#     echo "~/.gnupg config files are present but not symlinks, aborting..."
#     exit 1
# else
    ln -s -n -f $PWD/gpg-agent.conf ~/.gnupg/gpg-agent.conf
    ln -s -n -f $PWD/gpg.conf ~/.gnupg/gpg.conf
# fi
echo "fixing .gnupg perms..."

chmod 700 ~/.gnupg

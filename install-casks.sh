#!/usr/bin/env bash

set -e

# This fixes outdated tasks using the "undent" method. I've found Homebrew
# doesn't do much to preserve backwards compatibility with older packages (or
# more accurately: older Homebrew package definitions). I expect many
# workarounds such as this will pile up in this file and the install-packages.sh
# file. This particular workaround can be found (and adapted to work with this
# sed) from here:
# https://github.com/Homebrew/homebrew-cask/issues/49716#issuecomment-413515303
echo "Fixing outdated Homebrew package definitions..."
find "$(brew --prefix)/Caskroom/"*'/.metadata' -type f -name '*.rb' | \
    xargs grep 'EOS.undent' --files-with-matches | \
    xargs sed -i 's/EOS.undent/EOS/'

echo "Outdated Homebrew package definitions should be fixed."

brew cask upgrade

# NOTE: I omitted razer-synpase due to its intrusive nature. Install manually
# and then uninstall when keyboard config is complete.
# TODO: Find a better way to reinstall istat-menus (cannot be stopped once
# running, short of an "uninstall").
CASKS="
adobe-connect
alfred
arduino
chromium
diffmerge
discord
electric-sheep
font-source-code-pro
gimp
google-chrome
haskell-platform
hipchat
mumble
obs
silverlight
skype
slack
steam
stride
virtualbox
xbox360-controller-driver-unofficial
zoomus
"

echo "installing homebrew casks"
brew cask install $CASKS

echo "done installing casks"

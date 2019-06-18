#! /usr/bin/env bash

set -e

brew tap AdoptOpenJDK/openjdk

brew cask install adoptopenjdk8
brew cask install adoptopenjdk11

jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home

# https://github.com/gcuisinier/jenv/issues/212
# Heads up that you'll need to restart the terminal session after doing this.
# TODO: Warn at the end of the installation process that this must be done,
# since the built-in warning will likely be lost in a sea of output.
exec $SHELL -l -c 'jenv enable-plugin export'

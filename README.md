# CiviCRM Desktop Client

Just playing around with ElectronJS after seeing a presentation on it tonight.

A proof of concept desktop app which can talk to a remote CiviCRM install and fetch contact details, like an addressbook.

## Building

Get your Electron version:

    electron --version

Use Electron Packager:

    electron-packager . CiviCRM --out=../build/ --platform=all --arch=all --version=$ELECTRON_VERSION

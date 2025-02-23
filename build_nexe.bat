@echo off

mkdir dist

nexe --input index.js --output dist/Launcher.exe --build --verbose --assets "./**/*"
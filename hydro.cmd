@echo off
where /q node.exe >nul 2>&1
if ERRORLEVEL 1 (
    echo Cannot find Node.js installed
    echo Make sure you have installed Node.js before using Hydro
) else (
    node "%~dp0\.\Compiled\Main.js" %1
    node "%~dp0\.\CheckVersion.js"
)
@echo off
setlocal
set "NODE_EXE=%~dp0..\.tools\node-v24.18.1-win-x64\node.exe"
if not exist "%NODE_EXE%" (
  echo Portable Node.js 24.18.1 is not installed under .tools. 1>&2
  exit /b 1
)
"%NODE_EXE%" %*


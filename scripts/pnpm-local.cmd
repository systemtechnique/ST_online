@echo off
setlocal
set "NODE_ROOT=%~dp0..\.tools\node-v24.18.1-win-x64"
set "PNPM_CMD=%~dp0..\.tools\pnpm\pnpm.cmd"
if not exist "%NODE_ROOT%\node.exe" (
  echo Portable Node.js 24.18.1 is not installed under .tools. 1>&2
  exit /b 1
)
if not exist "%PNPM_CMD%" (
  echo Portable pnpm 11.21.0 is not installed under .tools. 1>&2
  exit /b 1
)
set "PATH=%NODE_ROOT%;%~dp0..\.tools\pnpm;%PATH%"
call "%PNPM_CMD%" %*


@echo off
set host=192.168.2.48
set port=8888
for %%i in (-h --help) do if "%1"=="%%i" (echo Install/Update superpolo web bundle to sling.
echo USAGE: 
echo      install.bat [port] [host]
goto quit
)

set tmpvar=%2%
if defined tmpvar set host=%tmpvar%
set tmpvar=%1%
if defined tmpvar set port=%tmpvar%
call mvn -X -P autoInstallBundle clean install -Dsling.url=http://%host%:%port%/system/console

:quit

pause
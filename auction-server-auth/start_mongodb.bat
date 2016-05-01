@echo off
SET data_directory="mongodb_data"
SET working_directory=%~dp0

IF NOT EXIST "%working_directory%/%data_directory%" GOTO CREATEDIR
GOTO RUNMONGO

:CREATEDIR
echo "Creating mongodb data directory in path : %working_directory%/%data_directory%"
mkdir "%working_directory%/%data_directory%"
GOTO RUNMONGO

:RUNMONGO
E:\mongodb\bin\mongod.exe --dbpath "%working_directory%/%data_directory%" --rest
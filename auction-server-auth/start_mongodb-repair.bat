@echo off
SET data_directory="mongodb_data"
SET working_directory=%~dp0

:RUNMONGO
mongod.exe --repair --dbpath "%working_directory%/%data_directory%"
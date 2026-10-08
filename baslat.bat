@echo off
cd /d "%~dp0"
start "Blog API" cmd /k dotnet run --project Blog.API
start "Blog Frontend" cmd /k "cd blog-frontend && npm start"
timeout /t 5 /nobreak >nul
start http://localhost:3000

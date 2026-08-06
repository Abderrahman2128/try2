@echo off
:: ============================================
::  NodeTopicss - one-command Windows installer
:: ============================================
title NodeTopicss Installer

echo.
echo   NodeTopicss - Minimalist Node.js Boilerplate
echo   --------------------------------------------
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Get it at https://git-scm.com
    pause & exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Get it at https://nodejs.org
    pause & exit /b 1
)

echo [1/4] Cloning repository...
git clone https://github.com/breezesolicitormap/NodeTopicss.git || (pause & exit /b 1)
cd NodeTopicss

echo [2/4] Installing dependencies...
call npm install || (pause & exit /b 1)

echo [3/4] Creating .env from template...
if not exist .env copy .env.example .env >nul

echo [4/4] Starting dev server...
echo.
echo   Server: http://localhost:8000/api/health
echo.
call npm run dev


@echo off
setlocal
title Setup - Controle de Estoque

echo ==========================================
echo     Instalando projeto de estoque
echo ==========================================
echo.

rem === Verificar Node.js ===

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado.
    echo Instale em https://nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERRO] NPM nao encontrado.
    pause
    exit /b 1
)

echo Node encontrado:
node -v
npm -v
echo.

rem === Criar package.json ===

if not exist package.json (
    echo [1/5] Criando package.json...
    call npm init -y
    if errorlevel 1 (
        echo [ERRO] Falha ao criar package.json.
        pause
        exit /b 1
    )
) else (
    echo [1/5] package.json ja existe.
)

rem === Instalar dependencias ===

echo.
echo [2/5] Instalando bibliotecas principais...

call npm install express mysql2 jsonwebtoken dotenv cors zod bcryptjs

if errorlevel 1 (
    echo [ERRO] Falha ao instalar bibliotecas.
    pause
    exit /b 1
)

rem === Instalar nodemon ===

echo.
echo [3/5] Instalando nodemon...

call npm install --save-dev nodemon

if errorlevel 1 (
    echo [ERRO] Falha ao instalar nodemon.
    pause
    exit /b 1
)

rem === Configurar scripts ===

echo.
echo Configurando scripts do package.json...

call npm pkg set "scripts.start=node server.js"
if errorlevel 1 (
    echo [ERRO] Falha ao configurar script start.
    pause
    exit /b 1
)

call npm pkg set "scripts.dev=nodemon server.js"
if errorlevel 1 (
    echo [ERRO] Falha ao configurar script dev.
    pause
    exit /b 1
)

rem === Criar estrutura de pastas ===

echo.
echo [4/5] Criando estrutura de pastas...

if not exist src mkdir src
if not exist src\config mkdir src\config
if not exist src\controllers mkdir src\controllers
if not exist src\services mkdir src\services
if not exist src\repositories mkdir src\repositories
if not exist src\routes mkdir src\routes
if not exist src\middlewares mkdir src\middlewares
if not exist src\validators mkdir src\validators

rem === Configurar arquivo .env ===

echo.
echo [5/5] Configurando ambiente...

if not exist .env (
    type nul > .env
)

findstr /b /c:"PORT=" .env >nul
if errorlevel 1 (
    echo PORT=3000>> .env
)

findstr /b /c:"JWT_SECRET=" .env >nul
if errorlevel 1 (

    node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))" > "%TEMP%\estoque_secret.tmp"

    if errorlevel 1 (
        echo [ERRO] Falha ao gerar JWT_SECRET.
        pause
        exit /b 1
    )

    set /p SECRET=<"%TEMP%\estoque_secret.tmp"
    del "%TEMP%\estoque_secret.tmp"

    if not defined SECRET (
        echo [ERRO] JWT_SECRET nao foi gerado.
        pause
        exit /b 1
    )

    echo JWT_SECRET=%SECRET%>> .env
)

rem === Configurar .gitignore ===

if not exist .gitignore (
    type nul > .gitignore
)

findstr /l /x /c:"node_modules/" .gitignore >nul
if errorlevel 1 echo node_modules/>> .gitignore

findstr /l /x /c:".env" .gitignore >nul
if errorlevel 1 echo .env>> .gitignore

findstr /l /x /c:".env.*" .gitignore >nul
if errorlevel 1 echo .env.*>> .gitignore

findstr /l /x /c:"!.env.example" .gitignore >nul
if errorlevel 1 echo !.env.example>> .gitignore

findstr /l /x /c:"*.log" .gitignore >nul
if errorlevel 1 echo *.log>> .gitignore

echo.
echo ==========================================
echo       INSTALACAO CONCLUIDA!
echo ==========================================
echo.
echo Para iniciar o servidor:
echo npm run dev
echo.
echo Para iniciar em producao:
echo npm start
echo.
echo ==========================================

pause
endlocal
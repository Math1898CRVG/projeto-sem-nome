@echo off
title Setup - Super CRUD de Estoque

rem === Rede do Senac: ignora erro de certificado SSL (so nesta janela) ===
set npm_config_strict_ssl=false
set NODE_TLS_REJECT_UNAUTHORIZED=0

echo ==========================================
echo   Instalando projeto de estoque
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado.
    echo Baixe e instale em https://nodejs.org e rode este arquivo de novo.
    pause
    exit /b 1
)

echo Node encontrado:
node -v
echo.

if not exist package.json (
    echo [1/5] Criando package.json...
    call npm init -y
) else (
    echo [1/5] package.json ja existe, pulando.
)

echo.
echo [2/5] Instalando bibliotecas principais...
call npm install express better-sqlite3 jsonwebtoken dotenv cors zod --strict-ssl=false
if errorlevel 1 (
    echo [ERRO] Falha ao instalar as bibliotecas principais.
    pause
    exit /b 1
)

echo.
echo [3/5] Instalando bcrypt...
call npm install bcrypt --strict-ssl=false
if errorlevel 1 (
    echo bcrypt falhou, instalando bcryptjs no lugar...
    call npm install bcryptjs --strict-ssl=false
)

echo.
echo [4/5] Instalando nodemon (desenvolvimento)...
call npm install --save-dev nodemon --strict-ssl=false
call npm pkg set scripts.start="node server.js"
call npm pkg set scripts.dev="nodemon server.js"

echo.
echo [5/5] Criando estrutura de pastas e arquivos...
if not exist src mkdir src
if not exist src\routes mkdir src\routes
if not exist src\middlewares mkdir src\middlewares
if not exist public mkdir public

if not exist server.js (
    echo // Ponto de entrada do servidor> server.js
)

for /f %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set SECRET=%%i

if not exist .env (
    echo PORT=3000> .env
    echo JWT_SECRET=%SECRET%>> .env
)

if not exist .gitignore (
    echo node_modules> .gitignore
    echo .env>> .gitignore
    echo *.db>> .gitignore
)

echo.
echo ==========================================
echo   Pronto! Para rodar o servidor:
echo   npm run dev
echo ==========================================
pause

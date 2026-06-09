@echo off
chcp 65001 > nul
echo =======================================================
echo Запуск AI-Оценщика Ювелирных Изделий (СКС Ломбард)
echo =======================================================

echo [1] Запуск FastAPI (Backend)...
start "FastAPI Backend" cmd /k "pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2] Запуск Next.js (Frontend)...
start "Next.js Frontend" cmd /k "npm install && npm run dev"

echo.
echo Все процессы запущены в отдельных окнах!
echo Frontend доступен по адресу: http://localhost:3000
echo Backend API доступен по адресу: http://localhost:8000
echo Для остановки закройте открывшиеся окна терминалов.
pause

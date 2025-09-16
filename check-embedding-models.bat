@echo off
echo ========================================
echo  Checking Available Embedding Models
echo ========================================

echo Listing all available Ollama models...
ollama list

echo.
echo Looking for embedding models...
ollama list | findstr /i "embed"

echo.
echo ========================================
echo  Check Complete
echo ========================================
echo If no embedding models found, run:
echo ollama pull nomic-embed-text
echo or
echo ollama pull mxbai-embed-large
pause

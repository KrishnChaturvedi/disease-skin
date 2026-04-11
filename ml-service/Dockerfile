FROM python:3.10
WORKDIR /app
COPY requirements.txt .
# Adding the timeout and fixing the hash issue by clearing cache
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "ml_server:app", "--host", "0.0.0.0", "--port", "8000"]
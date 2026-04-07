import time

print("ML Service is up and running!")
while True:
    # Keeps the container alive without eating CPU
    time.sleep(60)
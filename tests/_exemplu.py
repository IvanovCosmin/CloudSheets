import requests

print("test")

r = requests.get("https://localhost:8000/")

print("test")
print(r.status_code)

print(r.text)
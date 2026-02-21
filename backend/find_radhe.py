import urllib.request
import json

data = json.loads(urllib.request.urlopen('http://localhost:9999/shop/users').read())
for u in data:
    name = u.get('name', '') or ''
    shop = u.get('shopName', '') or ''
    if 'radhe' in name.lower() or 'radhe' in shop.lower():
        print(f"ID: {u['id']}, Name: {name}, Shop: {shop}, Phone: {u.get('phoneNumber', '')}")
        break
else:
    print("Radhe Radhe not found in database")

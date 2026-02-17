
import json

try:
    with open('users_final.json', 'r', encoding='utf-16') as f:
        users = json.load(f)
        
    found = False
    for user in users:
        # Check shopName (case-insensitive)
        if user.get('shopName') and 'kahao piyo' in user.get('shopName').lower():
            print(f"Found Code: {user.get('shopName')}")
            print(f"Phone Number: {user.get('phoneNumber')}")
            found = True
            
    if not found:
        print("Vendor 'kahao piyo' not found in users_list.json")
        
except Exception as e:
    print(f"Error: {e}")


import json

try:
    with open('users_final.json', 'r', encoding='utf-16') as f:
        users = json.load(f)
        
    output = "## All Users Debug\n| ID | Name | Role | Phone |\n| :--- | :--- | :--- | :--- |\n"
    
    for user in users:
        uid = user.get('id', 'N/A')
        name = user.get('name', 'N/A')
        shop = user.get('shopName', 'N/A')
        role = user.get('role', 'N/A')
        phone = user.get('phoneNumber', 'N/A')
        
        display_name = shop if role == 'VENDOR' else name
        output += f"| {uid} | {display_name} | {role} | {phone} |\n"
            
    print(output)
    with open('all_users_dump.txt', 'w', encoding='utf-8') as f:
        f.write(output)
            
except Exception as e:
    print(f"Error: {e}")

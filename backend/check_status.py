
import json

try:
    with open('users_status.json', 'r', encoding='utf-16') as f:
        users = json.load(f)
        
    print("Store Status Check:")
    print("-" * 30)
    
    targets = ['buub', 'kahao piyo']
    
    for user in users:
        shop = user.get('shopName', '').lower()
        if any(t in shop for t in targets):
            status = "OPEN" if user.get('isOpen') else "CLOSED"
            output_line = f"ID: {user.get('id')} | Store: {user.get('shopName')} | Block: {user.get('block')} | Status: {status} | isOpen: {user.get('isOpen')}\n"
            print(output_line.strip())
            with open('final_status.txt', 'a', encoding='utf-8') as outfile:
                outfile.write(output_line)
            
except Exception as e:
    print(f"Error: {e}")

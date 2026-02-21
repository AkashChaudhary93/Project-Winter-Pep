
import json
import os

target_name = "Yash"
found = False

for filename in os.listdir('.'):
    if filename.endswith('.json') or filename.endswith('.txt'):
        try:
            # Try utf-8 first
            text = ""
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    text = f.read()
            except UnicodeDecodeError:
                try:
                    with open(filename, 'r', encoding='utf-16') as f:
                        text = f.read()
                except Exception:
                    continue

            if target_name.lower() in text.lower():
                print(f"Found '{target_name}' in {filename}")
                # Try to parse json if it is one
                if filename.endswith('.json'):
                    try:
                        data = json.loads(text)
                        if isinstance(data, list):
                            for item in data:
                                if target_name.lower() in str(item.get('name', '')).lower():
                                    print(f"  Details: {item}")
                                    found = True
                        elif isinstance(data, dict):
                            if target_name.lower() in str(data.get('name', '')).lower():
                                print(f"  Details: {data}")
                                found = True
                    except:
                        pass
                else:
                    # Text file, print matching lines
                    for line in text.splitlines():
                        if target_name.lower() in line.lower():
                            print(f"  Line: {line.strip()}")
                            found = True
        except Exception as e:
            print(f"Error reading {filename}: {e}")

if not found:
    print(f"'{target_name}' not found in any json/txt files in current directory.")

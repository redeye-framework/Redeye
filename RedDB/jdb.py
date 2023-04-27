from RedDB import db

def servers_info(db_name, args):
    servers = []
    raw_servers = db.get_servers(db_name)

    for server in raw_servers:
        users = []
        for user in db.get_users_by_server_id(db_name,server[0]):
            users.append({
                "user_name": user[2],
                "password": user[3],
                "permissions": user[4]
            })
        data = {
            "id": server[0],
            "ip": server[1],
            "name": server[2],
            "vendor": server[3],
            "is_accessible": True if server[4] else False,
            "attain": server[5],
            "is_relevant": True if server[6] else False,
            "section_id": server[7],
            "related_users": users
        }
        is_match = filter(args, data)
        if is_match:
            servers.append(data)

    return servers


def exploits_info(db_name, args):
    exploits = []
    raw_exploits = db.get_all_exploits(db_name)

    for exploit in raw_exploits:
        data = {
            "name": exploit[1],
            "data": exploit[2],
            "related_file": exploit[3]
        }
        is_match = filter(args, data)
        if is_match:
            exploits.append(data)

    return exploits


def files_info(db_name, args):
    files = []
    raw_files = db.get_all_files(db_name)

    for file in raw_files:
        data = {
            "name": file[1],
            "path": file[2],
            "description": file[3],
            "related_server_id": file[5]
        }

        is_match = filter(args, data)
        if is_match:
            files.append(data)

    return files


def users_info(db_name, args):
    users = []
    raw_users = db.get_all_users(db_name)

    for user in raw_users:
        data = {
            "type": db.get_user_type_id(db_name, user[1])[0][0],
            "username": user[2],
            "password": user[3],
            "permissions": user[4],
            "attain": user[5],
            "connected_to": user[7] if user[7] else db.get_server_by_id(db_name,user[8])[0][1]
        }
        is_match = filter(args, data)
        if is_match:
            users.append(data)

    return users


def filter(args, data: dict):
    if len(args) == 0:
        return True
    
    for key in data.keys():

        if args.get(key) and args.get(key).endswith("*"):
            if str(data[key]).startswith(args.get(key).replace("*","")):
                return True
            
        if args.get(key) and args.get(key).startswith("*"):
            if str(data[key]).endswith(args.get(key).replace("*","")):
                return True

        if args.get(key):
            if str(data[key]) == str(args.get(key)):
                return True
    
    return False
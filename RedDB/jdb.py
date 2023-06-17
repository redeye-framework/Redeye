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


def logs_info(db_name, args):
    logs = []
    raw_logs = db.get_all_log(db_name)

    for log in raw_logs:
        details = None
        if log[1]:
            user_details = db.get_user_details(db_name, log[1])[0]
            details = {
                "user_name": user_details[2],
                "password": user_details[3],
                "permissions": user_details[4]
            }

        elif log[2]:
            task_details = db.get_task(db_name, log[2])[0]
            details = {
                "task_name": task_details[1],
                "is_task_done": True if int(task_details[2]) else False,
                "executers": task_details[3],
                "data": task_details[4]
            }

        elif log[3]:
            server_details = db.get_server_by_id(db_name, log[3])[0]
            details = {
                "id": server_details[0],
                "ip": server_details[1],
                "name": server_details[2],
                "vendor": server_details[3],
                "is_accessible": True if server_details[4] else False,
                "attain": server_details[5],
                "is_relevant": True if server_details[6] else False,
                "section_id": server_details[7]
            }

        data = {
            "executer": log[11],
            "data": log[10],
            "date": log[8] + " " + log[9],
            "event": log[7],
            "details": details
        }

        is_match = filter(args, data)
        if is_match:
            logs.append(data)

    return logs


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
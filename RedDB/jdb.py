from RedDB import db

def servers_info(db_name):
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
        servers.append({
            "id": server[0],
            "ip": server[1],
            "name": server[2],
            "vendor": server[3],
            "is_accessible": True if server[4] else False,
            "attain": server[5],
            "is_relevant": True if server[6] else False,
            "section_id": server[7],
            "related_users": users
        })

    return servers


def exploits_info(db_name):
    exploits = []
    raw_exploits = db.get_all_exploits(db_name)

    for exploit in raw_exploits:
        exploits.append({
            "name": exploit[1],
            "data": exploit[2],
            "related_file": exploit[3]
        })

    return exploits
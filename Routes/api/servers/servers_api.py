from RedDB import db
from Routes.api.config import filter
from Routes.api import constants

SECTION_NAME = "Added using API"

def servers_info(db_name: str, args: dict) -> list:
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


def add_new_server(db_name: str, args: dict, executer: str) -> dict:

    section_id = db.get_section_id_by_section_name(db_name, SECTION_NAME)

    if section_id:
        section_id = section_id[0][0]
    else:
        section_id = db.create_new_server_section(db_name, SECTION_NAME)

    details = dict(
        ip = args.get("ip"),
        name = args.get("name"),
        vendor = args.get("vendor"),
        is_access = args.get("is_accessible", False),
        attain = args.get("attain", "Attain"),
        section_id = section_id,
        color_id = 1
    )

    print(details)
    if len(details.get("ip")) < 1 or len(details.get("name")) < 1:
        return constants.error_msg("Server name or IP is missing")

    db.create_new_server(db_name, executer, **details)
    return constants.success_msg("Server created successfully")



def help() -> dict:
    return constants.help_msg({
        "arguments for POST /api/servers": {
            "ip": "IP of the server (REQUIRED)",
            "name": "Name of the server (REQUIRED)",
            "vendor": "Vendor of the server",
            "is_access": "Do we have access to the server (Default: False)",
            "attain": "Additional info about the server (Default: Attain)"
        }, 
        "arguments for GET /api/servers": {
            "filters": "Filter by any of the returned parameters (wildcards are supported)"
        },
    })
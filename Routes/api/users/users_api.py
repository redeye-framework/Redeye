from RedDB import db
from Routes.api.config import filter
from Routes.api import constants

USER_TYPE = "API"

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


def add_new_user(db_name: str, args: dict, exec) -> dict:

    userTypeId = db.get_user_type(db_name, USER_TYPE)
            
    if not userTypeId:
        userTypeId = db.insert_new_user_type(db_name, USER_TYPE)
    else:
        userTypeId = userTypeId[0][0]


    details = dict(
        username = args.get("username"),
        password = args.get("password"),
        permissions = args.get("permissions"),
        type = userTypeId,
        server_id = None,
        found = args.get("found")
    )

    db.insert_new_user(db_name, exec=exec, **details)
    return constants.success_msg("User added successfully")


def help() -> dict:
    return constants.help_msg({
        "arguments for POST /api/users": {
            "username": "Found Username (REQUIRED)",
            "password": "Found password of the user (REQUIRED)",
            "permissions": "Level of permissions",
            "found": "Where does this user found on"
        }, 
        "arguments for GET /api/users": {
            "filters": "Filter by any of the returned parameters (wildcards are supported)"
        },
    })
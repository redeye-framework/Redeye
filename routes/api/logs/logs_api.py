from RedDB import db
from routes.api.config import filter

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
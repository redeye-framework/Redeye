from RedDB import db
from routes.api.config import filter

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
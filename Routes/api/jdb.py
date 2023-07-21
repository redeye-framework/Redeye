from RedDB import db


def get_hashed_token_details(hashed_token):
    return db.get_hashed_token_details(hashed_token)


def get_project_filename_by_id(project_id):
    return db.get_project_filename_by_id(project_id)

def get_username_by_id(user_id):
    return db.get_redeye_user_by_id(user_id)
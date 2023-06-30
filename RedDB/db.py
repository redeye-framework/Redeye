import sqlite3
from os.path import isfile, isdir
from os import makedirs
from sqlite3 import Error
from datetime import date, datetime
from functools import wraps
import re
import json
from html import escape, unescape

MANAGE_DB = r"RedDB/managementDB.db"
EXAMPLE_DB = r"RedDB/ExampleDB.db"
MANAGE_TABLES_SQL = r"RedDB/manaTables.sql"
MANAGE_INIT_SQL = r"RedDB/manaInit.sql"
PROJECT_DB = r""
PROJECT_PATH = r"RedDB/Projects/"
TABLES_SQL = r"RedDB/tables.sql"
INIT_SQL = r"RedDB/init.sql"
INIT_COLORS = r"RedDB/colors.init"
REGEX = re.compile('|'.join(map(re.escape, ["..","OR","SELECT","FROM","WHERE","LIKE"])))

"""
=======================================================
                Serialize Functions
=======================================================
"""
def serialize_input(*user_input):
    for data in user_input:
        blacklist = REGEX.findall(str(data))
        if blacklist:
            return False
    return True

def check_input(func):
    @wraps(func)
    def check(*args, **kwargs):
        if serialize_input(*args):
            """
            Blacklist not found !
            """
            args = list(args)
            
            for index, arg in enumerate(args):
                args[index] = escape(str(arg))

            return func(*args, **kwargs)
    return check

"""
=======================================================
                Users Functions
=======================================================
"""

@check_input
def insert_new_user(db, type, server_id, found, username, password, permissions, exec):
    """
    Add new user to data base.
    """
    if found == "NULL":
        query = '''INSERT INTO users(type,server_id,found_on,username,password,permissions)
                VALUES("{}","{}",NULL,"{}","{}","{}") '''.format(type, server_id, username, password, permissions)
    else:
        query = '''INSERT INTO users(type,server_id,found_on,username,password,permissions)
                VALUES("{}",NULL,"{}","{}","{}","{}") '''.format(type, found, username, password, permissions)

    result = get_db_with_actions(db, query)

    create_log(db, "User Created", "user_id", result, "New User Added", exec)
    return(result)

@check_input
def insert_new_other_user(db, type, value, username, password, permissions, exec):
    """
    Add new user from file, or user from unknown place (without device_id,server_id)
    """
    query = '''INSERT INTO users(type,other,username,password,permissions)
              VALUES("{}","{}","{}","{}","{}") '''.format(type, value, username, password, permissions)
    result = get_db_with_actions(db, query)
    create_log(db, "User Added from file", "user_id",
               result, "New User Added", exec)
    return(result)

@check_input
def insert_manual_user(db, type, found_on, username, password, permissions, exec):
    query = '''INSERT INTO users(type,found_on,username,password,permissions)
              VALUES("{}","{}","{}","{}","{}") '''.format(type, found_on, username, password, permissions)
    result = get_db_with_actions(db, query)
    create_log(db, "User Added from file", "user_id",
               result, "New User Added", exec)
    return(result)

@check_input
def edit_user_by_id(db, userId, column, value):
    query = 'UPDATE users SET "{}"="{}" WHERE id={}'.format(column, value,userId)
    return get_db_with_actions(db, query)

@check_input
def update_user(db, id, type, server_id, username, password, permissions, exec):
    """
    Update user by id of the user.
    """
    query = ''' UPDATE users
              SET type = "{}" ,
                  username = "{}" ,
                  password = "{}",
                  server_id = "{}",
                  permissions = "{}"
              WHERE id = "{}"'''.format(type, server_id, username, password, permissions, id)
    result = get_db_with_actions(db, query)
    create_log(db, "User Updated", "user_id", result, "Updated User", exec)
    return(result)

@check_input
def delete_user(db, user_id, exec):
    """
    Delete user by id of user.
    """
    #query = 'DELETE FROM users WHERE id="{}"'.format(user_id)
    result = change_relevant_to_zero(db, "users", user_id)
    create_log(db, "User Deleted", "user_id", user_id, "Deleted User", exec)
    return(result)

@check_input
def edit_user(db, exec, uid, name, passwd, perm, type, found_on, found_on_server, attain):
    """
    Update user by id.
    """
    first = 1
    query = 'UPDATE users SET '

    if name:
        query += f'username = "{name}"'
        first = 0
    if passwd:
        if not first:
            query += ', '
            first = 0
        query += f'password = "{passwd}"'
    if perm:
        if not first:
            query += ', '
            first = 0
        query += f'permissions = "{perm}"'
    if type:
        if not first:
            query += ', '
            first = 0
        query += f'type = "{type}"'
    if found_on:
        if not first:
            query += ', '
            first = 0
        if found_on == "Null":
            query += f'found_on = NULL'
        else:
            query += f'found_on = "{found_on}"'
    if found_on_server:
        if not first:
            query += ', '
            first = 0
        if found_on_server == "Null":
            query += f'server_id = NULL'
        else:
            query += f'server_id = "{found_on_server}"'
    if attain:
        if not first:
            query += ', '
            first = 0
        query += f'attain = "{attain}"'

    if first:
        return ""

    query += f" WHERE id = {uid};"
    result = get_db_with_actions(db, query)
    create_log(db, "User Updated", "user_id",
               uid, "Updated User", exec)
    return result

@check_input
def set_user_password(db, user_id, password, exec):
    """
    Change user password.
    """
    query = '''UPDATE users
              SET password = "{}" 
              WHERE id = "{}" '''.format(password, user_id)

    result = get_db_with_actions(db, query)
    create_log(db, "User password Added", "id", result, "Password added", exec)
    return(result)


@check_input
def get_all_users(db):
    query = r'SELECT * FROM users WHERE relevant=1'
    return db_get(db, query)

@check_input
def get_all_cracked_users(db):
    query = r'SELECT * FROM users WHERE (password is NOT "Unknown") and relevant=1'
    return db_get(db, query)

@check_input
def get_users(db):
    query = r'SELECT * FROM users WHERE relevant=1'
    return db_get(db, query)

@check_input
def get_users_by_server_id(db, id):
    query = r'SELECT * FROM users WHERE server_id="{}" and relevant=1'.format(
        id)
    return db_get(db, query)

@check_input
def get_user_details(db, id):
    query = r'SELECT * FROM users WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_user_with_password(db, password):
    query = r'SELECT * FROM users WHERE password="{}" and relevant=1'.format(
        password)
    return db_get(db, query)

@check_input
def get_server_id_by_user_id(db, user_id):
    query = r'SELECT server_id FROM users WHERE id="{}"'.format(user_id)
    return db_get(db, query)


"""
=======================================================
                UserTypes Functions
=======================================================
"""

@check_input
def insert_new_user_type(db, typeName):
    """
    Add new UserType.
    """
    query = ''' INSERT INTO userTypes(typeName)
              VALUES("{}") '''.format(typeName)
    result = get_db_with_actions(db, query)
    return(result)

@check_input
def get_all_users_types(db):
    query = r'SELECT typeName FROM userTypes'
    return db_get(db, query)

@check_input
def get_user_type(db, typeName):
    query = r'SELECT id FROM userTypes WHERE typeName="{}"'.format(typeName)
    return db_get(db, query)

@check_input
def get_user_type_id(db, typeId):
    query = r'SELECT typeName FROM userTypes WHERE id="{}"'.format(typeId)
    return db_get(db, query)

"""
=======================================================
                Tasks Functions
=======================================================
"""

@check_input
def insert_new_task(db, task_name, is_task_done, executers, data, is_private, exec):
    """
    Add new task to data base.
    """
    query = ''' INSERT INTO tasks(task_name,is_task_done,executers,data,is_private)
              VALUES("{}","{}","{}","{}","{}") '''.format(task_name, is_task_done, executers, data, is_private)
    result = get_db_with_actions(db, query)
    create_log(db, "Task Created", "task_id", result, "New Task Added", exec)
    return(result)

@check_input
def unrelevant_task(db, id, exec):
    query = ''' UPDATE tasks
            SET relevant = 0
            WHERE id = "{}"'''.format(id)
    result = get_db_with_actions(db, query)
    create_log(db, "Task Unrelevant", "task_id", id, "Task Unrelevant", exec)
    return(result)

@check_input
def delete_task(db, id, exec):
    if(get_task_done(db, id)[0][0]):
        done = 0
    else:
        done = 1

    query = ''' UPDATE tasks
            SET is_task_done = "{}"
            WHERE id = "{}"'''.format(done, id)
    result = get_db_with_actions(db, query)
    # No log needed about it
    #create_log(db, "Task Complete", "task_id", id, "Task Completed",exec)
    return(result)

@check_input
def change_task_privacy(db, id):
    query = '''UPDATE tasks
              SET is_private = 0 
              WHERE id = "{}" '''.format(id)

    result = get_db_with_actions(db, query)
    return(result)

@check_input
def is_task_private(db, id):
    query = r'SELECT is_private FROM tasks WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_task_done(db, task_id):
    query = r'SELECT is_task_done FROM tasks WHERE id="{}"'.format(task_id)
    return db_get(db, query)

@check_input
def get_task(db, task_id):
    query = r'SELECT * FROM tasks WHERE id="{}"'.format(task_id)
    return db_get(db, query)

@check_input
def get_all_tasks(db):
    query = r'SELECT * FROM tasks WHERE relevant=1 and is_private=0 order by is_task_done = "1";'
    return db_get(db, query)

@check_input
def get_all_my_tasks(db, exec):
    query = r'SELECT * FROM tasks WHERE relevant=1 and executers="{}"'.format(
        exec)
    return db_get(db, query)

@check_input
def get_task_name_by_id(db, id):
    query = r'SELECT task_name FROM tasks WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def add_note_for_task(db, attain, task_id):
    query = 'UPDATE tasks SET notes="{}" WHERE id={}'.format(attain, task_id)
    return get_db_with_actions(db, query)

@check_input
def edit_exec_for_task(db, exec, task_id):
    query = 'UPDATE tasks SET executers="{}" WHERE id={}'.format(exec, task_id)
    return get_db_with_actions(db, query)

@check_input
def edit_name_for_task(db, name, task_id):
    query = 'UPDATE tasks SET task_name="{}" WHERE id={}'.format(name, task_id)
    return get_db_with_actions(db, query)

@check_input
def edit_data_for_task(db, data, task_id):
    query = 'UPDATE tasks SET data="{}" WHERE id={}'.format(data, task_id)
    return get_db_with_actions(db, query)

"""
=======================================================
                vulns Functions
=======================================================
"""

@check_input
def insert_new_vuln(db, name, data, fix, server_id, exec):
    """
    Add new task to data base.
    """

    query = ''' INSERT INTO vulns(name,data,fix,server_id)
              VALUES("{}","{}","{}","{}") '''.format(name, data, fix, server_id)
    result = get_db_with_actions(db, query)
    create_log(db, "vuln Created", "vuln_id", result,
               "New Vulnerability Added", exec)
    return(result)

@check_input
def update_vuln(db, name, data, fix, server_id, id, exec):
    """
    Update vulns by id of the vulns.
    """
    query = ''' UPDATE vulns
              SET name = "{}" ,
                  data = "{}" ,
                  fix = "{}",
                  server_id = "{}"
              WHERE id = "{}"'''.format(name, data, fix, server_id, id)
    result = get_db_with_actions(db, query)
    create_log(db, "vuln Updated", "vuln_id", result,
               "Updated Vulnerability", exec)
    return(result)

@check_input
def delete_vuln(db, id, exec):
    """
    Delete vuln by id of vuln.
    """
    #query = 'DELETE FROM vulns WHERE id="{}"'.format(id)
    result = change_relevant_to_zero(db, "vulns", id)
    create_log(db, "vuln Deleted", "vuln_id", id,
               "Deleted Vulnerability", exec)
    return(result)

@check_input
def get_vulns_by_server_id(db, id):
    query = r'SELECT * FROM vulns WHERE server_id="{}" and relevant=1'.format(
        id)
    return db_get(db, query)

@check_input
def get_vulns(db, vull_id):
    query = r'SELECT * FROM vulns WHERE id="{}"'.format(vull_id)
    return db_get(db, query)

@check_input
def get_all_vulns(db):
    query = r'SELECT * FROM vulns WHERE relevant=1'
    return db_get(db, query)

@check_input
def edit_vuln_by_id(db, vulnId, column, value):
    query = 'UPDATE vulns SET "{}"="{}" WHERE id={}'.format(column, value, vulnId)
    return get_db_with_actions(db, query)

"""
=======================================================
                Devices Functions
=======================================================
"""
@check_input
def insert_new_device(db, parent_id, ip, type, description, attain, exec):
    """
    Add new net device to data base.
    """

    query = ''' INSERT INTO netdevices(parent_id,ip,type,description,attain)
              VALUES("{}","{}","{}","{}","{}") '''.format(parent_id, ip, type, description, attain)
    result = get_db_with_actions(db, query)
    create_log(db, "Netdevice Created", "device_id",
               result, "New Device Added", exec)
    return(result)

@check_input
def update_device(db, id, parent_id, ip, type, description, attain, exec):
    """
    Update netdevice by id of the net device.
    """
    query = ''' UPDATE netdevices
              SET type = "{}" ,
                  description = "{}",
                  ip = "{}",
                  parent_id = "{}",
                  attain = "{}"
              WHERE id = "{}"'''.format(type, description, ip, parent_id, attain, id)
    result = get_db_with_actions(db, query)
    create_log(db, "NetDevice Updated", "device_id",
               result, "NetDevice was updated", exec)
    return result

@check_input
def delete_device(db, device_id, exec):
    """
    Delete user by id of net device.
    """
    #query = 'DELETE FROM netdevices WHERE id="{}"'.format(device_id)
    result = change_relevant_to_zero(db, "netdevices", device_id)
    create_log(db, "Netdevice Deleted", "device_id",
               id, "Deleted Device", exec)
    return result

@check_input
def get_netdevices(db, ip):
    query = r'SELECT * FROM netdevices WHERE ip="{}" and relevant=1'.format(ip)
    return db_get(db, query)

@check_input
def get_all_netdevices(db):
    query = r'SELECT * FROM netdevices WHERE relevant=1'
    return db_get(db, query)

@check_input
def get_netdevices_by_id(db, id):
    query = r'SELECT * FROM netdevices WHERE id="{}"'.format(id)
    return db_get(db, query)

"""
=======================================================
                Servers Functions
=======================================================
"""

@check_input
def create_new_server(db, exec, ip, name, vendor, is_access, attain, section_id, color_id):
    """
    Add new server to data base.
    """
    query = ''' INSERT INTO servers(ip, name, vendor, is_access, attain, section_id, color_id)
                  VALUES("{}","{}","{}","{}","{}","{}", "{}") '''.format(ip, name, vendor, is_access, attain, section_id, color_id)

    result = get_db_with_actions(db, query)
    create_log(db, "Server Created", "server_id", result, "New Server Added", exec)
    return(result)

@check_input
def create_new_single_server(db, name, ip, section_id, colorId, exec):
    """
    Add new server to data base.
    """
    query = ''' INSERT INTO servers(ip, name, section_id, color_id)
                  VALUES("%s","%s","%s","%s") ''' % (ip, name, section_id, colorId)

    result = get_db_with_actions(db, query)
    create_log(db, "Server Created", "server_id", result, "New Server Added", exec)
    return(result)

@check_input
def update_server_details(db, exec, id, ip=False, name=False, is_access=False, attain=False, section_id=False):
    """
    Update server by id of the server.
    """
    first = 1
    query = 'UPDATE servers SET '

    if ip:
        query += f'ip = "{ip}"'
        first = 0
    if name:
        if not first:
            query += ', '
            first = 0
        query += f'name = "{name}"'
    if is_access or str(is_access) == '0':
        if not first:
            query += ', '
            first = 0
        query += f'is_access = {is_access}'
    if attain:
        if not first:
            query += ', '
            first = 0
        query += f'attain = "{attain}"'
    if section_id:
        if not first:
            query += ', '
            first = 0
        query += f'section_id = "{section_id}"'

    if first:
        return ""

    query += f" WHERE id = {id};"

    result = get_db_with_actions(db, query)
    create_log(db, "Server Updated", "server_id",
               id, "Updated Server", exec)
    return result

@check_input
def edit_server_by_id(db,serverId,column,value):
    query = 'UPDATE servers SET "{}"="{}" WHERE id={}'.format(column, value,serverId)
    return get_db_with_actions(db, query)

@check_input
def delete_server_by_id(db, server_id, exec):
    """
    Delete server by id of server.
    """
    #query = 'DELETE FROM servers WHERE id="{}"'.format(server_id)
    result = change_relevant_to_zero(db, "servers", server_id)
    create_log(db, "Server Deleted", "server_id",
               server_id, "Deleted Server", exec)
    return result

@check_input
def create_new_server_section(db,section_name):
    """
    Add new section to data base.
    """
    query = ''' INSERT INTO sections(name)
                  VALUES("{}") '''.format(section_name)

    result = get_db_with_actions(db, query)
    return (result)


@check_input
def delete_section_by_id(db, section_id):
    query = 'DELETE FROM sections WHERE id="{}"'.format(section_id)
    return get_db_with_actions(db, query)


@check_input
def get_vendor_by_server_id(db, id):
    query = r'SELECT vendor FROM servers WHERE id="{}"'.format(id)
    return db_get(db, query)

def get_tags_by_server_id(db, id):
    query = r'SELECT * FROM tags WHERE server_id="{}"'.format(id)
    tags = db_get(db, query)
    ordered_tags = []
    for tag in tags:
        ordered_tags.append({
            "id": tag[0],
            "name": tag[1],
            "color": tag[2],
            "server_id": tag[3]
        })
    return ordered_tags

@check_input
def get_attain_by_server_id(db, id):
    query = r'SELECT attain FROM servers WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_sections(db):
    query = r'SELECT * FROM sections'
    return db_get(db, query)

@check_input
def get_section_id_by_server_id(db, server_id):
    query = r'SELECT section_id FROM servers WHERE id="{}"'.format(server_id)
    return db_get(db, query)[0][0]

@check_input
def get_section_name_by_section_id(db, section_id):
    query = r'SELECT name FROM sections WHERE id="{}"'.format(section_id)
    return db_get(db, query)[0][0]

@check_input
def get_section_id_by_section_name(db, section_name):
    query = r'SELECT id FROM sections WHERE name="{}"'.format(section_name)
    return db_get(db, query)

@check_input
def get_servers(db):
    query = r'SELECT * FROM servers WHERE relevant=1'
    return db_get(db, query)

@check_input
def get_no_access_servers(db):
    query = r'SELECT * FROM servers WHERE is_access=0 and relevant=1'
    return db_get(db, query)

@check_input
def check_if_server_exist(db, ip):
    query = r'SELECT * FROM servers WHERE ip="{}" AND relevant=1'.format(ip)
    return db_get(db, query)

@check_input
def get_server_by_ip(db, ip):
    query = r'SELECT * FROM servers WHERE ip="{}" and relevant=1'.format(ip)
    return db_get(db, query)

@check_input
def get_server_id_by_ip(db, ip):
    query = r'SELECT id FROM servers WHERE ip="{}"'.format(ip)
    return db_get(db, query)

@check_input
def get_server_by_id(db, id):
    query = r'SELECT * FROM servers WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_server_id_by_name(db, name):
    query = r'SELECT id FROM servers WHERE name="{}"'.format(name)
    return db_get(db, query)

@check_input
def get_servers_by_section_id(db, section_id):
    query = r'SELECT * FROM servers WHERE section_id="{}" AND relevant=1'.format(section_id)
    return db_get(db, query)

@check_input
def get_color_by_server_id(db, server_id):
    query = r'SELECT color_id FROM servers WHERE id="%s"' % (server_id)
    return db_get(db, query)

@check_input
def get_servers_by_color_id(db, color_id):
    query = r'SELECT id FROM servers WHERE color_id="%s"' % (color_id)
    return db_get(db, query)

@check_input
def change_section_id(db, id, newName):
    query = '''UPDATE sections
              SET name = "{}" 
              WHERE id = "{}" '''.format(newName,id)

    result = get_db_with_actions(db, query)
    return(result)

@check_input
def change_server_color(db, serverId, colorId):
    query = '''UPDATE servers
              SET color_id = "%s" 
              WHERE id = "%s" ''' % (colorId, serverId)

    result = get_db_with_actions(db, query)
    return(result)

@check_input
def edit_tag(db, id, name, color):
    if name == "":
        query = '''DELETE from tags
                WHERE id="{}"'''.format(id)
    else:
        query = '''UPDATE tags
                SET name = "{}",
                    color = "{}"
                WHERE id = "{}" '''.format(name, color, id)

    result = get_db_with_actions(db, query)
    return (result)

@check_input
def add_tag(db, serverId, name, color):
    query = ''' INSERT INTO tags(server_id, name, color)
                  VALUES("{}", "{}", "{}") '''.format(serverId, name, color)

    result = get_db_with_actions(db, query)
    return (result)

"""
=======================================================
                Files Functions
=======================================================
"""

@check_input
def insert_new_file(db, file_path, file_name, description, server_id, exec):
    """
    Add File from folder to data base.
    """
    query = ''' INSERT INTO files(path, name, description, server_id)
                  VALUES("{}","{}","{}","{}") '''.format(file_path, file_name, description, server_id)

    result = get_db_with_actions(db, query)

    create_log(db, "File Added", "file_id", result, "New file Added", exec)
    return(result)

@check_input
def insert_new_standalone_file(db, file_path, file_name, description, exec):
    """
    Add File from folder to data base Without server id.
    """
    query = ''' INSERT INTO files(path, name, description)
                  VALUES("{}","{}","{}") '''.format(file_path, file_name, description)

    result = get_db_with_actions(db, query)

    create_log(db, "File Added", "file_id", result, "New file Added", exec)
    return(result)

@check_input
def delete_file(db, file_id, exec):
    result = change_relevant_to_zero(db, "files", file_id)
    create_log(db, "File Deleted", "file_id",
               file_id, "Deleted File", exec)
    return result

@check_input
def get_files_by_server_id(db, id):
    query = r'SELECT * FROM files WHERE server_id="{}" and relevant=1'.format(
        id)
    return db_get(db, query)

@check_input
def get_all_files_names(db):
    query = r'SELECT name FROM files WHERE relevant=1'
    return db_get(db, query)

@check_input
def get_files_by_id(db, id):
    query = r'SELECT * FROM files WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_all_files(db):
    query = r'SELECT * FROM files WHERE relevant=1'
    return db_get(db, query)

"""
=======================================================
                Achievements Functions
=======================================================
"""
@check_input
def add_achievement(db, text):
    """
    Add File from folder to data base Without server id.
    """
    query = ''' INSERT INTO achievements(data)
                  VALUES("{}") '''.format(text)

    result = get_db_with_actions(db, query)

    return(result)

@check_input
def update_achievement(db, achievement_id):
    """
    """
    state = get_achievement_state(db, achievement_id)[0][0]
    if state:
        state = 0
    else:
        state = 1
    query = '''UPDATE achievements
              SET is_done = "{}" 
              WHERE id = "{}" '''.format(state,achievement_id)

    result = get_db_with_actions(db, query)
    return(result)

@check_input
def delete_achievement(db, id):
    """
    Delete achievement by achievement id.
    """
    result = change_relevant_to_zero(db, "achievements", id)
    return result

@check_input
def get_achievement_state(db, id):
    query = r'SELECT is_done FROM achievements WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def get_achievements(db):
    query = r'SELECT id,data,is_done FROM achievements WHERE relevant=1'
    return db_get(db, query)

"""
=======================================================
                Reports Functions
=======================================================
"""

@check_input
def save_to_report(db, data, section_name, img_path):
    """
    Save data to report
    """
    query = ''' INSERT INTO report(data,section_name,image_path)
                VALUES("{}","{}","{}") '''.format(data, section_name, img_path)
    result = get_db_with_actions(db, query)
    return(result)

@check_input
def update_to_report(db, data, section_name, img_path,id):
    """
    Update data of report
    """
    query = '''UPDATE report
              SET data = "{}" ,
              section_name = "{}",
              image_path = "{}"
              WHERE id = "{}" '''.format(data, section_name, img_path, id)

    result = get_db_with_actions(db, query)
    return(result)

@check_input
def get_all_report_data(db):
    """
    Gets all report data for pre report page
    """
    query = r'SELECT * FROM report WHERE relevant=1 ORDER BY id DESC'
    return db_get(db, query)

"""
=======================================================
                Ports Functions
=======================================================
"""
@check_input
def get_vulnerable_ports_by_server_id(db, id):
    query = r'SELECT port FROM ports WHERE server_id="{}" and vuln!="-"'.format(
        id)
    return db_get(db, query)

@check_input
def get_ports_by_server_id(db, id):
    query = r'SELECT * FROM ports WHERE server_id="{}"'.format(id)
    return db_get(db, query)

@check_input
def delete_port_by_id(db, port_id):
    query = 'DELETE FROM ports WHERE id="{}"'.format(port_id)
    return get_db_with_actions(db, query)

@check_input
def insert_new_port(db, port, state, service, vuln, object_id, object_value):
    """
    Add new port to data base.
    """
    query = ''' INSERT INTO ports(port,state,service,vuln,"{}")
                  VALUES("{}","{}","{}","{}","{}") '''.format(object_id, port, state, service, vuln, object_value)
    result = get_db_with_actions(db, query)
    return(result)

@check_input
def edit_port_by_id(db, portId, type, value):
    query = 'UPDATE ports SET "{}"="{}" WHERE id={}'.format(type,value,portId)
    return get_db_with_actions(db, query)

"""
=======================================================
                Comments Functions
=======================================================
"""
@check_input
def get_all_comments(db):
    # DESC reverse order so new comments will be at the top.
    query = r'SELECT * FROM comments WHERE relevant=1 ORDER BY id DESC'
    return db_get(db, query)

@check_input
def create_comment(db, data, executor, date):
    query = 'INSERT INTO comments(data, executor, date) VALUES("{}", "{}", "{}");'.format(
        data, executor, date)
    return(get_db_with_actions(db, query))

@check_input
def delete_comment_by_id(db, comment_id):
    query = 'UPDATE comments SET relevant=0 WHERE id={}'.format(comment_id)
    return get_db_with_actions(db, query)

"""
=======================================================
                Logs Functions
=======================================================
"""

@check_input
def get_log(db, id_log):
    query = r'SELECT * FROM log WHERE id_log="{}" and'.format(id_log)
    return db_get(db, query)

@check_input
def get_all_log(db):
    query = r'SELECT * FROM log ORDER BY id DESC'
    return db_get(db, query)

@check_input
def get_log_by_id(db, id):
    query = r'SELECT * FROM log WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def create_log(db, name_id, object_name, object_id, data, exec):
    today = date.today()
    date_today = today.strftime(r"%d.%m.%Y")
    hour = r"{}:{}".format(datetime.now().hour, datetime.now().minute)
    """
    Add new log to data base.
    """
    query = ''' INSERT INTO log("{}",name,hour,date,data,executor)
            VALUES("{}","{}","{}","{}","{}","{}") '''.format(object_name, object_id, name_id, hour, date_today, data, exec)
    return(get_db_with_actions(db, query))

"""
=======================================================
                Search Functions
=======================================================
"""

@check_input
def get_all_data(db):
    '''
    Returns data from all DB for search bar query
    '''
    query = r'SELECT data,id,is_done,relevant,"Achievements" FROM Achievements UNION ' \
        r'SELECT data,id,executor,relevant,"comments" FROM comments UNION ' \
            r'SELECT name,id,description,relevant,"files" FROM files UNION ' \
                r'SELECT ip,id,type,relevant,"netdevices" from netdevices UNION ' \
                    r'SELECT ip,id,name,relevant,"servers" from servers UNION ' \
                        r'SELECT task_name,id,executers,relevant,"tasks" from tasks UNION ' \
                            r'SELECT username,id,password,relevant,"users" from users UNION ' \
                                r'SELECT name,id,data,relevant,"vulns" from vulns UNION ' \
                                    r'SELECT data,id,section_name,image_path,"report" from report'  

    return db_get(db, query)

"""
=======================================================
                Exploits Functions
=======================================================
"""

@check_input
def get_all_exploits(db):
    query = r'SELECT * FROM exploits WHERE relevant=1 ORDER BY id DESC;'
    return db_get(db, query)

@check_input
def insert_new_exploit(db, name,data,file_path):
    """
    Add new exploit to data base.
    """
    query = ''' INSERT INTO exploits(name,data,file_path)
                  VALUES("{}","{}","{}") '''.format(name,data,file_path)
    result = get_db_with_actions(db, query)
    return(result)

@check_input
def get_file_path_by_exploit_id(db, id):
    query = r'SELECT file_path FROM exploits WHERE id="{}"'.format(id)
    return db_get(db, query)

@check_input
def update_exploit(db, id, name, data):
    query = 'UPDATE exploits SET data="{}", name="{}" WHERE id={}'.format(data, name, id)
    return get_db_with_actions(db, query)

"""
=======================================================
                Users Functions
=======================================================
"""

@check_input
def add_new_user(username, password, projectId):
    query = 'INSERT INTO redeye_users(username, password, projectId) VALUES("{}", "{}","{}");'.format(
        username, password,projectId)
    return get_db_with_actions(MANAGE_DB, query)

@check_input
def update_user_details(obj, data, user_id):
    query = 'UPDATE redeye_users SET "{}"="{}" WHERE id="{}"'.format(obj,data,user_id)
    return get_db_with_actions(MANAGE_DB, query)

@check_input
def delete_user_by_id(user_id):
    query = 'DELETE FROM redeye_users WHERE id="{}"'.format(user_id)
    return get_db_with_actions(MANAGE_DB, query)

@check_input
def get_profilePicture_by_id(picId):
    query = r'SELECT profile_pic FROM redeye_users WHERE id="{}"'.format(picId)
    return db_get(MANAGE_DB, query)


"""
=======================================================
                Notebooks Functions
=======================================================
"""

@check_input
def get_all_notebooks(db, userId):
    query = r'SELECT * FROM notebooks WHERE isPrivate=0 OR (isPrivate=1 AND creatorId="{}")'.format(id)
    return db_get(db, query)

def update_notebookName(db,name,id):
    query = 'UPDATE notebooks SET name="{}" WHERE id={}'.format(name, id)
    return get_db_with_actions(db, query)

"""
=======================================================
                Colors Functions
=======================================================
"""

@check_input
def add_defult_colors(db):

    with open(INIT_COLORS,'r') as data:
        colors = data.readlines()

    colors = list(map(str.strip, colors))

    for color in colors:
        name, hexColor = color.split(':')
        query = f'INSERT INTO colors(name,hexColor) VALUES("%s","%s");' % (name, hexColor)
        get_db_with_actions(db, query)

    return


@check_input
def add_color(db, colorName, hexColor):
    query = ''' INSERT INTO colors(name,hexColor)
                  VALUES("%s","%s") ''' % (colorName, hexColor)

    result = get_db_with_actions(db, query)
    return(result)


@check_input
def change_color(db, column, value, colorId):
    query = 'UPDATE colors SET "%s"="%s" WHERE id=%s' % (column, value, colorId)
    return get_db_with_actions(db, query)

@check_input
def get_colors(db):
    query = r'SELECT * FROM colors'
    return db_get(db, query)

@check_input
def get_color_by_id(db, colorId):
    query = r'SELECT hexColor FROM colors WHERE id="%s"' % (colorId)
    return db_get(db, query)

@check_input
def delete_color(db, colorId):
    query = 'DELETE FROM colors WHERE id="%s"' % (colorId)
    return get_db_with_actions(db, query)

"""
=======================================================
                Helpers Functions
=======================================================
"""

@check_input
def get_data_by_table(db, table_name,id):
    query = r'SELECT * FROM {} WHERE id="{}"'.format(table_name,id)
    return db_get(db, query)

@check_input
def get_relevant_by_id(db, object_name, object_id):
    """
    returns 1 if relevant, 0 else
    """
    table_name = ""
    if "user" in object_name:
        table_name = "users"
    elif "task" in object_name:
        table_name = "tasks"
    elif "server" in object_name:
        table_name = "servers"
    elif "device" in object_name:
        table_name = "netdevices"
    elif "vuln" in object_name:
        table_name = "vulns"
    else:
        pass
    query = ''' SELECT relevant FROM {} WHERE id={}'''.format(
        table_name, object_id)
    relevant = db_get(db, query)
    return(relevant)

@check_input
def change_relevant_to_zero(db, table_name, object_id):
    """
    Update relevant by id of the object.
    """
    query = ''' UPDATE {}
              SET relevant = 0
              WHERE id = "{}"'''.format(table_name, object_id)
    result = get_db_with_actions(db, query)
    return result

"""
=======================================================
                Management DB Functions - users
=======================================================
"""

@check_input
def get_redeye_users(projectId):
    query = r'SELECT * FROM redeye_users WHERE projectId="{}"'.format(projectId)
    return db_get(MANAGE_DB, query)

@check_input
def get_redeye_user_by_id(id):
    query = r'SELECT id,username,profile_pic FROM redeye_users WHERE id="{}"'.format(id)
    return db_get(MANAGE_DB, query)[0]

@check_input
def change_user_profile_pic(userId,profilePicName):
    query = '''UPDATE redeye_users
              SET profile_pic = "{}" 
              WHERE id = "{}" '''.format(profilePicName, userId)

    result = get_db_with_actions(MANAGE_DB, query)
    return(result)

@check_input
def get_redeye_users_names(projectId):
    query = r'SELECT username FROM redeye_users WHERE projectId = "{}"'.format(projectId)
    return db_get(MANAGE_DB, query)

@check_input
def get_projects():
    query = r'SELECT * FROM projects'
    return db_get(MANAGE_DB, query)

@check_input
def insert_new_project(name, filename):
    query = r'INSERT INTO projects(filename, name) VALUES("{}", "{}")'.format(filename, name)
    result = get_db_with_actions(MANAGE_DB, query)
    return(result)

@check_input
def get_projectId_by_projectName(projectName):
    query = r'SELECT id FROM projects WHERE name="{}"'.format(projectName)
    return db_get(MANAGE_DB, query)[0][0]

@check_input
def get_projectId_by_DBName(dbName):
    query = r'SELECT id FROM projects WHERE filename="{}"'.format(dbName)
    return db_get(MANAGE_DB, query)[0][0]

@check_input
def get_project_by_id(projectId):
    query = r'SELECT name FROM projects WHERE id="{}"'.format(projectId)
    return db_get(MANAGE_DB, query)[0][0]

@check_input
def get_project_filename_by_id(projectId):
    query = r'SELECT filename FROM projects WHERE id="{}"'.format(projectId)
    return db_get(MANAGE_DB, query)[0][0]


"""
=======================================================
                Management DB Functions - tokens
=======================================================
"""

@check_input
def get_tokens_details(projectId):
    query = r'SELECT * FROM access_tokens WHERE project_id="{}"'.format(projectId)
    return db_get(MANAGE_DB, query)

@check_input
def get_hashed_token_details(hashed_token):
    query = r'SELECT * FROM access_tokens WHERE token="{}"'.format(hashed_token)
    return db_get(MANAGE_DB, query)

@check_input
def insert_new_token(name, token, permissions, valid_by, user_id, project_id):
    query = f'INSERT INTO access_tokens(name, token, permissions, valid_by, user_id, project_id) VALUES("{name}", "{token}", \'{permissions}\', "{valid_by}", "{user_id}", "{project_id}")'
    result = get_db_with_actions(MANAGE_DB, query)
    return(result)

@check_input
def delete_token_by_id(token_id):
    query = f'DELETE FROM access_tokens WHERE id="{token_id}"'
    return get_db_with_actions(MANAGE_DB, query)

"""
=======================================================
                DB Functions
=======================================================
"""

def db_get(db, query):
    conn = create_connection(db)
    cur = conn.cursor()
    cur.execute(query)
    results = cur.fetchall()
    conn.close()

    decodedResults = []
    for result in results:
        result = list(result)
        for index, res in enumerate(result):
            try:
                result[index] = unescape(res)
            except Exception:
                result[index] = res

        decodedResults.append(tuple(result))

    return decodedResults

def get_db_with_actions(db, query):
    """
    Like db_get() but with commit to change the db and returns the id of the row
    That the Action took place
    """
    conn = create_connection(db)
    cur = conn.cursor()
    cur.execute(query)
    conn.commit()
    result = cur.lastrowid
    conn.close()
    return result

def create_connection(db):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db)
    except Error as e:
        print(e)
    # finally:
        # if conn:
        # conn.close()
    return conn

# Creates tables in management DB
def create_management_tables(tables, init):
    """
    Create new management db tables.
    """
    conn = create_connection(MANAGE_DB)
    try:
        c = conn.cursor()
        c.executescript(tables)
        c.executescript(init)
    except Error as e:
        print(e)
    conn.close()


# Creates tables in DB
def create_tables(db, tables, init=False):
    """
    Create new db tables.
    """
    conn = create_connection(db)
    try:
        c = conn.cursor()
        c.executescript(tables)
        if init:
            c.executescript(init)
    except Error as e:
        print(e)
    conn.close()

def set_project_db(project):
    # Find initialization of DB and replace project DB.
    # Change mainDB to initial db for managment information.

    db = PROJECT_PATH + project

    if not isfile(db):
        with open(TABLES_SQL, "r") as table:
            tables = table.read()
        create_tables(db, tables)
        add_defult_colors(db)
    
    return db

def init_demo_db():
    """
    Create example database.
    """

    with open(TABLES_SQL, "r") as table:
            tables = table.read()
            
    with open(INIT_SQL, "r") as initialize:
        init = initialize.read()
    
    create_tables(PROJECT_PATH + "example.db", tables, init)
    add_defult_colors(PROJECT_PATH + "example.db")

def merge_new_project_db(projectManager, newProjectId, dbFile):

    # Connect to the imported DB
    conn = create_connection(MANAGE_DB)

    # Attach the new DB as pdb
    conn.execute(f"ATTACH '{projectManager}' as pdb")
    conn.execute("BEGIN")

    # Get the id of the imported project
    cur = conn.cursor()
    cur.execute(f'SELECT id FROM pdb.projects WHERE filename="{dbFile}"')
    pId = cur.fetchall()[0][0]

    # Insert all users from this specific project to current DB
    for user in conn.execute("SELECT * FROM pdb.redeye_users"):
        if user[4] == pId:
            query = f"""INSERT INTO redeye_users(username,password,profile_pic,projectID) VALUES("{user[1]}","{user[2]}","{user[3]}",{newProjectId}) """
            conn.execute(query)
    conn.commit()
    conn.execute("detach database pdb")

"""
=======================================================
                Init Function
=======================================================
"""

def init(add_init=False):
    if not isdir(PROJECT_PATH):
        makedirs(PROJECT_PATH, exist_ok=True)

    with open(MANAGE_TABLES_SQL, "r") as table:
        tables = table.read()
    with open(MANAGE_INIT_SQL, "r") as initialize:
        init = initialize.read()
    create_management_tables(tables, init)

if __name__ == "__main__":
    init()
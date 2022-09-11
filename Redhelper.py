#Imports
from flask import session
from os import path
import os
from redeye import *
from RedDB import db
import base64
from mimetypes import guess_extension
from collections import defaultdict
import shutil
import hashlib


# Consts
PROJECT_START = "May 1 2020" # Need to change this to be in the database
PROJECT_END = "May 20 2020" # Need to change this to be in the database
SERVICES_FILE = "Tools/services"

def setGlobals():
    global MAIN_FILES
    global LOOT_FOLDER
    global SCAN_FOLDER
    global JSON_FOLDER
    global PAYLOAD_FOLDER
    global SCREENSHOTS_FOLDER
    global REPORT_IMAGES
    global PASS_FOLDER
    global FILES_FOLDER
    global GENERAL_FILES

    # FrontEnd
    GENERAL_FILES = "files/"
    MAIN_FILES = "files/{}/frontend"
    LOOT_FOLDER = "files/{}/frontend/Loot"
    SCAN_FOLDER = "files/{}/frontend/Scans"
    SCREENSHOTS_FOLDER = "files/{}/frontend/Screenshots"

    # Backend
    PASS_FOLDER = "files/{}/backend/passwords"
    JSON_FOLDER = "files/{}/backend/jsons"
    PAYLOAD_FOLDER = "files/{}/backend/payloads"
    REPORT_IMAGES = "files/{}/backend/report_images"
    FILES_FOLDER = "files/{}/backend/General"
    
def setFilesFolder(folderName):
    return MAIN_FILES.format(folderName), FILES_FOLDER.format(folderName), SCAN_FOLDER.format(folderName), JSON_FOLDER.format(folderName), PAYLOAD_FOLDER.format(folderName), SCREENSHOTS_FOLDER.format(folderName), REPORT_IMAGES.format(folderName), PASS_FOLDER.format(folderName)

def save_image(name, data):
    """
    Save image got from pre report page ==> img_path
    """
    imgdata = base64.b64decode(data.split(r"base64,")[1])
    with open(r"{}".format(os.path.join(PAYLOAD_FOLDER.format(session["project"]), name)), 'wb') as out:
        out.write(imgdata)

    return r"{}".format(os.path.join(PAYLOAD_FOLDER.format(session["project"]), name))

def delete_file2(path):
    if '..' in path:
        return None
    else:
        os.remove(r"{}/{}".format(os.path.join(MAIN_FILES.format(session["project"]),path[len(MAIN_FILES.format(session["project"]))+serve_file_by_os()]),path))

def delete_file(path):
    if '..' in path:
        return None
    else:
        if os.path.isdir(path):
            shutil.rmtree(path, ignore_errors=True)
        else:
            os.remove(path)

def get_image(path):
    with open(r"{}".format(path), 'rb') as out:
        encoded_string = base64.b64encode(out.read())
    return (r"data:image/jpeg;base64,{}".format(encoded_string.decode()))

def time_left():
    start = datetime.strptime(PROJECT_START, "%b %d %Y")
    end = datetime.strptime(PROJECT_END, "%b %d %Y")
    days_left = (end - datetime.now()).days
    return days_left, int(((datetime.now() - start) / (end-start)) * 100)

def share_files(walk_dir):
    dic = defaultdict(list)
    lst_files, lst_dirs = defaultdict(list), defaultdict(list)
    root = ""
    last_dir = ""
    for root, subdirs, files in os.walk(walk_dir):
        dic_files = defaultdict(list)
        dic_folders = defaultdict(list)
        for subdir in subdirs:

            dic_folders[subdir].append(os.path.join(root, subdir))
        for filename in files:

            dic_files[filename].append(os.path.join(root, filename))
        dic[root].append([dic_folders,dic_files])
        break
    for key,values in dic.items():
        root = key
        last_dir = os.path.dirname(root)
        if not last_dir:
            last_dir = MAIN_FILES.format(session["project"])
        for k,v in values[0][0].items():
            lst_dirs[k].append(v[0])
        for k,v in values[0][1].items():
            lst_files[k].append(v[0])
    return root,lst_dirs,lst_files, last_dir

def get_all_files(walk_dir):
    lst_files = defaultdict(list)
    for root, subdirs, files in os.walk(walk_dir):
        for filename in files:
            lst_files[filename].append(os.path.join(root, filename))

    return lst_files

def convert_path_to_name(full_name_list):
    lst_names = []
    for object_path in full_name_list:
        lst_names.append(object_path.split("\\")[-1])
    return lst_names

def save_file(file, folder):
    """
    Gets file object and returns full_path,file_name
    """
    file_name = file.filename
    file.save(os.path.join(folder, file_name))
    return r"{}/{}".format(folder, file_name), file_name


def save_file_in_dir(path, file_data, name):
    full_path = os.path.join(path, name)
    if secure_file_name(full_path):
        return
    with open(full_path, 'wb') as data:
        data.write(file_data)
    return

def check_login(creds,project):
    approve = db.get_redeye_users(project)
    try:
        for a in approve:
            if a[1] == creds["username"] and a[2] == hashlib.sha256(creds["password"].encode()).hexdigest():
                return(a[0])
    except Exception:
        pass
    return(0)

def set_user_server_name(userdb, found_on,server_id):
    server_info = db.get_server_by_id(userdb, server_id)
    if server_info:
        server_name = server_info[0][2]
        if not server_name:
            # if server does not has a name - will disply the ip
            server_name = server_info[0][1]
    else:
        if found_on:
            server_name = found_on
        else:
            server_name = "Unknown"
    return server_name

def set_user_device_name(userdb, found_on,device_id):
    device_info = db.get_netdevices_by_id(userdb, device_id)
    if device_info:
        device_ip = device_info[0][2]
    else:
        if found_on:
            device_ip = found_on
        else:
            device_ip = "Unknown"
    return device_ip

def serve_file_by_os():
    if os.name == 'nt':
        return 1
    else:
        return 2

def set_task(task):

    if 'task_executer' not in task:
        task['task_executer'] = "All"
    if task['task_name'] == '':
        task['task_name'] = "UnNamed Task"
    return task


def get_img_extension(img_data):
    img_data = img_data.split(";base64,")[0].split("data:")[1]
    return guess_extension(img_data)

def get_current_date():
    today = datetime.today()
    current_date = today.strftime("%d/%m/%Y")
    return(current_date)

def get_logs(userdb, logs, keyword=None):
    days,month_years,all_users,all_tasks,all_vulns,all_devices,all_servers,all_objects,all_files = [],[],[],[],[],[],[],[],[]
    for i, log in enumerate(logs):
        all_users.append(db.get_user_details(userdb, log[1]))
        all_tasks.append(db.get_task(userdb, log[2]))
        all_servers.append((db.get_server_by_id(userdb, log[3])))
        all_devices.append((db.get_netdevices_by_id(userdb, log[4])))
        all_vulns.append((db.get_vulns(userdb, log[5])))
        all_files.append((db.get_files_by_id(userdb, log[6])))
        days.append(r"{}.{}".format(logs[i][8].split(
            ".")[0], logs[i][8].split(".")[1]))
        month_years.append(r"{}".format(logs[i][8].split(".")[2]))
        """
		Those try exept must be sorted according the database order.
		All it do is adding the database index to the data.
		"""
        try:
            all_users[i][0] = (log[0],) + all_users[i][0]
        except Exception:
            pass
        try:
            all_tasks[i][0] = (log[0],) + all_tasks[i][0]
        except Exception:
            pass
        try:
            all_servers[i][0] = (log[0],) + all_servers[i][0]
        except Exception:
            pass
        try:
            all_devices[i][0] = (log[0],) + all_devices[i][0]
        except Exception:
            pass
        try:
            all_vulns[i][0] = (log[0],) + all_vulns[i][0]
        except Exception:
            pass
        try:
            all_files[i][0] = (log[0],) + all_files[i][0]
        except Exception:
            pass
    
    all_objects.extend(all_users+all_tasks+all_servers +
                       all_devices+all_vulns+all_files)
    # Getting out of all empty lists.
    all_objects = [x for x in all_objects if x != []]
    if keyword:
        key_word_objs,days,month_years,sorted_logs =[],[],[],[]
        for i,obj in enumerate(all_objects):
            item = obj[0]

            if keyword.lower() in str(item[2:]).lower():
                key_word_objs.append(obj)
                log = db.get_log_by_id(userdb, obj[0][0])[0]
                days.append(r"{}.{}".format(log[8].split(
                ".")[0], log[8].split(".")[1]))
                month_years.append(r"{}".format(log[8].split(".")[2]))
                sorted_logs.append(log)

        all_objects = key_word_objs
        logs = sorted_logs
    # Sort lists according to how they show in the database
    all_objects = sorted(all_objects, key=lambda x: x[0])
    return all_objects[::-1],logs,days,month_years


def secure_file_name(name):
    if '..' in name:
        return True
    else:
        return False
 

def get_section_id(userdb, ip_addr):
    """
    Get section id by segments of the ipaddr
    In: Gets ip addr
    Algo: pops off last octat and checks if the 3 first octats are eqal
    Return: section id to put the server at
    """
    servers = db.get_servers(userdb)
    nmap_segment = ip_addr.split(".")
    del nmap_segment[-1]
    section_id = 0
    for server in servers:
        server_segment = server[1].split(".")
        del server_segment[-1]
        if ".".join(nmap_segment) == ".".join(server_segment):
            section_id = db.get_section_id_by_server_id(userdb, server[0])
            return section_id

    if not section_id:
        section_id = db.create_new_server_section(userdb, "Imported Scans - {}.*".format(".".join(nmap_segment)))

    return section_id

def get_project_name(projects, dbname):
    for project in projects:
        if project[1] == dbname:
            return project[2]

def get_service_name_by_port(port):
    f = open(SERVICES_FILE, "r")
    lines = f.read().split("\n")
    port = "\t" + port + "/"
    for line in lines:
        if port in line:
            word = line.split("\t")[0]
            return word
    return "unknown"

def debug(text):
    print("------------------------\n")
    print(text)
    print("-------------")

def renameFiles(oldFileName,newFileName):
    os.rename(oldFileName,newFileName)

def zipdir(filesPath, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(filesPath):
        for file in files:
            ziph.write(path.join(root, file), 
                       path.relpath(path.join(root, file), 
                                       path.join(filesPath, '..')))


def setDefaultColor(dbSession, color_id):
    changeColorTo = db.get_servers_by_color_id(dbSession, color_id)
    for server in changeColorTo:
        db.change_server_color(dbSession, server[0], 1)
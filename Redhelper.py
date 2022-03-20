#Imports
from flask import Flask, request, render_template, session, request, redirect, abort, make_response, url_for, send_from_directory, flash, jsonify
from os import walk, path, sep
import os
from redeye import *
from RedDB import db
from Parse import Parse as parse
from Report import report_gen as report
from datetime import datetime, timedelta
import base64
from mimetypes import guess_extension
from collections import defaultdict
import shutil


# Consts
PROJECT_START = "May 1 2020" # Need to change this to be in the database
PROJECT_END = "May 20 2020" # Need to change this to be in the database
SERVICES_FILE = "Tools/services"

def setGlobals():
    print("Setting globals")
    global MAIN_FILES
    global FILES_FOLDER
    global PASS_FOLDER
    global SCAN_FOLDER
    global JSON_FOLDER
    global PAYLOAD_FILES
    global SCREENSHOTS_FILES
    global ADMIN_FILES
    global REPORT_IMAGES
    MAIN_FILES = "files/{}"
    FILES_FOLDER = "files/{}/data"
    PASS_FOLDER = "files/{}/passwords"
    SCAN_FOLDER = "files/{}/scans"
    JSON_FOLDER = "files/{}/jsons"
    PAYLOAD_FILES = "files/{}/payloads"
    SCREENSHOTS_FILES = "files/{}/screenshots"
    ADMIN_FILES = "files/{}/admin"
    REPORT_IMAGES = "files/{}/report_images"

def setFilesFolder(folderName):
    print(folderName)
    return MAIN_FILES.format(folderName), FILES_FOLDER.format(folderName), PASS_FOLDER.format(folderName), SCAN_FOLDER.format(folderName), JSON_FOLDER.format(folderName), PAYLOAD_FILES.format(folderName), SCREENSHOTS_FILES.format(folderName), ADMIN_FILES.format(folderName), REPORT_IMAGES.format(folderName)
     

def dir_option(dirname):
    if dirname == "All":
        return MAIN_FILES.format(session["project"])
    elif dirname == "Payloads":
        return PAYLOAD_FILES.format(session["project"])
    elif dirname == "Screenshots":
        return PAYLOAD_FILES.format(session["project"])
    elif dirname == "Recon":
        return PASS_FOLDER.format(session["project"])
    elif dirname == "Admin":
        return ADMIN_FILES.format(session["project"])
    else:
        return None

def save_image(name, data):
    """
    Save image got from pre report page ==> img_path
    """
    imgdata = base64.b64decode(data.split(r"base64,")[1])
    with open(r"{}".format(os.path.join(PAYLOAD_FILES.format(session["project"]), name)), 'wb') as out:
        out.write(imgdata)

    return r"{}".format(os.path.join(PAYLOAD_FILES.format(session["project"]), name))

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

def user_type_to_name(user_type):
    if user_type == 1:
        return "Domain"
    elif user_type == 2:
        return "Localhost"
    elif user_type == 3:
        return "Application"
    elif user_type == 4:
        return "NetDevice"
    elif user_type == 5:
        return "Other"
    else:
        return "Unknown"

def user_name_to_type(user_type_name):
    if user_type_name == "Domain":
        return 1
    elif user_type_name == "Localhost":
        return 2
    elif user_type_name == "Application":
        return 3
    elif user_type_name == "NetDevice":
        return 4
    elif user_type_name == "Other":
        return 5
    else:
        return "Unknown"

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
            #print('\t- subdirectory ' + subdir)
            dic_folders[subdir].append(os.path.join(root, subdir))
        for filename in files:
            #file_path = os.path.join(root, filename)
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
    print(lst_files)
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

def check_login(creds):
    approve = db.get_redeye_users()
    try:
        for a in approve:
            if a[1] == creds["username"] and a[2] == creds["password"]:
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

def set_user_other_user(found_on,user_found):
    if user_found:
        return user_found
    else:
        if found_on:
            return found_on
        else:
            return "Unknown"

def serve_file_by_os():
    if os.name == 'nt':
        return 1
    else:
        return 2

def set_task(task):
    print(task)
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
            print(item[2:])
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
    print(" " + port + "/")
    port = "\t" + port + "/"
    for line in lines:
        if port in line:
            word = line.split("\t")[0]
            return word
    return "unknown"

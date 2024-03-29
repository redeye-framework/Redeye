import re
from RedDB import db
import xml.etree.ElementTree as ET
from collections import defaultdict
from werkzeug.utils import secure_filename
import graph

"""
Gets path to nmap.xml and returns data
Tested on command: nmap -sC -sV -O -A <IP> -oX IP.xml 
"""

def parse_nmap_data(path):
    """
    returns dic ==> 
    """
    dic = defaultdict(list)
    dic_value = {}
    dic_details = {}
    d = defaultdict(list)

    for tag in get_all_data(path):
        for key,val in tag.items():
            if key == "address":

                if val[1][1] == "ipv4":
                    dic_details = {}
                    ip_addr = val[0][1]

                try:
                    if val[2][0] == "vendor":
                        dic_details = {}
                        dic_details["vendor"] = val[2][1]
                        dic[ip_addr].append(dic_details)
                except Exception:
                    dic_details = {}
                    dic_details["vendor"] = "Unknown vendor"
                    dic[ip_addr].append(dic_details)
            try:
                if key == "hostname":
                    if val[0][0] == "name":
                        dic_details = {}
                        dic_details["hostname"] = val[0][1]
                        dic[ip_addr].append(dic_details)
            except Exception:
                dic_details = {}
                dic_details["hostname"] = ""
                dic[ip_addr].append(dic_details)
                
            if key == "port":
                dic_value = {}
                dic_value["port"] = "{}-{}".format(val[0][1],val[1][1])

            elif key == "service":
                if len(val[0][1]) > 255:
                    dic_value["service"] = "Unknown"

                else:
                    dic_value["service"] = "{}".format(val[0][1])

            elif key == "state":
                dic_value["state"] = val[0][1]
                d[ip_addr].append(dic_value)

    
    return d,dic

def get_nmap_data(path):
    d,dic = parse_nmap_data(path)
    lst_ports = []
    dic_data = {}
    total_dic = defaultdict(list)
    for ip,val in dic.items():
        dic_data = {}
        for i in val:
            try:
                dic_data["vendor"] = i["vendor"]
            except Exception:
                dic_data["vendor"] = ""
            try:
                dic_data["hostname"] = i["hostname"]
            except:
                dic_data["hostname"] = ""
        total_dic[ip].append(dic_data)

    for ip,val in d.items():
        dic_data = {}
        lst_ports = []
        for i in val:
            lst_ports.append(i)
        dic_data["ports"] = lst_ports
        total_dic[ip].append(dic_data)

    return total_dic

def get_all_data(path):
    """
    Gets all data from XML file
    """
    elemList = []
    tree = ET.parse(path)
    root = tree.getroot()
    for elem in root.iter():
        dic = {}
        dic[elem.tag] = elem.items()
        elemList.append(dic)
    return elemList

#def parse_output(path = r"files\passwords.txt"):
#    """
#    gets output file of john,hashcat,ldap --> returns: user:password dic
#    """
#    pass


def parse_users_passwords(dbName,exec,file_name,path, isDockerEnv):
    with open(path,'r') as users_passwords:
        data = users_passwords.read().split("\n")

    importedTypeName = "Imported from " + secure_filename(file_name)

    # Add new user Type
    typeNameExsist = 0
    for typeName in db.get_all_users_types(dbName):
        if typeName[0] == importedTypeName:
            typeNameExsist = 1
            break

    # Add new type only if its not already exsists
    if not typeNameExsist:
        userTypeId = db.insert_new_user_type(dbName, importedTypeName)
    
    else:
        userTypeId = db.get_user_type(dbName, importedTypeName)[0][0]

    for line in data:
        try:
            user,password = line.split(":")

        except:
            continue
        
        user_id = db.insert_new_other_user(dbName,userTypeId,file_name,user,password,"-",exec)
        
        if isDockerEnv:
            graph.addUserNode(user_id,user,password,"None")


def check_nmap_file(file_path):
    """
    Checks if file is oX xml output nmap file
    """
    with open(file_path,'r') as check:
        data = check.readlines()
    if r"<?xml" in data[0] and r"<!DOCTYPE nmaprun" in data[1]:
        return True
    else:
        return False

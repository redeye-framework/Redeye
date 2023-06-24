from datetime import datetime

READ = 'r'
WRITE = 'w'


def read():
    return READ

def write():
    return WRITE

def readwrite():
    return "%s%s" % (READ, WRITE)

def module():
    return {
        'servers': {
            "read": False,
            "write": False
        },
        'users': {
            "read": False,
            "write": False
        },
        'files': {
            "read": False,
            "write": False
        },
        'exploits': {
            "read": False,
            "write": False
        },
        'logs': {
            "read": False,
            "write": False
        }
    }

def access_level(required, permissions, resource, valid_by):
    current_time = datetime.now()
    valid_by_time = datetime.strptime(valid_by, '%d/%m/%Y %H:%M:%S')

    if current_time > valid_by_time:
        # Token has expired
        return False
    
    if permissions.get(resource).get('read') and required == read():
        return True
    
    elif permissions.get(resource).get('write') and required == write():
        return True
    
    return False
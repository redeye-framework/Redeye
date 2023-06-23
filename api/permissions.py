

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

def access_level(required, permissions, resource):
    if permissions.get(resource).get('read') and required == read():
        return True
    
    elif permissions.get(resource).get('write') and required == write():
        return True
    
    return False
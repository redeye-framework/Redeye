

def status(msg: dict) -> dict:
    return { "Status" : msg }

def error_msg(msg: str) -> dict:
    return status({ "Error" : msg })

def success_msg(msg: str) -> dict:
    return status({ "Success" : msg })

def help_msg(msg: dict) -> dict:
    return { "Help" : msg }

def return_401() -> dict:
    return status({ "Authentication Required": 401 })

def return_403() -> dict:
    return status({ "Forbidden": 403 })
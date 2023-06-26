

def status(msg: dict) -> dict:
    return { "Status" : msg }

def error_msg(msg: str) -> dict:
    return status({ "Error" : msg })

def success_msg(msg: str) -> dict:
    return status({ "Success" : msg })

def help_msg(msg: dict) -> dict:
    return { "Help" : msg }
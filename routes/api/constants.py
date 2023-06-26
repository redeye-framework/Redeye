

def status(msg: dict) -> dict:
    return { "Status": msg }

def error_msg(msg: str) -> dict:
    return status({ "Error": msg })

def success_msg(msg: str) -> dict:
    return status({ "Success": msg })
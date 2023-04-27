from functools import wraps
from flask import request, request, Blueprint
from flask import jsonify
from RedDB.db import get_hashed_token_details
from hashlib import sha256
import json
from RedDB import db
import os

api_route = Blueprint('api', __name__)
PROJECTS = r"RedDB/Projects/{}"


def return_json(f):
    @wraps(f)
    def inner(*args, **kwargs):
        token = request.headers.get('Token')
        token_details = get_hashed_token_details(sha256(token.encode()).hexdigest())
        if not token_details:
            return { "status" : 401 }
        
        response = f(token_details[0])
        return response
    
    return inner

@api_route.route('/api/servers',methods=['GET'])
@return_json
def api_get_servers(token_data):
    permissions = json.loads(token_data[3])
    if not permissions.get('servers'):
        return {"status" : 403}
    
    servers = []
    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    raw_servers = db.get_servers(db_name)

    for server in raw_servers:
        servers.append({
            "id": server[0],
            "ip": server[1],
            "name": server[2],
            "vendor": server[3],
            "is_accessible": True if server[4] else False,
            "attain": server[5],
            "is_relevant": True if server[6] else False,
            "section_id": server[7]
        })
        
    return jsonify(servers)


@api_route.route('/api/users',methods=['GET'])
@return_json
def api_get_users():
    return {"status":200}
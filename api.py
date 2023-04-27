from functools import wraps
from flask import request, request, Blueprint
from flask import jsonify
from RedDB.db import get_hashed_token_details
from hashlib import sha256
import json
from RedDB import db
from RedDB import jdb
import os

api_route = Blueprint('api', __name__)
PROJECTS = r"RedDB/Projects/{}"


def return_json(f):
    @wraps(f)
    def inner(*args, **kwargs):
        token = request.headers.get('Token')
        token_details = get_hashed_token_details(sha256(token.encode()).hexdigest())
        if not token_details:
            return jsonify({ "status" : 401 })
        
        response = f(token_details[0])
        return response
    
    return inner

@api_route.route('/api/servers',methods=['GET'])
@return_json
def api_get_servers(token_data):
    permissions = json.loads(token_data[3])
    if not permissions.get('servers'):
        return jsonify({"status" : 403})
    
    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    servers = jdb.servers_info(db_name)

    return jsonify(servers)


@api_route.route('/api/users',methods=['GET'])
@return_json
def api_get_users():
    return {"status":200}


@api_route.route('/api/exploits',methods=['GET'])
@return_json
def api_get_exploits(token_data):
    permissions = json.loads(token_data[3])
    if not permissions.get('exploits'):
        return jsonify({"status" : 403})
    

    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    exploits = jdb.exploits_info(db_name)

    return jsonify(exploits)
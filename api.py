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
        
        response = f(token_details[0], request.args.to_dict())
        return response
    
    return inner

@api_route.route('/api/servers',methods=['GET'])
@return_json
def api_get_servers(token_data, args):
    permissions = json.loads(token_data[3])
    if not permissions.get('servers'):
        return jsonify({"status" : 403})
    
    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    servers = jdb.servers_info(db_name, args)

    return jsonify(servers)


@api_route.route('/api/exploits',methods=['GET'])
@return_json
def api_get_exploits(token_data, args):
    permissions = json.loads(token_data[3])
    if not permissions.get('exploits'):
        return jsonify({"status" : 403})
    

    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    exploits = jdb.exploits_info(db_name, args)

    return jsonify(exploits)


@api_route.route('/api/files',methods=['GET'])
@return_json
def api_get_files(token_data, args):
    permissions = json.loads(token_data[3])
    if not permissions.get('files'):
        return jsonify({"status" : 403})
    

    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    files = jdb.files_info(db_name, args)

    return jsonify(files)


@api_route.route('/api/users',methods=['GET'])
@return_json
def api_get_users(token_data, args):
    permissions = json.loads(token_data[3])
    if not permissions.get('users'):
        return jsonify({"status" : 403})
    
    db_name = PROJECTS.format(db.get_project_filename_by_id(token_data[6]))
    users = jdb.users_info(db_name, args)

    return jsonify(users)
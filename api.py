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

READ = 1
READ_WRITE = 2


def authentication(access_level, resource):

    def outer(f):
        @wraps(f)
        def inner(*args, **kwargs):
            token = request.headers.get('Token')
            token_details = get_hashed_token_details(sha256(token.encode()).hexdigest())
            if not token_details:
                return jsonify({ "status" : 401 })
            
            permissions = json.loads(token_details[0][3])
            token_access_level = int(permissions.get('access_level'))
            token_auth = permissions.get('auth')

            if access_level <= token_access_level and \
                token_auth.get(resource):
                db_name = PROJECTS.format(db.get_project_filename_by_id(token_details[0][6]))
                response = f(db_name, request.args.to_dict())
                return response

            else:
                return jsonify({"status": 403})
        
        return inner
    return outer


@api_route.route('/api/servers',methods=['GET'])
@authentication(READ, 'servers')
def api_get_servers(db_name, args):
    servers = jdb.servers_info(db_name, args)

    return jsonify(servers)


@api_route.route('/api/exploits',methods=['GET'])
@authentication(READ, 'exploits')
def api_get_exploits(db_name, args):
    exploits = jdb.exploits_info(db_name, args)

    return jsonify(exploits)


@api_route.route('/api/files',methods=['GET'])
@authentication(READ, 'files')
def api_get_files(db_name, args):
    files = jdb.files_info(db_name, args)

    return jsonify(files)


@api_route.route('/api/users',methods=['GET'])
@authentication(READ, 'users')
def api_get_users(db_name, args):
    users = jdb.users_info(db_name, args)

    return jsonify(users)


@api_route.route('/api/logs',methods=['GET'])
@authentication(READ, 'logs')
def api_get_logs(db_name, args):
    users = jdb.logs_info(db_name, args)

    return jsonify(users)
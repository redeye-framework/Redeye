from functools import wraps
from flask import request, request, Blueprint
from flask import jsonify
from hashlib import sha256
import json
from routes.api import config as api_permissions
from routes.api import jdb
from routes.api.servers import servers_api
from routes.api.users import users_api
from routes.api.exploits import exploits_api
from routes.api.files import files_api
from routes.api.logs import logs_api

api_route = Blueprint('api', __name__)
PROJECTS = r"RedDB/Projects/{}"

READ = api_permissions.read()
WRITE = api_permissions.write()
# READ_WRITE = api_permissions.readwrite()



def authentication(access_level, resource):

    def outer(f):
        @wraps(f)
        def inner(*args, **kwargs):
            token = request.headers.get('Token')
            token_details = jdb.get_hashed_token_details(sha256(token.encode()).hexdigest())
            if not token_details:
                return jsonify({ "status" : 401 })
            
            token_details = token_details[0]
            permissions = json.loads(token_details[3])

            if api_permissions.access_level(access_level, permissions, resource, token_details[4]):
                    db_name = PROJECTS.format(jdb.get_project_filename_by_id(token_details[6]))
                    executer = jdb.get_username_by_id(token_details[5])[1]
                    if access_level == READ:
                        response = f(db_name, request.args.to_dict(), executer)
                    elif access_level == WRITE:
                        response = f(db_name, request.form.to_dict(), executer)
                    return response

            else:
                return jsonify({"status": 403})
        
        return inner
    return outer


@api_route.route('/api/servers',methods=['GET'])
@authentication(READ, 'servers')
def api_get_servers(db_name, args, _):
    servers = servers_api.servers_info(db_name, args)

    return jsonify(servers)


@api_route.route('/api/servers',methods=['POST'])
@authentication(WRITE, 'servers')
def api_new_server(db_name, args, executer):
    status = servers_api.add_new_server(db_name, args, executer)

    return jsonify(status)


@api_route.route('/api/exploits',methods=['GET'])
@authentication(READ, 'exploits')
def api_get_exploits(db_name, args, _):
    exploits = exploits_api.exploits_info(db_name, args)

    return jsonify(exploits)


@api_route.route('/api/exploits',methods=['POST'])
@authentication(WRITE, 'exploits')
def api_new_exploit(db_name, args, _):
    status = exploits_api.add_new_exploit(db_name, args)

    return jsonify(status)


@api_route.route('/api/files',methods=['GET'])
@authentication(READ, 'files')
def api_get_files(db_name, args, _):
    files = files_api.files_info(db_name, args)

    return jsonify(files)


@api_route.route('/api/users',methods=['GET'])
@authentication(READ, 'users')
def api_get_users(db_name, args, _):
    users = users_api.users_info(db_name, args)

    return jsonify(users)


@api_route.route('/api/users',methods=['POST'])
@authentication(WRITE, 'users')
def api_new_user(db_name, args, executer):
    status = users_api.add_new_user(db_name, args, executer)

    return jsonify(status)


@api_route.route('/api/logs',methods=['GET'])
@authentication(READ, 'logs')
def api_get_logs(db_name, args, executer):
    users = logs_api.logs_info(db_name, args)

    return jsonify(users)
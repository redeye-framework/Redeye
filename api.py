from functools import wraps
from flask import request, request, Blueprint
from flask import jsonify
from RedDB.db import get_tokens_details
from hashlib import sha256

api_route = Blueprint('api', __name__)


def return_json(f):
    @wraps(f)
    def inner(**kwargs):
        token = request.headers.get('Token')
        token_details = get_tokens_details(sha256(token.encode()).hexdigest())
        print(token_details)
        return jsonify(f(**kwargs))

    return inner

@api_route.route('/api/servers',methods=['GET'])
@return_json
def api_get_servers():
    return {"status":200}


@api_route.route('/api/users',methods=['GET'])
@return_json
def api_get_users():
    return {"status":200}
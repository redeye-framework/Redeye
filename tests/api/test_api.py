from requests import post, get
from urllib.parse import quote
from json import dumps
from http import HTTPStatus

class TestAPI(object):
    def __init__(self, name:str, permissions, valid_by: str) -> None:
        self.endpoint = "http://localhost:8443/add_token"
        self.name = name
        self.permissions = permissions
        self.valid_by = valid_by
        self.token = None


    def testAddAPIsToken(self, headers):   

        res = post(self.endpoint, data=self.testAddAPIData() ,headers=headers, verify=False)

        assert res.status_code == HTTPStatus.OK

        token = res.json().get('token')

        assert token

        return token


    def testAddAPIData(self):
        return f"token-name={self.name}&permissions={self.permissions}&valid_by={self.valid_by}"
    

    def setToken(self, token):
        self.token = { "Token": token, 'Content-Type': 'application/x-www-form-urlencoded' }


    def testGetQuery(self, endpoint):
        res = get(endpoint, headers=self.token, verify=False)

        return res.json(), res.status_code
    
    def testPostQuery(self, endpoint, data):
        res = post(endpoint, headers=self.token, data=data, verify=False)

        return res.json(), res.status_code


def testAPIsGetToken(headers: dict) -> str:
    from datetime import datetime, timedelta

    permissions = [ {
        'servers': {
            "read": True,
            "write": True
        },
        'users': {
            "read": True,
            "write": True
        },
        'files': {
            "read": False,
            "write": True
        },
        'exploits': {
            "read": True,
            "write": False
        },
        'logs': {
            "read": False,
            "write": False
        }
    } ]

    permissions = quote(dumps(permissions))

    valid_by = datetime.now() + timedelta(hours=1)
    format_valid_by = quote(valid_by.strftime('%d/%m/%Y %H:%M:%S'))

    apis = TestAPI("test_token", permissions=permissions, valid_by=format_valid_by)

    token = apis.testAddAPIsToken(headers)

    apis.setToken(token)

    return apis


def testAllAPIs(apiTester: TestAPI):
    servers, status_code = apiTester.testGetQuery("http://localhost:8443/api/servers")
    assert status_code == HTTPStatus.OK and not servers

    users, status_code = apiTester.testGetQuery("http://localhost:8443/api/users")
    assert status_code == HTTPStatus.OK and not users

    exploits, status_code = apiTester.testGetQuery("http://localhost:8443/api/exploits")
    assert status_code == HTTPStatus.OK and not exploits

    _, status_code = apiTester.testGetQuery("http://localhost:8443/api/files")
    assert status_code == HTTPStatus.FORBIDDEN

    _, status_code = apiTester.testGetQuery("http://localhost:8443/api/logs")
    assert status_code == HTTPStatus.FORBIDDEN

    serverMockData = "ip=1.1.1.1&name=mockServer&vendor=mockVendor"
    _, status_code = apiTester.testPostQuery("http://localhost:8443/api/servers", serverMockData)
    assert status_code == HTTPStatus.OK

    servers, status_code = apiTester.testGetQuery("http://localhost:8443/api/servers")
    exist = servers[0].get('ip') == "1.1.1.1" and servers[0].get('name') == "mockServer" and servers[0].get("vendor") == "mockVendor"
    assert status_code == HTTPStatus.OK and exist

    userMockData = "username=mockUser&password=mockPassowrd"
    _, status_code = apiTester.testPostQuery("http://localhost:8443/api/users", userMockData)
    assert status_code == HTTPStatus.OK

    users, status_code = apiTester.testGetQuery("http://localhost:8443/api/users")
    exist = users[0].get('username') == "mockUser" and users[0].get('password') == "mockPassowrd"
    assert status_code == HTTPStatus.OK and exist

    exploitMockData = "name=mockExploit&data=mockdata"
    _, status_code = apiTester.testPostQuery("http://localhost:8443/api/exploits", exploitMockData)
    assert status_code == HTTPStatus.FORBIDDEN

    exploits, status_code = apiTester.testGetQuery("http://localhost:8443/api/exploits")
    assert status_code == HTTPStatus.OK and not exploits




from requests import post
from http import HTTPStatus

class TestAuth(object):
    def __init__(self, username, password, demoDB) -> None:
        self.endpoint = "http://localhost:8443/login"
        self.username = username
        self.password = password
        self.demoDB = demoDB


    def testLogin(self):
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
        res = post(self.endpoint, data=self.testLoginData(), headers=headers, verify=False)

        assert res.status_code == HTTPStatus.OK

        cookies = res.cookies.get_dict()
        assert cookies.get('reduser') != "" or cookies.get('RedSession') != None

        auth_headers = {}
        auth_headers["Cookie"] = f"reduser={ cookies.get('reduser') };RedSession={ cookies.get('RedSession') }"
        auth_headers["Content-Type"] = "application/x-www-form-urlencoded"
        return auth_headers
    

    def testLoginData(self):
        return f"username={self.username}&password={self.password}&project={self.demoDB}"
    

def testAuthGetSession():
    auth = TestAuth("redeye", "redeye", "example.db")
    cookies = auth.testLogin()

    return cookies
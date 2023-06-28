from fire import Fire
from json import dumps
from auth import test_login
from api import test_api


def run_tests():
    cookies = test_login.testAuthGetSession()
    apiTester = test_api.testAPIsGetToken(cookies)

    test_api.testAllAPIs(apiTester)
    print("[X] Passed APIs tests")


if __name__ == '__main__':
    Fire(run_tests)
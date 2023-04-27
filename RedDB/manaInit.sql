-- Projects:
INSERT INTO projects(name, filename) VALUES ("ExampleDB", "example.db");

-- Redeye users:
INSERT INTO redeye_users(username,password, projectID) VALUES("redeye", "b51000ef0db2025c124e92cc29880418e2cefbe7fa5badd472cc32c41dfdba57", 1);


-- Redeye tokens:
-- Matching demo token -> redeye_c990f33a-4854-4c52-b71a-22dae689efd3
INSERT INTO access_tokens(name, token, permissions, valid_by, user_id, project_id) VALUES("Read access token", "41bd0f3fcdc03f6349add2376e95fe222bc58cdde0f82c06c9602f48f59d6779",'{"access_level": "READ", "auth" :{"servers":1,"users":1,"files":0,"exploits":0}}', "08/08/2023 13:21:32", 1, 1);
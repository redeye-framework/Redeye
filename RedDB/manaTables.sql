
CREATE TABLE IF NOT EXISTS redeye_users (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      username text NOT NULL,
                                      password text,
                                      profile_pic text DEFAULT "user.png",
                                      projectID INTEGER NOT NULL
                                  );
CREATE TABLE IF NOT EXISTS projects (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      filename text NOT NULL,
                                      name text NOT NULL
                                  );
CREATE TABLE IF NOT EXISTS access_tokens (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      token text NOT NULL,
                                      permissions text NOT NULL,
                                      valid_by text NOT NULL,
                                      user_id INTEGER NOT NULL,
                                      project_id INTEGER NOT NULL,
                                      FOREIGN KEY (project_id) REFERENCES projects(id)
                                  );
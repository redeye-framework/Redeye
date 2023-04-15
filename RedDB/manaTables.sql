
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
CREATE TABLE IF NOT EXISTS tokens (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      key text NOT NULL,
                                      project_id INTEGER,
                                      permissions INTEGER,
                                      validity text NOT NULL,
                                      FOREIGN KEY (project_id) REFERENCES projects(id)
                                  );
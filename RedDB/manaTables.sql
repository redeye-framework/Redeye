
CREATE TABLE IF NOT EXISTS redeye_users (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      username text NOT NULL,
                                      password text,
                                      profile_pic text DEFAULT "user.png"
                                  );
CREATE TABLE IF NOT EXISTS projects (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      filename text NOT NULL,
                                      name text NOT NULL
                                  );
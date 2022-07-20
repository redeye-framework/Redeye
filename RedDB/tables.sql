CREATE TABLE IF NOT EXISTS users (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      type INTEGER NOT NULL DEFAULT 0,
                                      username text NOT NULL,
                                      password text,
                                      permissions text NOT NULL DEFAULT '-',
                                      attain text DEFAULT "-",
                                      relevant INTEGER NOT NULL DEFAULT 1,
                                      found_on text,
                                      server_id INTEGER,
                                      device_id INTEGER,
                                      other TEXT,
                                      FOREIGN KEY(server_id) REFERENCES servers(id),
                                      FOREIGN KEY(device_id) REFERENCES netdevices(id)
                                  );
CREATE TABLE IF NOT EXISTS userTypes (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      typeName text NOT NULL
                                  );                                  
CREATE TABLE IF NOT EXISTS log (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      user_id INTEGER,
                                      task_id INTEGER,
                                      server_id INTEGER,
                                      device_id INTEGER,
                                      vuln_id INTEGER,
                                      file_id INTEGER,
                                      name text NOT NULL,
                                      date text NOT NULL,
                                      hour text NOT NULL,
                                      data text NOT NULL,
                                      executor text NOT NULL,
                                      FOREIGN KEY(user_id) REFERENCES users(id),
                                      FOREIGN KEY(task_id) REFERENCES todo(id),
                                      FOREIGN KEY(server_id) REFERENCES servers(id),
                                      FOREIGN KEY(device_id) REFERENCES netdevices(id),
                                      FOREIGN KEY(vuln_id) REFERENCES vulns(id),
                                      FOREIGN KEY(file_id) REFERENCES files(id)
                                  );
CREATE TABLE IF NOT EXISTS tasks (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      task_name text NOT NULL,
                                      is_task_done INTEGER NOT NULL,
                                      executers text NOT NULL,
                                      data text,
                                      notes text,
                                      is_private INTEGER,
                                      relevant INTEGER NOT NULL DEFAULT 1
                                  );
CREATE TABLE IF NOT EXISTS sections (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text
                                    );
CREATE TABLE IF NOT EXISTS servers (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      ip text NOT NULL,
                                      name text,
                                      vendor text,
                                      is_access INTEGER NOT NULL DEFAULT 1,
                                      attain text,
                                      relevant INTEGER NOT NULL DEFAULT 1,
                                      section_id INTEGER NOT NULL DEFAULT 1,
                                      color_id INTEGER NOT NULL DEFAULT 1,
                                      FOREIGN KEY(color_id) REFERENCES colors(id),
                                      FOREIGN KEY(section_id) REFERENCES sections(id)
                                  );
CREATE TABLE IF NOT EXISTS netdevices (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      parent_id INTEGER,
                                      ip text,
                                      type text NOT NULL,
                                      description text,
                                      attain text,
                                      relevant INTEGER NOT NULL DEFAULT 1
                                   );
CREATE TABLE IF NOT EXISTS vulns (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      data text NOT NULL,
                                      fix text NOT NULL DEFAULT '-',
                                      relevant INTEGER NOT NULL DEFAULT 1,
                                      server_id INTEGER,
                                      device_id INTEGER,
                                      FOREIGN KEY(server_id) REFERENCES servers(id),
                                      FOREIGN KEY(device_id) REFERENCES netdevices(id)
                                  );
CREATE TABLE IF NOT EXISTS files (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      path text,
                                      description text,
                                      relevant INTEGER NOT NULL DEFAULT 1,
                                      server_id INTEGER,
                                      FOREIGN KEY(server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS comments (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      data text NOT NULL,
                                      executor NOT NULL,
                                      date text NOT NULL,
                                      relevant INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS ports (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      port INTEGER NOT NULL,
                                      service text,
                                      state text NOT NULL,
                                      vuln text DEFAULT "-",
                                      server_id text,
                                      device_id text,
                                      FOREIGN KEY(server_id) REFERENCES servers(id),
                                      FOREIGN KEY(device_id) REFERENCES netdevices(id)
);
CREATE TABLE IF NOT EXISTS Achievements (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      data text NOT NULL,
                                      is_done INT NOT NULL DEFAULT 0,
                                      relevant INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS report (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      data text NOT NULL,
                                      section_name text,
                                      relevant INTEGER NOT NULL DEFAULT 1,
                                      image_path text
);
CREATE TABLE IF NOT EXISTS exploits (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      data text,
                                      file_path text DEFAULT NULL,
                                      relevant INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS notebooks (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text NOT NULL,
                                      data text,
                                      creatorId INTEGER, 
                                      isPrivate INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS colors (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name text text NOT NULL, 
                                      hexColor text NOT NULL
);
---------- PRODUCTION ----------

-- vulns:
INSERT INTO vulns(name, data, server_id) VALUES("Weak-User", "Admin user has weak password.", 1);

-- Sections:
INSERT INTO sections(name) VALUES("Network");
INSERT INTO sections(name) VALUES("DMZ");

-- Servers:
INSERT INTO servers(ip, name, is_access, section_id) VALUES("10.0.0.1",  "Webian", 1, 2);
INSERT INTO servers(ip, name, is_access) VALUES("10.0.0.2",  "AnotherServer", 1);
INSERT INTO servers(ip, name, is_access) VALUES("10.0.0.3",  "Comp-baba-01", 1);
INSERT INTO servers(ip, name, is_access) VALUES("199.0.0.56", "Unknown", 0);
INSERT INTO servers(ip, name, is_access) VALUES("199.0.0.12", "Lorem", 0);
INSERT INTO ports(port, service, state, vuln, server_id) VALUES("tcp-22", "SSH", "open", "Weak Credentials", 1);
INSERT INTO ports(port, service, state, vuln, server_id) VALUES("tcp-80", "HTTP", "open", "Weak Credentials", 1);
INSERT INTO ports(port, service, state, server_id) VALUES("tcp-445", "SMB", "Closed", 1);
INSERT INTO ports(port, service, state, vuln, server_id) VALUES("tcp-22", "SSH", "open", "Weak Credentials", 2);

-- users:
INSERT INTO users(type, server_id, username, password, permissions) VALUES(1, 1, "Admin", "Aa123123", "READ | WRITE");
INSERT INTO users(type, server_id, username, password, permissions) VALUES(1, 1, "mailUser", "Bb123123", "READ");

-- comments:
INSERT INTO comments(data, executor) VALUES("Welcome to Redeye!", "@Devs");

-- exploits:
INSERT INTO exploits(name, data) VALUES("Nmap EB Scan", "nmap -n -Pn -p445 --script <ip>")
INSERT INTO exploits(name, data) VALUES("My New Zero-Day", "exploit.exe 10.0.0.1")
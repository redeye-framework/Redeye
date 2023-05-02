from neo4j import *

import os
import sys

neoServer = "neo4j"
url = os.getenv("NEO4J_URI", "bolt://{neoServer}:7687")
username = os.getenv("NEO4J_USER", "neo4j")
password = os.getenv("NEO4J_PASSWORD", "redeye")
neo4j_version = os.getenv("NEO4J_VERSION", "4")
database = os.getenv("NEO4J_DATABASE", "Redeye")

driver = GraphDatabase.driver(url, auth=basic_auth(username, password))

#
# Servers:
# id, ip, name, is_access, sectionName
#
# users:
# username, password, perm, server_id
#
# each use will connect to his server by server_id (if exsist)
# 


# Add server node
def addServerNode(id, ip, name, is_access, sectionName, url):
    def addServer(tx):
        q = """ MERGE (server: servers {id:"%s",ip:"%s",name:"%s",is_access:"%s",sectionName:"%s",url:"%s"}) """ % (
            id, ip, name, is_access, sectionName, url)
        tx.run(q)
    
    executeWriteQuery(addServer)   

def deleteServerNode(id):
    def deleteserver(tx):
        q = """ match (server:servers) where server.id="%s" DETACH DELETE server """ % (id)
        tx.run(q)

    executeWriteQuery(deleteserver) 

def changeServerNode(id, ip=None, name=None, is_access=None, sectionName=None):
    def changeIP(tx):
        if ip:
            q = """ match (server:servers) where server.id="%s" SET server.ip="%s" """ % (id,ip)
            tx.run(q)

    def changeServerName(tx):
        if name:
            q = """ match (server:servers) where server.id="%s" SET server.name="%s" """ % (id,name)
            tx.run(q)

    def changeIsAccess(tx):
        if is_access:
            q = """ match (server:servers) where server.id="%s" SET server.is_access="%s" """ % (id,is_access)
            tx.run(q)
    
    def changeSectionName(tx):
        if sectionName:
            q = """ match (server:servers) where server.id="%s" SET server.sectionName="%s" """ % (id,password)
            tx.run(q)
    if ip:
        executeWriteQuery(changeIP)

    if name:
        executeWriteQuery(changeServerName)

    if is_access:
        executeWriteQuery(changeIsAccess)

    if password:
        executeWriteQuery(changeSectionName)

# Add user node
def addUserNode(id, username, password, perm,server_id = 0):
    def addUser(tx):
        q = """ MERGE (user: users {id:"%s", username:"%s", password:"%s", server_id:"%s", permissions:"%s"}) """ % (id,username,password,server_id,perm)
        tx.run(q)
    
    def addRelation(tx):
        if server_id:
            q = """ match (user:users), (server:servers) where user.id="%s" AND user.server_id ="%s" AND server.id ="%s" MERGE (user)-[r:userTo]->(server) return type(r) """ % (id,server_id, server_id)
            tx.run(q)
    
    executeWriteQuery(addUser)
    executeWriteQuery(addRelation)   

def deleteUserNode(id):
    def deleteUser(tx):
        q = """ match (user:users) where user.id="%s" DETACH DELETE user """ % (id)
        tx.run(q)

    executeWriteQuery(deleteUser) 

def changeUserNode(id,username=None, password=None,permissions=None, server_id=None):
    def changeUserName(tx):
        if username:
            q = """ match (user:users) where user.id="%s" SET user.username="%s" """ % (id,username)
            tx.run(q)

    def changeUserPassword(tx):
        if password:
            q = """ match (user:users) where user.id="%s" SET user.password="%s" """ % (id,password)
            tx.run(q)

    def changeUserPermission(tx):
        if permissions:
            q = """ match (user:users) where user.id="%s" SET user.permissions="%s" """ % (id,permissions)
            tx.run(q)

    def deleteUserConnection(tx):
        if server_id:
            currentServerId = getUserProperties(id)["server_id"]
            if currentServerId:
                q = """ match (user:users)-[r:userTo]->(server) where user.id="%s" AND user.server_id="%s" AND server.id="%s" delete r""" % (id, currentServerId, currentServerId)
                tx.run(q)

    def ConnectUserConnection(tx):
        if server_id:
            q = """ match (user:users), (server:servers) where user.id="%s" AND server.id ="%s" MERGE (user)-[r:userTo]->(server) return type(r) """ % (id, server_id)
            tx.run(q)


    executeWriteQuery(changeUserName)
    executeWriteQuery(changeUserPassword)
    executeWriteQuery(changeUserPermission)
    # Need to fix that
    #executeWriteQuery(deleteUserConnection)
    executeWriteQuery(ConnectUserConnection)


def getUserProperties(id):
    def getProp(tx,_):
        q = """ MATCH (user:users) WHERE user.id="%s" RETURN properties(user) """ % (id)
        return tx.run(q).data()
    
    return executeReadQuery(getProp,id)[0]['properties(user)']


def executeWriteQuery(func):
    with driver.session() as session:
        session.write_transaction(func)

    driver.close()


def executeReadQuery(func, obj):
    with driver.session() as session:
        res = session.read_transaction(func, obj)

    driver.close()

    return res

def init():
    def query(tx):
        q = "CREATE (servers), (users)"
        tx.run(q)

    executeWriteQuery(query)


def test():
    pass
    #addServerNode(220,"5.5.5.5","new",1,"newSection", "https://dsadsa/dsdsa")
    #addServerNode(221,"6.5.5.5","new",1,"newSection", "https://dsadsa/dsdsa")
    #addUserNode(250,"admin", "123231", 220)
    #addUserNode(251,"admin", "123231", 221)
    #########################################################################
#
    #changeUserNode(220,username="elad")
    #changeUserNode(221,password="ABC")
    ##changeUserNode(208,server_id=216)
    #
    #########################################################################
#
    #changeServerNode(221, ip="1.2.3.4")
    #changeServerNode(221, name="localhost")
    #changeServerNode(221, is_access=0)
    #changeServerNode(221, sectionName="lolllll")
#
    #########################################################################
#
    #deleteServerNode(220)
    #deleteServerNode(221)
    #deleteUserNode(250)
    #deleteUserNode(251)


if __name__ == '__main__':
    test()

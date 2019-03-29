# -*- coding: utf-8 -*-
import telnetlib
import sys
reload(sys)
# sys.set
import time
import pymongo
import socket

# call `python InstallAgent.py ip_client`  de cai dat agent vao route co ip_client

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


def getDeviceInfo(HOST):
    # HOST = HOST[HOST.rfind(':') + 1:]
    client = pymongo.MongoClient("localhost", 27017)
    db = client.AGENT
    data = db.device_auth.find_one({"ip_address": HOST})
    print(data)
    return data["ip_address"], data["port"], data["user"], data["pass"], data["arch"]

def install(HOST, PORT, USER, PASSWORD, ARCH):
    # print(USER)
    # print(PASSWORD)
    localIP = get_ip()
    try:
        telnet = telnetlib.Telnet(HOST, 23)
        telnet.read_until("ogin: ")
        telnet.write(str(USER) + "\n")
        if PASSWORD != "":
            telnet.read_until("assword: ")
            telnet.write(str(PASSWORD) + "\n")
        telnet.write("sh\n")
        telnet.write("cd /tmp\n")
        if str(ARCH).lower() == "arm":
            telnet.write('wget http://' + localIP + '/ARM/agent_arm.sh\n')
            telnet.write('chmod +x agent_arm.sh\n')
            telnet.write('sh agent_arm.sh\n')
        else:
            if str(ARCH).lower() == "mips32":
                telnet.write('wget http://' + localIP + '/MIPS32/agent_MIPS32.sh\n')
                telnet.write('chmod +x agent_MIPS32.sh\n')
                telnet.write('sh agent_MIPS32.sh\n')
            else:
                if str(ARCH).lower() == "mips":
                    telnet.write('wget http://' + localIP + '/MIPS/agent_MIPS.sh\n')
                    telnet.write('chmod +x agent_MIPS.sh\n')
                    telnet.write('sh agent_MIPS.sh ' + localIP + "\n")
        
        telnet.write("exit\n")
        telnet.read_all()
        telnet.close()
    except Exception as identifier:
        print(identifier)
    finally:
        pass
    
    # 
    print('end..')

if __name__ == '__main__':
    HOST, PORT, USER, PASSWORD, ARCH = getDeviceInfo(sys.argv[1])
    
    install(HOST, PORT, USER, PASSWORD, ARCH)

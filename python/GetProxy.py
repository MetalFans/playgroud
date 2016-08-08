import requests
from requests import exceptions
import re
from fake_useragent import UserAgent
from bs4 import BeautifulSoup
import math

def count(soup):
    buttons = soup.findAll(attrs={"type" : "submit"})
    button = [ele['value'] for ele in buttons if "Download" in ele['value']][0]
    size = int(re.search('.*\((\d+)\).*', button).group(1))
    pages = int(math.ceil(size/30.0))
    return pages

def proxyList(n, Uptime = 0):
    result = []
    url = 'http://gatherproxy.com/proxylist/anonymity/?t=elite'
    ua = UserAgent()
    limit = n
    for index in xrange(n):
        header = {
            "User-Agent":ua.chrome
        }
        data =  {
            "Type":"elite",
            "PageIdx":str(index+1),
            "Uptime":str(Uptime)
        }
        if limit >= index+1:
            try:
                r = requests.post(url, headers=header, data=data, timeout=5)
                soup = BeautifulSoup(r.text, 'html.parser')
                limit = count(soup)
                temp = ''.join([ele.text for ele in soup.select('script') if 'document.write' in ele.text])
                templist = temp.replace('))',')),')[0:-1].split(',')
                for ele in templist:
                    ipandport = re.search("(\d+\.\d+\.\d+\.\d+).*gp.dep.*\'(.*)\'",ele)
                    proxy = "http://%s:%d" %(ipandport.group(1), int(ipandport.group(2),16))
                    result.append(proxy)
            except (exceptions.Timeout, exceptions.ConnectionError):
                pass
        else:
            break
    return result

print proxyList(1, Uptime=100)
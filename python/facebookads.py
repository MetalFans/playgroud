# -*- coding: utf-8 -*-
import requests
import json
import re
#查詢的東西
q = '高爾夫球'
#性別
gender = 0
ageMin = 18
ageMax = 65
token1 = 'EAACNHgqxsD8BAGAZAlZBcZBZC5wXZAnO4WhkfzUeRg8CRvgB1fn3yUJY5a9u1MkI3OJDqZBOZA0Pjq3TamDscgIYJVgNZAsZB2PvjFncZCTlb7rbaMxbhO2PGc8DUBsBL7GtgjiZCCZCnjsSVxRjiDntxe22UofKlidLz22qBFpRu78fZBDlLwhz4f3eZA'
token2 = 'EAAI4BG12pyIBAKVVW93DvA0ZCCQwLdZA4LWZAtLazFxhvdpbjcqMMnjnP5TsLQoP3s1oTAoJYJw69Wuj2jKDpsXcnNbjhAeTCt41FP04XM8YcSAh5ibKAxnHr2OIwZAFTBFtk1omvWBVJnHKs9serxF1CgwthDbFTFZBjwOdBswZDZD'

header ={
    'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
}
#為符合fb的格式而建立一個空list, 用來把性別放進去
genderShell = []
genderDict = {0: '所有', 1: '男性', 2: '女性'}
#送出查詢請求
url = 'https://graph.facebook.com/v2.5/act_135203665/targetingsearch?_reqName=path%3A%2Fact_135203665%2Ftargetingsearch&_reqSrc=AdsDaoGraphDataProvider&access_token={}&accountId=135203665&endpoint=%2Fact_135203665%2Ftargetingsearch&locale=zh_TW&method=get&pretty=0&q={}&suppress_http_code=1'
res = requests.get(url.format(token1, q), headers = header, verify=False)
#實際比對到的東西
actualName = json.loads(res.text)['data'][0]['name'].encode('utf-8')
#從查詢的回應中取得第一筆也就是比對最接近的結果id
qid = json.loads(res.text)['data'][0]['id']
print qid
#建立查詢字典
interest = {"geo_locations":{"countries":["TW"],"location_types":["home","recent"]},"age_min":"","age_max":"","page_types":["mobilefeed","desktopfeed"],"flexible_spec":[{"interests":[{"id":"","name":""}]}]}
#將查詢條件寫入字典
interest['flexible_spec'][0]['interests'][0]['id'] = qid
interest['flexible_spec'][0]['interests'][0]['name'] = q
interest['age_min'] = ageMin
interest['age_max'] = ageMax
if gender != 0:
    genderShell.append(gender)
    interest['genders'] = genderShell
#準備送人數估計的請求，先把targeting_spec挖空等著把前面建的字典塞進去
sizereq = 'https://graph.facebook.com/v2.4/act_188228074654437/reachestimate?_reqName=adaccount/reachestimate&_reqSrc=AdsCFAudienceEstimateUtils&access_token={}&bid_for=["conversion"]&callback=__globalCallbacks.f30157a059eae7c&currency=TWD&locale=zh_TW&method=get&pretty=0&targeting_spec={}'
#用dumps把字典轉為字串丟進去洞裡面，送出請求
resSize = requests.get(sizereq.format(token2, json.dumps(interest)), headers = header, verify=False)
#萃取回應中json格式的內容
result = re.search('{.*}',resSize.text)
finalResult = json.loads(result.group(0))
#取得人數
users = finalResult['users']
print '%d-%d歲族群中%s的「%s」潛在喜愛者有%s人' % (ageMin, ageMax, genderDict[gender], actualName, users)
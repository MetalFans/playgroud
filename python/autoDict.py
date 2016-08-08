# -*- coding: utf-8 -*-
import time
import numpy as np
import operator
from collections import Counter
import os

if not os.path.exists('./Workspace/data/dictionary'):
    os.makedirs('./Workspace/data/dictionary')


#計算entropy，偷來改的，懶得改輸入型態，他是設計成list輸入，可一次輸出多Ngram的entropy，我只用單值
def entropy(n_gram_lengths, text):
    entropies = {}
    #可逐一將list的n代入，不過我都一次只丟一個n進去
    for n in n_gram_lengths:
        #開始做n-gram
        length_n_substrings = [text[i:i+n] for i in range(len(text)-n+1)]
        #計算字頻
        length_n_substring_counts = Counter(length_n_substrings)
        #斷出來的總數
        normalizer = float(len(length_n_substrings))
        #標準化
        distribution_values = np.array(length_n_substring_counts.values()) / normalizer
        #計算entropy
        entropy = -np.sum(p*np.log2(p) for p in distribution_values)
        #把結果丟進list
        entropies[n] = entropy
    #輸出
    return entropies


def getwords(news, minN = 2, maxN = 4, freq = 5, threshold = 0.0001, name = 'domain'):
    start = time.strftime("%Y%m%d", time.localtime())
    with open('./Workspace/data/dictionary/autodict_%s_%s.txt' % (name, start), 'a') as f:
        #獲取一整頁的文章
        #斷句
        sp = news.split()
        #跑2-gram至4-gram
        for n in xrange(minN, maxN+1):
            #存字頻的字典
            substring_counts_dict = {}
            #逐句做n-gram
            for s in sp:
                sentence_substrings = [s[i:i+n] for i in range(len(s)-n+1)]
                #計算字頻
                for word in sentence_substrings:
                    if word not in substring_counts_dict:
                        substring_counts_dict[word] = 1
                    else:
                        substring_counts_dict[word] += 1
            #字頻排序
            word_freq = sorted(substring_counts_dict.iteritems(),key=operator.itemgetter(1),reverse=True)
            #計算完整entropy
            org = entropy([n], news).values()[0]
            #空字典，拿來存排除斷詞後的entropy
            word_entropy = {}
            #留下字頻大於5的斷詞
            word_freq = [w for w in word_freq if w[1] >= freq]
            #分別將斷詞結果刪除，計算entropy
            for w in word_freq:
                word_entropy[w[0]] = entropy([n], news.replace(w[0],'')).values()[0]
            #用entropy排序
            weighted_world = sorted(word_entropy.iteritems(),key=operator.itemgetter(1),reverse=False)
            #逐一檢查篩選後之斷詞結果，留下entropy變化比例>=0.0001的結果
            for keyword in weighted_world:
                if (org-keyword[1])/org >= threshold:
                    f.write('%s%s' % (keyword[0].encode('utf-8'), '\n'))
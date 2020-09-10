#!/usr/bin/env python
# coding: utf-8

# In[1]:

import sys
# print(sys.path)
sys.path.append("/home/prakharnmehta/.local/lib/python3.8/site-packages")

import numpy as np
# print("hi")
import pandas as pd
import nltk
#nltk.download('punkt') # one time execution
#nltk.download("stopwords")
import re
#f=open(r"C:/Users/Anish Bhagat/Desktop/internship/Excerpt1.txt","r")


# In[3]:


f=open("/home/prakharnmehta/Documents/Projects/HCI-Project/scripts/New Text Document.txt", "r")


# In[4]:


para=f.read().split('\n\n')


# In[5]:


l=[]
t=0
for i in para:
    l.append([])
    l[t]=i.split('.')
    t=t+1


# In[6]:


import string
sent=[]
a=0
for par in para:
    sent.append([])
    sent[a].append(par.split('.'))
sen=[]
for p in sent:
    for y in p:
        for q in y:
            if q and q !=  'S':
                myList = [item for item in q.split('\n')]
                newString = ' '.join(myList)
                sen.append(newString)
sentence=""
for p in sen:
    sentence+=p+". "
# print(sentence)


# In[7]:


from nltk.tokenize import sent_tokenize
s=sent_tokenize(sentence)


# In[8]:


# print(s)


# In[9]:


word_embeddings = {}
f = open("/home/prakharnmehta/Documents/Projects/HCI-Project/scripts/New Text Document.txt", "r")
for line in f:
    values = line.split()
    word = values[0]
    coefs = np.asarray(values[1:])
    word_embeddings[word] = coefs
f.close()


# In[10]:


# remove punctuations, numbers and special characters
clean_sentences = pd.Series(s).str.replace("[^a-zA-Z]", " ")

# make alphabets lowercase
clean_sentences = [s.lower() for s in clean_sentences]


# In[11]:


from nltk.corpus import stopwords
stop_words=stopwords.words('english')
d = []
stop_words.append(i for i in d)


# In[12]:


def stop(sen):
    sen=" ".join([i for i in sen if i not in stop_words])
    return sen


# In[13]:


clean=[stop(r.split())for r in s]


# In[14]:


sentence_vectors = []
for i in clean_sentences:
    if len(i) != 0:
        v = sum([word_embeddings.get(w, np.zeros((100,))) for w in i.split()])/(len(i.split())+0.001)
    else:
        v = np.zeros((100,))
    sentence_vectors.append(v)


# In[15]:


# similarity matrix
sim_mat = np.zeros([len(s), len(s)])


# In[16]:


from sklearn.metrics.pairwise import cosine_similarity


# In[17]:


for i in range(len(s)):
  for j in range(len(s)):
    if i != j:
      sim_mat[i][j] = cosine_similarity(sentence_vectors[i].reshape(1,100), sentence_vectors[j].reshape(1,100))[0,0]


# In[18]:


import networkx as nx

nx_graph = nx.from_numpy_array(sim_mat)
scores = nx.pagerank(nx_graph)


# In[19]:


ranked_sentences = sorted(((scores[i],s) for i,s in enumerate(s)), reverse=True)


# In[20]:

ans=""
#Extract top 10 sentences as the summary
for i in range(10):
    ans+=ranked_sentences[i][1]
#   print(ranked_sentences[i][1])
  


# In[21]:


summ = []
for i in range(10):
    summ.append(ranked_sentences[i][1])
for i in s:
    if i in summ:
        ans+=i
        # print(i)
print(ans)

# In[ ]:





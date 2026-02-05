import json
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
import random
import time
from fastapi.middleware.cors import CORSMiddleware

def get_word(path):
    with open(path,"r",encoding="utf-8") as f:
        words=json.load(f)
    return words

solutions=get_word("solutions.json")
all_words=get_word("non_solutions.json")+solutions
good_words=get_word("good_words.json")
pow3=[3**i for i in range(5)]

def check(word,ans):
    #print(word,ans)
    res=0
    cnt=[0]*26
    for i in range(5):
        if word[i]==ans[i]:
            res+=pow3[i]*2
        else:
            cnt[ord(ans[i])-97]+=1
    for i in range(5):
        if word[i]!=ans[i]:
            k=ord(word[i])-97
            if cnt[k]>0:
                res+=pow3[i]
                cnt[k]-=1
    return res

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 주소 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pair(BaseModel):
    word:str
    result:int

class Req(BaseModel):
    pairs:list[Pair]
    start:int

@app.post("/api/get_candidate")
def get_candidate(req:Req):
    condition=[(p.word, p.result) for p in req.pairs]
    candidates,nxt_start=calculate_candidate(condition,req.start)
    return {"candidates":candidates,"nxt_start":nxt_start,"has_more":nxt_start<len(solutions)}
    
def calculate_candidate(condition,start=0,page_size=20):
    res=[]
    last=start
    for i in range(start,len(solutions)):
        last=i
        flag=0
        for word,result in condition:
            if check(word,solutions[i])!=result:
                flag=1
                break
        if flag==0:
            res.append(solutions[i])
        if len(res)==page_size:
            break
    nxt_start=min(len(solutions),last+1)
    return res,nxt_start

def get_all_candidate(condition):
    res,nxt_start=calculate_candidate(condition,0,-1)
    return res

def get_score(word,candidate):
    cnt=[0]*(3**5)
    for i in candidate:
        cnt[check(word,i)]+=1
    res=0
    for i in cnt:
        res+=i*i
    return res

@app.post("/api/get_recommendation")
def get_recommendation(req:Req):
    condition=[(p.word, p.result) for p in req.pairs]
    res=calculate_recommendation(condition)
    return {"recommendation":res}

def calculate_recommendation(condition,top=10):
    candidate=get_all_candidate(condition)
    if len(candidate)==1:
        return [candidate[0]]
    if len(candidate)==0:
        return []
    m=min(len(good_words),25000//len(candidate))
    line=[]
    for i in range(m):
        cur=good_words[i]
        line.append([get_score(cur,candidate),cur])
    line.sort()
    line=[i[1] for i in line[:top]]
    return line

def f(ans):
    cnt=0
    condition=[]
    while True:
        cnt+=1
        word=calculate_recommendation(condition)[0]
        res=check(word,ans)
        if word==ans:
            break
        condition.append([word,res])
    return cnt

if __name__=="__main__":
    for i in range(30):
        p=random.randrange(len(solutions))
        query_cnt=f(solutions[p])
        print(solutions[p],query_cnt)










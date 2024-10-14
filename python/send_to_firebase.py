import json
import time
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase Admin SDK 인증 설정
cred = credentials.Certificate('firebase_admin_sdk.json')
firebase_admin.initialize_app(cred)


# Firestore 클라이언트 초기화
db = firestore.client()

  # id: string;
  # "name": string;
  # title: string;
  # url: string;
  # likeCount: number;
  # isLiked: boolean;
  # tags: string[];

with open("converted.txt", 'r') as file:
    i=0
    for item in file:
      # if (i<213):
      #   i+=1
      #   continue
      if i%10==0:
        print(i,"개 완료",sep="")
      # print("요청완료")
      item = json.loads(item.replace("'", '"'))
      # print(item)
      res = db.collection('cats').document(item["id"]).set(item)
      # print(res)
      i+=1
# data = {
#   "id": "sdf",
#   "breed_id": "item[",
#   "name": "DSf",
#   "title": "sdfsaef",
#   "isLiked": False,
#   "tags": ["tags"],
#   "likesCount": 0,
# }

# db.collection('cats').document(data["id"]).set(data)
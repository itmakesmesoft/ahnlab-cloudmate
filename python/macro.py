import requests
import json
from copy import deepcopy

# def get_breedlist_as_file():
#   result = []
#   for i in range(len(data)):
#     id = data[i]["id"]
#     name = data[i]["name"]
#     result.append({"id":id, "name":name})

#   with open("breed_ids.txt", 'w') as file:
#     for item in result:
#       file.write(str(item) + "\n")

breed_ids = [
  { "id": "abys", "name": "Abyssinian" },
  { "id": "aege", "name": "Aegean" },
  { "id": "abob", "name": "American Bobtail" },
  { "id": "acur", "name": "American Curl" },
  { "id": "asho", "name": "American Shorthair" },
  { "id": "awir", "name": "American Wirehair" },
  { "id": "amau", "name": "Arabian Mau" },
  { "id": "amis", "name": "Australian Mist" },
  { "id": "bali", "name": "Balinese" },
  { "id": "bamb", "name": "Bambino" },
  { "id": "beng", "name": "Bengal" },
  { "id": "birm", "name": "Birman" },
  { "id": "bomb", "name": "Bombay" },
  { "id": "bslo", "name": "British Longhair" },
  { "id": "bsho", "name": "British Shorthair" },
  { "id": "bure", "name": "Burmese" },
  { "id": "buri", "name": "Burmilla" },
  { "id": "cspa", "name": "California Spangled" },
  { "id": "ctif", "name": "Chantilly-Tiffany" },
  { "id": "char", "name": "Chartreux" },
  { "id": "chau", "name": "Chausie" },
  { "id": "chee", "name": "Cheetoh" },
  { "id": "csho", "name": "Colorpoint Shorthair" },
  { "id": "crex", "name": "Cornish Rex" },
  { "id": "cymr", "name": "Cymric" },
  { "id": "cypr", "name": "Cyprus" },
  { "id": "drex", "name": "Devon Rex" },
  { "id": "dons", "name": "Donskoy" },
  { "id": "lihu", "name": "Dragon Li" },
  { "id": "emau", "name": "Egyptian Mau" },
  { "id": "ebur", "name": "European Burmese" },
  { "id": "esho", "name": "Exotic Shorthair" },
  { "id": "hbro", "name": "Havana Brown" },
  { "id": "hima", "name": "Himalayan" },
  { "id": "jbob", "name": "Japanese Bobtail" },
  { "id": "java", "name": "Javanese" },
  { "id": "khao", "name": "Khao Manee" },
  { "id": "kora", "name": "Korat" },
  { "id": "kuri", "name": "Kurilian" },
  { "id": "lape", "name": "LaPerm" },
  { "id": "mcoo", "name": "Maine Coon" },
  { "id": "mala", "name": "Malayan" },
  { "id": "manx", "name": "Manx" },
  { "id": "munc", "name": "Munchkin" },
  { "id": "nebe", "name": "Nebelung" },
  { "id": "norw", "name": "Norwegian Forest Cat" },
  { "id": "ocic", "name": "Ocicat" },
  { "id": "orie", "name": "Oriental" },
  { "id": "pers", "name": "Persian" },
  { "id": "pixi", "name": "Pixie-bob" },
  { "id": "raga", "name": "Ragamuffin" },
  { "id": "ragd", "name": "Ragdoll" },
  { "id": "rblu", "name": "Russian Blue" },
  { "id": "sava", "name": "Savannah" },
  { "id": "sfol", "name": "Scottish Fold" },
  { "id": "srex", "name": "Selkirk Rex" },
  { "id": "siam", "name": "Siamese" },
  { "id": "sibe", "name": "Siberian" },
  { "id": "sing", "name": "Singapura" },
  { "id": "snow", "name": "Snowshoe" },
  { "id": "soma", "name": "Somali" },
  { "id": "sphy", "name": "Sphynx" },
  { "id": "tonk", "name": "Tonkinese" },
  { "id": "toyg", "name": "Toyger" },
  { "id": "tang", "name": "Turkish Angora" },
  { "id": "tvan", "name": "Turkish Van" },
  { "id": "ycho", "name": "York Chocolate" },
]

'''
db 자료구조
{
  id: string;
  "name": string;
  title: string;
  url: string;
  likeCount: number;
  isLiked: boolean;
  tags: string[];
}
'''
def read_data(filepath):
  data = []
  with open(filepath, 'r') as file:
    data = file.readlines()
  return deepcopy(data)

def convert_data(data):
  print(data)
  converted = []
  for item in data:
    item = item.replace("'", '"')
    item = json.loads(item)
    name = get_breed_name(item["breedId"])
    converted.append({"id":item["id"], "breedId": item["breedId"], "url": item["url"], "title": "", "name": name, "tags": [], "isLiked": False, "likesCount": 0})
  return converted


def get_breed_name(breed_id:str):
  for item in breed_ids:
    if item["id"] == breed_id:
      return item["name"]



def append_breed_id(arr, breed_id):
  for item in arr:
    item["breedId"] = breed_id # breed_id를 추가
  return deepcopy(arr)

# api로 받는 데이터 형식
# [{'id': '9x1zk_Qdr', 'url': 'https://cdn2.thecatapi.com/images/9x1zk_Qdr.jpg', 'width': 1204, 'height': 1107}]

def get_images(breed_list):
  API_HOST = 'https://api.thecatapi.com/v1/images/search?limit=10&size=thumb&mime_types=jpg&breed_ids='
  for item in breed_list:
    breed_id = item["id"]
    api = API_HOST + breed_id
    headers = {
      "x-api-key": "live_f226Rvx4cp6S6MbMp2B4RliAqn8MgjNpy1kFer7lcpEEoxFm2bi5Zxq7iIJXRBSb", "Content-Type": "application/json",
    }
    # print(api, headers)
    result = []
    for _ in range(10):
      response = requests.get(api, headers=headers)
      data = response.json()
      print("data", data)
      # data["breed_id"] = breed_id
      result += data
    print(breed_id, "완료")
    save_array_as_file(result)
    # convert_data(result)


def save_array_as_file(arr, filepath="imageData.txt"):
  with open(filepath, 'a') as file:
    for item in arr:
      file.write(str(item) + "\n")
  file.close()

def get_low_images(filepath):
  datas = read_data(filepath)
  result = []
  for data in datas:
    item = data.replace("'", '"')
    item = json.loads(item)
    if item["width"] <1000 and item["height"] <1000:
      print(item)
      result.append(item)
  save_array_as_file(result, "lowData.txt")


# save_array_as_file(convert_data(read_data("imageData.txt")), "converted.txt")
# get_images(breed_ids)
# get_low_images("imageData.txt")
save_array_as_file(convert_data(read_data("lowData.txt")), "lowDataResult.txt")
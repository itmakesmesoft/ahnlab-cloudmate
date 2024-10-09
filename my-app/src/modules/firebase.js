import { initializeApp } from "firebase/app";
import {
  getFirestore,
  orderBy,
  startAfter,
  endAt,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
  where,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Firebase 앱 초기화
initializeApp(firebaseConfig);
const database = getFirestore();

export const submitPost = async (id, data) => {
  const postRef = doc(database, "cats", id); // 문서 참조 생성
  return await setDoc(postRef, { ...data }, { merge: true });
};

export const getPost = async (id) => {
  const postRef = doc(database, "cats", id); // 문서 참조 생성
  const docSnap = await getDoc(postRef); // 문서 데이터 가져오기
  if (docSnap.exists()) return docSnap.data(); // 문서 데이터
};

export const getPosts = async ({
  breedId = null,
  page = null,
  limitValue = 10,
}) => {
  let baseQuery = query(collection(database, "cats"), limit(limitValue));

  console.log("breedID", breedId);
  if (breedId) {
    baseQuery = query(
      baseQuery,
      where("breed_id", "==", breedId),
      orderBy("tags") // 정렬 조건 추가
    );
  } else {
    baseQuery = query(baseQuery, orderBy("tags"));
  }

  if (page) {
    baseQuery = query(baseQuery, startAfter(page));
  }

  const datas = await getDocs(baseQuery);

  const convert = datas.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return convert;
};

export const searchCat = async (keyword) => {
  const q = query(
    collection(database, "cats"),
    orderBy("tags"), // 제목 정렬
    startAt(keyword),
    endAt(keyword + "\uf8ff")
  );
  const data = await getDocs(q);
  data.docs.map((item) => console.log(item.data()));
  return data.docs;
};

export const likePost = async (id) => {
  const postRef = doc(database, "cats", id);
  const current = await getDoc(postRef);
  return await updateDoc(postRef, { like: !current }).then(() =>
    console.log("like 완료")
  );
};

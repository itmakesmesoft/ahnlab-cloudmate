import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  orderBy,
  startAfter,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
  where,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';

let lastVisible: DocumentData | undefined | number;
let breedId: string | undefined;
let keyword: string | undefined;

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Firebase 앱 초기화
initializeApp(firebaseConfig);
const database = getFirestore();

export interface ImageDataInterface {
  id: string;
  title: string;
  breedId: string;
  likesCount: number;
  isLiked: boolean;
  url: string;
  tags: string[];
}

// 글 수정 등록
export const submitPost = async (formData: ImageDataInterface) => {
  const postRef = doc(database, 'cats', formData.id); // 문서 참조 생성
  console.log(formData);
  return await setDoc(postRef, { ...formData }, { merge: true });
};

// 데이터 가져오기
export const getPost = async (id: string) => {
  const postRef = doc(database, 'cats', id);
  const docSnap = await getDoc(postRef);
  if (docSnap.exists()) return docSnap.data();
};

// 데이터 여러개 가져오기
export const getPosts = async (props: {
  breedId?: string;
  keyword?: string;
}) => {
  let q = query(collection(database, 'cats'));

  // 필터가 변경되거나 키워드가 변경된 경우, lastVisible 초기화
  if (props.breedId !== breedId || props.keyword !== keyword) {
    lastVisible = undefined;
  }

  // breedId 필터링
  if (props.breedId !== '' && props.breedId !== undefined) {
    q = query(q, where('breedId', '==', props.breedId));
  }

  // keyword 필터링
  if (props.keyword !== '' && props.keyword !== undefined) {
    q = query(q, where('tags', 'array-contains', props.keyword));
  }

  // 만약 필터나 검색어가 변경되지 않은 상태에서 마지막 데이터인 경우 빈 배열 반환
  if (
    lastVisible === -1 &&
    props.keyword === keyword &&
    props.breedId === breedId
  ) {
    return [];
  } else if (lastVisible) {
    q = query(q, orderBy('breedId'), limit(9), startAfter(lastVisible));
  } else {
    q = query(q, orderBy('breedId'), limit(9));
  }
  const snapshot = await getDocs(q);

  if (snapshot.docs.length === 0) {
    lastVisible = -1;
  } else {
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
  }
  keyword = props.keyword;
  breedId = props.breedId;
  return convertData(snapshot);
};

// 데이터 변환
const convertData = (snapshot: DocumentData) => {
  const convert = snapshot.docs.map((doc: DocumentData) => ({
    id: doc.id,
    ...doc.data(),
  })) as ImageDataInterface[];
  return convert;
};

// 게시글 좋아요
export const likePost = async (id: string) => {
  const postRef = doc(database, 'cats', id);
  const post = await getDoc(postRef).then((res) => res.data());
  if (!post) return false;
  const isLiked = !post.isLiked;
  return await updateDoc(postRef, {
    isLiked: isLiked,
    likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
  }).then(() => true);
};

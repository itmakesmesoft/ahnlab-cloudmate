const API_URL = "https://api.thecatapi.com/v1/images";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };
const LIMIT = 9;

export const getImageList = async ({ breedId = null, page = 0 }) => {
  const url = `${API_URL}/search?size=thumb&mime_types=jpg&limit=${LIMIT}&page=${page}${breedId ? `&breed_ids=${breedId}` : ""}`;

  try {
    const response = await fetch(url, { headers: DEFAULT_HEADERS });
    return response.json();
  } catch (error) {
    console.error("이미지 리스트를 불러오는 데 실패했습니다:", error);
    return [];
  }
};

export const getImageDetail = async (id: string) => {
  try {
    const url = `${API_URL}/${id}`;
    const response = await fetch(url, { headers: DEFAULT_HEADERS });
    return response.json();
  } catch (error) {
    console.error("이미지 상세정보를 불러오는 데 실패했습니다:", error);
    return [];
  }
};

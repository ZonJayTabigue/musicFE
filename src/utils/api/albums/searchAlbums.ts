import { Album, ErrorWithResponse } from "@/utils/constants/interfaces";
import axios from "axios";

const baseURI = process.env.NEXT_PUBLIC_API_URL;

async function searchAlbums(searchParam: string, page: number, limit: number): Promise<Album[] | null> {
  try {
    const response = await axios.get(`${baseURI}/albums/search`, {
      params: { 
        searchParam,
        page,
        limit
      },
    });
    return response.data;
  } catch (e: unknown) {
    const error = e as ErrorWithResponse;
    console.error("Error fetching albums:", error.message || 'Unknown error');
    return null; // Return null in case of error
  }
}

export { searchAlbums };

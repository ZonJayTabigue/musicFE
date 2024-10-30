import axios from "axios";
import { Album, ErrorWithResponse } from "@/utils/constants/interfaces";

const baseURI = process.env.NEXT_PUBLIC_API_URL;

async function getAlbum(id: number): Promise<Album | null> {
  try {
    const response = await axios.get(`${baseURI}/albums/${id}`);
    return response.data;
  } catch (e: unknown) {
    const error = e as ErrorWithResponse;
    console.error("Error fetching album:", error.message || 'Unknown error');
    return null; // Return null in case of error
  }
}

export { getAlbum };

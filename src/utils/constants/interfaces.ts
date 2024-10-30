export interface Track {
   title: string;
   duration: string;
   preview: string;
 }
 
 export interface Album {
   id: number;
   album_cover_image: string;
   album_cover_small: string;
   album_cover_medium: string;
   album_cover_big: string;
   album_cover_xl: string;
   album_title: string;
   artist_name: string;
   release_date: string;
   tracks: Track[];
 }

 export interface ErrorWithResponse extends Error {
   response?: { message: string; status: number };
 }
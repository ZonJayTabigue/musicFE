import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Album } from '@/utils/constants/interfaces';

interface AlbumState {
  albums: Album[];
}

const initialState: AlbumState = {
  albums: [],
};

const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<Album[]>) => {
      state.albums = action.payload;
    },
    addAlbums: (state, action: PayloadAction<Album[]>) => {
      state.albums = [...state.albums, ...action.payload];
    },
  },
});

export const { setAlbums, addAlbums } = albumSlice.actions;

export default albumSlice.reducer;

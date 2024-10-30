import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Album } from '@/utils/constants/interfaces';

interface AlbumsState {
  albums: Album[];
}

const initialState: AlbumsState = {
  albums: [],
};

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setAlbums(state, action: PayloadAction<Album[] | null>) {
      state.albums = action.payload ?? []; // Default to empty array if undefined
    },
  },
});

export const { setAlbums } = albumsSlice.actions;
export default albumsSlice.reducer;

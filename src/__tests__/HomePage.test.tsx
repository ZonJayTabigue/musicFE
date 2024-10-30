import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '@/store/store';
import HomePage from '@/app/page';
import { setAlbums } from '@/store/slices/albumSlice';
import { Album } from '@/utils/constants/interfaces';

// Mock data for testing
const mockAlbums: Album[] = [
  {
    id: 1,
    album_cover_big: 'https://example.com/cover_big.jpg',
    album_title: 'Album Title 1',
    artist_name: 'Artist 1',
    release_date: '2024-01-01',
    album_cover_image: 'https://example.com/cover_image.jpg',
    album_cover_small: 'https://example.com/cover_small.jpg',
    album_cover_medium: 'https://example.com/cover_medium.jpg',
    album_cover_xl: 'https://example.com/cover_xl.jpg',
    tracks: [
      {
        title: 'Track 1',
        duration: '180',
        preview: '',
      },
      {
        title: 'Track 2',
        duration: '200',
        preview: '',
      },
    ],
  },
];

jest.mock('../utils/api/albums/getAll', () => ({
  getAllAlbums: jest.fn().mockImplementation(() =>
    new Promise((resolve) => setTimeout(() => resolve(mockAlbums), 100))
  ),
}));

jest.mock('../utils/api/albums/searchAlbums', () => ({
  searchAlbums: jest.fn().mockImplementation(() =>
    new Promise((resolve) => setTimeout(() => resolve(mockAlbums), 100))
  ),
}));

const renderHomePage = () =>
  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

describe('HomePage Component', () => {
  afterEach(() => {
    store.dispatch(setAlbums([]));
  });

  test('renders the homepage title', () => {
    renderHomePage();
    expect(screen.getByText(/Albums/i)).toBeInTheDocument();
  });

  test('renders search input and button', () => {
    renderHomePage();
    expect(screen.getByPlaceholderText('Search albums or artists...')).toBeInTheDocument();
  });

  test('loads albums on initial render', async () => {
    renderHomePage();

    await waitFor(() => {
      mockAlbums.forEach((album) =>
        expect(screen.getByText(album.album_title)).toBeInTheDocument()
      );
    });
  });

  test('performs search and displays results', async () => {
    renderHomePage();

    const searchInput = screen.getByPlaceholderText('Search albums or artists...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeInTheDocument();
    fireEvent.click(searchButton);

    await waitFor(() => {
      mockAlbums.forEach((album) =>
        expect(screen.getByText(album.album_title)).toBeInTheDocument()
      );
    });
  });


  test('clears search when "×" button is clicked', async () => {
    renderHomePage();

    const searchInput = screen.getByPlaceholderText('Search albums or artists...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    expect(searchInput).toHaveValue('Test');

    const clearButton = screen.getByRole('button', { name: '×' });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
  });
});

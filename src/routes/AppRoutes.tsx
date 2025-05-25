import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingPage from '../components/LoadingPage';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('../pages/HomePage'));
const MoviesPage = React.lazy(() => import('../pages/MoviesPage'));
const SeriesPage = React.lazy(() => import('../pages/SeriesPage'));
const SearchPage = React.lazy(() => import('../pages/SearchPage'));
const MovieDetailsPage = React.lazy(() => import('../pages/MovieDetailsPage'));
const SeriesDetailsPage = React.lazy(() => import('../pages/SeriesDetailsPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Suspense fallback={<LoadingPage />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="movies" element={
          <Suspense fallback={<LoadingPage />}>
            <MoviesPage />
          </Suspense>
        } />
        <Route path="series" element={
          <Suspense fallback={<LoadingPage />}>
            <SeriesPage />
          </Suspense>
        } />
        <Route path="search" element={
          <Suspense fallback={<LoadingPage />}>
            <SearchPage />
          </Suspense>
        } />
        <Route path="movie/:id" element={
          <Suspense fallback={<LoadingPage />}>
            <MovieDetailsPage />
          </Suspense>
        } />
        <Route path="series/:id" element={
          <Suspense fallback={<LoadingPage />}>
            <SeriesDetailsPage />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
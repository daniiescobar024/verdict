import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AppShell } from './AppShell';

// Report and compare pages are split out: the landing page ships only what it needs.
const ReportPage = lazy(() => import('../pages/ReportPage'));
const ComparePage = lazy(() => import('../pages/ComparePage'));

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'report', element: <ReportPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

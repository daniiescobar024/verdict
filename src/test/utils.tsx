import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AppProviders } from '../app/providers';
import { routes } from '../app/router';
import type { PsiResponse } from '../features/audit/model/psi-types';
import { normalizeReport } from '../features/audit/model/normalize';
import fixture from './fixtures/psi-mobile.json';

export const psiFixture = fixture as PsiResponse;

export function reportFixture() {
  return normalizeReport(structuredClone(psiFixture), 'https://acme-plumbing.example/', 'mobile');
}

/** Renders the real route tree at a given URL, with every provider the app uses. */
export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const utils = render(
    <AppProviders locale="en">
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...utils, router };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetHistoryCache } from '../features/audit/hooks/useAuditHistory';
import { jsonResponse, renderRoute, reportFixture } from '../test/utils';

beforeEach(() => {
  __resetHistoryCache();
});

describe('Home', () => {
  it('validates the address before running an audit', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    renderRoute('/');

    await user.type(screen.getByLabelText('Website address'), 'not a site');
    await user.click(screen.getByRole('button', { name: /run audit/i }));

    expect(screen.getByLabelText('Website address')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/enter a public web address/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('navigates to the report for a valid address and device', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    const { router } = renderRoute('/');

    await user.type(screen.getByLabelText('Website address'), 'acme.com');
    await user.click(screen.getByRole('radio', { name: /desktop/i }));
    await user.click(screen.getByRole('button', { name: /run audit/i }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/report'));
    expect(router.state.location.search).toBe('?url=https%3A%2F%2Facme.com%2F&strategy=desktop');
  });
});

describe('Report', () => {
  it('narrates the wait, then renders the verdict, scores and findings', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(reportFixture()));
    renderRoute('/report?url=https%3A%2F%2Facme-plumbing.example%2F&strategy=mobile');

    expect(
      await screen.findByRole('heading', { name: /auditing acme-plumbing.example/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'This page is leaking enquiries.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Performance: 41 out of 100, poor' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Best practices: 96 out of 100, good' }),
    ).toBeInTheDocument();
    // A bare → www redirect is noise for a business owner, so it is not announced.
    expect(screen.queryByText(/redirected to/i)).not.toBeInTheDocument();

    const findings = screen.getByRole('region', { name: 'What to fix first' });
    expect(within(findings).getAllByRole('listitem')).toHaveLength(8);
  });

  it('filters findings by category', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(reportFixture()));
    renderRoute('/report?url=acme-plumbing.example');

    const findings = await screen.findByRole('region', { name: 'What to fix first' });
    await user.click(within(findings).getByRole('button', { name: /accessibility/i }));

    expect(within(findings).getAllByRole('listitem')).toHaveLength(2);
    expect(within(findings).getByRole('button', { name: /accessibility/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('remembers the audit in recent history', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(reportFixture()));
    renderRoute('/report?url=acme-plumbing.example');
    await screen.findByRole('heading', { name: 'This page is leaking enquiries.' });

    const stored = JSON.parse(window.localStorage.getItem('verdict:history') ?? '[]');
    expect(stored[0]).toMatchObject({
      url: 'https://acme-plumbing.example/',
      strategy: 'mobile',
      performance: 41,
    });
  });

  it('explains a quota error and lets the user retry', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({ error: { code: 'RATE_LIMITED', message: 'quota' } }, 429),
      )
      .mockResolvedValueOnce(jsonResponse(reportFixture()));
    renderRoute('/report?url=acme-plumbing.example');

    expect(await screen.findByRole('alert')).toHaveTextContent(/quota is exhausted/i);
    expect(fetchMock).toHaveBeenCalledTimes(1); // quota errors are not auto-retried

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(
      await screen.findByRole('heading', { name: 'This page is leaking enquiries.' }),
    ).toBeInTheDocument();
  });

  it('refuses a bad URL in the address bar without calling the API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    renderRoute('/report?url=javascript%3Aalert(1)');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /does not look like a public website/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('Compare', () => {
  it('audits both sites and names the leader', async () => {
    const a = reportFixture();
    const b = { ...reportFixture(), requestedUrl: 'https://rival.example/' };
    b.scores = { ...b.scores, performance: 92, accessibility: 95 };
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      jsonResponse(String(input).includes('rival') ? b : a),
    );
    renderRoute('/compare?a=acme-plumbing.example&b=rival.example');

    expect(await screen.findByText('rival.example leads on 2 of 9 measures.')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

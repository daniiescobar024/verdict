import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RichText } from './RichText';

describe('RichText', () => {
  it('renders Lighthouse markdown links as safe external links', () => {
    render(
      <RichText text="Fix it. [Learn more](https://web.dev/lcp)." linkLabel="Read the guide" />,
    );
    const link = screen.getByRole('link', { name: 'Read the guide' });
    expect(link).toHaveAttribute('href', 'https://web.dev/lcp');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders inline code', () => {
    const { container } = render(<RichText text="Add an `[alt]` attribute" />);
    expect(container.querySelector('code')?.textContent).toBe('[alt]');
  });

  it('never injects HTML from the source text', () => {
    const { container } = render(
      <RichText text={'<img src=x onerror="alert(1)"> [x](javascript:alert(1))'} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });
});

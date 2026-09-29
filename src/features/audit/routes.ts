import type { Strategy } from './model/types';

export const reportPath = (url: string, strategy: Strategy): string =>
  `/report?${new URLSearchParams({ url, strategy }).toString()}`;

export const comparePath = (a: string, b: string, strategy: Strategy): string =>
  `/compare?${new URLSearchParams({ a, b, strategy }).toString()}`;

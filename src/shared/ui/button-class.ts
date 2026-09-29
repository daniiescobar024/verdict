import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'quiet';

/** Lets links (router <Link>) share the exact button styling without nesting a <button>. */
export function buttonClass(variant: ButtonVariant = 'primary', extra?: string): string {
  return [styles.button, styles[variant], extra].filter(Boolean).join(' ');
}

export const iconClass = styles.icon;

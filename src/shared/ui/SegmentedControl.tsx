import { useId, type ReactNode } from 'react';
import styles from './SegmentedControl.module.css';

interface Option<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  legend: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
}

/** Native radio inputs under the hood: arrow-key navigation and screen-reader semantics for free. */
export function SegmentedControl<T extends string>({
  legend,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset className={styles.group}>
      <legend className="visually-hidden">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

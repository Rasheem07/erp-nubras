import { ClassValue } from 'clsx';

declare function formatCurrency(amount: number): string;

declare function cn(...inputs: ClassValue[]): string;

export { cn, formatCurrency };

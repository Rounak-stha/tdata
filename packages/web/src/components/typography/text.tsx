import type { FC } from 'react';
import { cn } from '@lib/utils';

type TextProps = {
  className?: string;
  text: React.ReactNode;
};

export const TextXSmall: FC<TextProps> = ({ className, text }) => {
  return <p className={cn('text-xs', className)}>{text}</p>;
};

export const TextSmall: FC<TextProps> = ({ className, text }) => {
  return <p className={cn('text-sm', className)}>{text}</p>;
};

export const Text: FC<TextProps> = ({ className, text }) => {
  return <p className={cn('text-base', className)}>{text}</p>;
};

export const TextLarge: FC<TextProps> = ({ className, text }) => {
  return <p className={cn('text-lg', className)}>{text}</p>;
};

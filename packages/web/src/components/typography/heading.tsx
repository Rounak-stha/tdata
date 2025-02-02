import type { FC } from 'react';
import { cn } from '@lib/utils';

type HeadingProps = {
  className?: string;
  text: string;
};

export const Heading1: FC<HeadingProps> = ({ className, text }) => {
  return <h1 className={cn('text-4xl font-bold', className)}>{text}</h1>;
};

export const Heading2: FC<HeadingProps> = ({ className, text }) => {
  return <h2 className={cn('text-3xl font-bold', className)}>{text}</h2>;
};

export const Heading3: FC<HeadingProps> = ({ className, text }) => {
  return <h3 className={cn('text-2xl font-bold', className)}>{text}</h3>;
};

export const Heading4: FC<HeadingProps> = ({ className, text }) => {
  return <h4 className={cn('text-xl font-bold', className)}>{text}</h4>;
};

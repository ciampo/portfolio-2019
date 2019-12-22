import 'react';
import { HTMLAttributes } from 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    loading?: 'auto' | 'eager' | 'lazy';
  }
  interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    onload?: string;
  }
}

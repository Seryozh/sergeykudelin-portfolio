'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface SearchParamsWrapperProps {
  children: (hasKey: boolean) => ReactNode;
}

export default function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  const hasKey = !!searchParams.get('key');

  return <>{children(hasKey)}</>;
}

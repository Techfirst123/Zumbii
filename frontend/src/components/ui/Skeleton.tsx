'use client';

import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-surface-tertiary rounded-lg',
        className
      )}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx('space-y-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx('h-3', i === lines - 1 && lines > 1 && 'w-3/4')}
        />
      ))}
    </div>
  );
}

interface SkeletonImageProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

function SkeletonImage({ className, aspectRatio = 'square' }: SkeletonImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <Skeleton
      className={clsx('w-full rounded-xl', aspectClasses[aspectRatio], className)}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  hasImage?: boolean;
}

function SkeletonCard({ className, hasImage = true }: SkeletonCardProps) {
  return (
    <div
      className={clsx(
        'bg-surface rounded-2xl border border-border overflow-hidden p-4 space-y-3',
        className
      )}
      aria-hidden="true"
    >
      {hasImage && <SkeletonImage aspectRatio="square" className="rounded-xl" />}
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

interface SkeletonProductPageProps {
  className?: string;
}

function SkeletonProductPage({ className }: SkeletonProductPageProps) {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12', className)} aria-hidden="true">
      <SkeletonImage aspectRatio="square" className="rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <SkeletonText lines={4} />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonImage, SkeletonCard, SkeletonProductPage };
export type { SkeletonProps, SkeletonTextProps, SkeletonImageProps, SkeletonCardProps, SkeletonProductPageProps };

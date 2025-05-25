"use client";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <span
    className={`animate-pulse bg-primary/10 rounded-lg inline-block ${className}`}
  ></span>
);

export default Skeleton;
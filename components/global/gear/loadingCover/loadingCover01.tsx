import scss from './loadingCover.module.scss';

import CircularProgress from '@mui/material/CircularProgress';

// LoadingCover01的父元素必須要有position:relative才有用
// LoadingCover01的父元素必須要有position:relative才有用
// LoadingCover01的父元素必須要有position:relative才有用
export default function LoadingCover01({
  isLoading,
  size,
  className = '',
}: {
  isLoading?: boolean;
  size?: number;
  className?: string;
}) {
  className = `${className} ${scss.loadingCover01}`;

  if (!isLoading) {
    return null;
  }

  return (
    <div className={className}>
      <CircularProgress className={scss.icon} size={size ?? 100} />
    </div>
  );
}

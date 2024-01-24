import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

// layer
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

import scss from './subLayer.module.scss';

/**
 * 基本上children只收兩個ReactNode
 *
 * 第三個以後會放在第二個children下面(不是裡面)
 *
 * 第三個以後基本上是用來放position:absolute的元件(通常是Modal)
 */
export default function SubLayer({
  children,
  className,
  bodyClassName,
  containerChildren,
  isLoading_subLayer = false,
  isLoading_all = false,
  scrollToTopTrigger,
}: {
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  containerChildren?: React.ReactNode;
  isLoading_subLayer?: boolean;
  isLoading_all?: boolean;
  scrollToTopTrigger?: unknown;
}) {
  const ref_body = useRef<HTMLDivElement>(null!);

  const childredArr = React.Children.toArray(children);

  useEffect(() => {
    ref_body.current.scrollTo(0, 0);
  }, [scrollToTopTrigger]);

  return (
    <div className={classNames(scss.container, className)}>
      {childredArr[0]}
      <div ref={ref_body} className={classNames(scss.body, bodyClassName)}>
        {childredArr[1]}
        {/*把剩下的childredArr的item放進來*/}
        {childredArr.slice(2)}
        <LoadingCover01 isLoading={isLoading_subLayer} />
      </div>
      {containerChildren}
      <LoadingCover01 isLoading={isLoading_all} />
    </div>
  );
}

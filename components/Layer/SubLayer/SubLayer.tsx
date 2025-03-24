import React, { useRef, useEffect, useState } from 'react';
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
  bodyOverflowY,
  style,
  bodyPreStyle,
}: {
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  containerChildren?: React.ReactNode;
  isLoading_subLayer?: boolean;
  isLoading_all?: boolean;
  scrollToTopTrigger?: unknown;
  bodyOverflowY?: 'hidden' | 'auto' | 'scroll';
  style?: React.CSSProperties;
  bodyPreStyle?: 'style01';
}) {
  const ref_body = useRef<HTMLDivElement>(null!);

  //---------------------------------------------------
  const [isLoading_subLayer_debounce, setIsLoading_subLayer_debounce] = useState(isLoading_subLayer);

  useEffect(() => {
    const timeoutToken = setTimeout(
      () => {
        setIsLoading_subLayer_debounce(isLoading_subLayer);
      },
      isLoading_subLayer ? 100 : 0
    );

    return () => {
      clearTimeout(timeoutToken);
    };
  }, [isLoading_subLayer]);

  //---------------------------------------------------
  const [isLoading_all_debounce, setIsLoading_all_debounce] = useState(isLoading_all);

  useEffect(() => {
    const timeoutToken = setTimeout(
      () => {
        setIsLoading_all_debounce(isLoading_all);
      },
      isLoading_all ? 100 : 0
    );

    return () => {
      clearTimeout(timeoutToken);
    };
  }, [isLoading_all]);

  //---------------------------------------------------

  const [firstChild, secondChild, ...restChildren] = React.Children.toArray(children);

  useEffect(() => {
    ref_body.current.scrollTo(0, 0);
  }, [scrollToTopTrigger]);

  return (
    <div className={classNames(scss.container, className)} style={style}>
      {firstChild}
      <div
        ref={ref_body}
        className={classNames(
          //
          scss.body,
          bodyPreStyle && scss[bodyPreStyle],
          bodyOverflowY && scss[`overflow_${bodyOverflowY}`],
          bodyClassName
        )}
      >
        {secondChild}
        {/*把剩下的childredArr的item放進來*/}
        {restChildren}
        {/* <LoadingCover01 isLoading={isLoading_subLayer} /> */}
        <LoadingCover01 isLoading={isLoading_subLayer_debounce} />
      </div>
      {containerChildren}
      {/* <LoadingCover01 isLoading={isLoading_all} /> */}
      <LoadingCover01 isLoading={isLoading_all_debounce} />
    </div>
  );
}

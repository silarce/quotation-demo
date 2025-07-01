import { useState, useRef, useEffect } from 'react';
// import classNames from 'classnames';

import scss from './index.module.scss';

const VirtualScrollbar = ({ children }: { children: React.ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDraggingY, setIsDraggingY] = useState(false);
  const [isDraggingX, setIsDraggingX] = useState(false);
  const [showVerticalScrollbar, setShowVerticalScrollbar] = useState(false);
  const [showHorizontalScrollbar, setShowHorizontalScrollbar] = useState(false);

  const handleScrollbarClick = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    const content = scrollContentRef.current;

    if (!container || !content) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollRatio = clickY / rect.height;
    const maxScroll = content.scrollHeight - container.clientHeight;

    container.scrollTop = scrollRatio * maxScroll;
  };

  const handleHorizontalScrollbarClick = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    const content = scrollContentRef.current;

    if (!container || !content) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollRatio = clickX / rect.width;
    const maxScroll = content.scrollWidth - container.clientWidth;

    container.scrollLeft = scrollRatio * maxScroll;
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingY(true);

    const startY = e.clientY;
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const startScrollTop = container.scrollTop;

    const handleMouseMove = (e: MouseEvent) => {
      const content = scrollContentRef.current;

      if (!container || !content) {
        return;
      }

      const deltaY = e.clientY - startY;
      const containerHeight = container.clientHeight;
      const contentHeight = content.scrollHeight;
      const scrollRatio = deltaY / containerHeight;

      container.scrollTop = startScrollTop + scrollRatio * contentHeight;
    };

    const handleMouseUp = () => {
      setIsDraggingY(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleHorizontalThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingX(true);

    const startX = e.clientX;
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const startScrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const content = scrollContentRef.current;

      if (!container || !content) {
        return;
      }

      const deltaX = e.clientX - startX;
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const scrollRatio = deltaX / containerWidth;

      container.scrollLeft = startScrollLeft + scrollRatio * contentWidth;
    };

    const handleMouseUp = () => {
      setIsDraggingX(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = scrollContentRef.current;

    if (!container || !content) {
      return;
    }

    const updateScrollInfo = () => {
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      const contentHeight = content.scrollHeight;
      const contentWidth = content.scrollWidth;
      const scrollPositionY = container.scrollTop;
      const scrollPositionX = container.scrollLeft;

      // 判斷是否需要顯示滾動條
      const needVerticalScrollbar = contentHeight > containerHeight;
      const needHorizontalScrollbar = contentWidth > containerWidth;

      setShowVerticalScrollbar(needVerticalScrollbar);
      setShowHorizontalScrollbar(needHorizontalScrollbar);

      // Y軸滾動條
      if (needVerticalScrollbar) {
        setScrollHeight((containerHeight / contentHeight) * containerHeight);
        setScrollTop((scrollPositionY / contentHeight) * containerHeight);
      }

      // X軸滾動條
      if (needHorizontalScrollbar) {
        setScrollWidth((containerWidth / contentWidth) * containerWidth);
        setScrollLeft((scrollPositionX / contentWidth) * containerWidth);
      }
    };

    updateScrollInfo();
    container.addEventListener('scroll', updateScrollInfo);

    return () => container.removeEventListener('scroll', updateScrollInfo);
  }, []);

  return (
    <div className={scss.customScrollContainer}>
      <div ref={scrollContainerRef} className={scss.scrollContent}>
        <div ref={scrollContentRef}>{children}</div>
      </div>

      {/* 垂直滾動條 - 只在需要時顯示 */}
      {showVerticalScrollbar && (
        <div className={scss.scrollbarTrack} onClick={handleScrollbarClick}>
          <div
            className={`${scss.scrollbarThumb} ${isDraggingY ? scss.dragging : ''}`}
            style={{
              height: `${scrollHeight}px`,
              transform: `translateY(${scrollTop}px)`,
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}

      {/* 水平滾動條 - 只在需要時顯示 */}
      {showHorizontalScrollbar && (
        <div className={scss.scrollbarTrackHorizontal} onClick={handleHorizontalScrollbarClick}>
          <div
            className={`${scss.scrollbarThumbHorizontal} ${isDraggingX ? scss.dragging : ''}`}
            style={{
              width: `${scrollWidth}px`,
              transform: `translateX(${scrollLeft}px)`,
            }}
            onMouseDown={handleHorizontalThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================

const VirtualScrollbarContainer = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${scss.container} ${className}`} {...props}>
      <VirtualScrollbar>{children}</VirtualScrollbar>
    </div>
  );
};

const VirtualScrollbarContainer_noBorder = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${scss.container_noBorder} ${className}`} {...props}>
      <VirtualScrollbar>{children}</VirtualScrollbar>
    </div>
  );
};

// ============================================================================

export default VirtualScrollbarContainer;
export { VirtualScrollbar, VirtualScrollbarContainer_noBorder };

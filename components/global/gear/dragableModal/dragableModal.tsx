import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Image from 'next/image';

import scss from './dragableModal.module.scss';
import crossRed from 'public/image/icon/cross_red.svg';

const DragableModal = ({
  show,

  handleText,
  children,

  className,
  style,

  handleClassName,
  hanDleStyle,

  showCross = true,
  crossClassName,
  crossStyle,
  onCrossClick,
}: {
  show: boolean;

  handleText?: React.ReactNode;
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  handleClassName?: string;
  hanDleStyle?: React.CSSProperties;

  showCross?: boolean;
  crossClassName?: string;
  crossStyle?: React.CSSProperties;
  onCrossClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });

  //---------------------------------------------------------------------

  const handler_mouseDown = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setWindowSize({ width: windowWidth, height: windowHeight });
    setIsDragging(true);
  };

  const handler_mouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  //
  const handler_mouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!isDragging) {
        return;
      }

      let { movementX, movementY } = e;
      const currentTarget = e.currentTarget as Element;
      const { left, right, top, bottom } = currentTarget.getBoundingClientRect();

      if (left <= 0 && movementX < 0) {
        movementX = 0;
      }

      if (right >= windowSize.width && movementX > 0) {
        movementX = 0;
      }

      if (top <= 0 && movementY < 0) {
        movementY = 0;
      }

      if (bottom >= windowSize.height && movementY > 0) {
        movementY = 0;
      }

      setCoordinate((座標) => {
        let x = 座標.x + movementX;
        let y = 座標.y + movementY;
        // 必須取整數，不然子元素與子元素，子元素與父元素之間會有間隙
        x = Math.round(x);
        y = Math.round(y);

        return { x, y };
      });
    },
    [isDragging]
  );

  //---------------------------------------------------------------------

  useEffect(() => {
    if (!show) {
      setIsDragging(false);
      setCoordinate({ x: 0, y: 0 });
      setWindowSize({ width: 0, height: 0 });
      setIsReady(false);

      return;
    }

    // 使初始位置置中
    if (ref.current && window) {
      const { width, height } = ref.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let x = (windowWidth - width) / 2;
      let y = (windowHeight - height) / 2;

      // 必須取整數，不然子元素與子元素，子元素與父元素之間會有間隙
      x = Math.round(x);
      y = Math.round(y);
      setCoordinate({ x, y });
      setIsReady(true);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  //---------------------------------------------------------------------
  return createPortal(
    <div
      //
      ref={ref}
      className={classNames(
        //
        scss.modal,
        !isReady && 'invisible',
        className
      )}
      style={{
        transform: `translate(${coordinate.x}px,${coordinate.y}px)`,
        ...style,
      }}
    >
      <div
        className={classNames(scss.handle, isDragging && scss.isDragging, handleClassName)}
        onMouseMove={handler_mouseMove}
        onMouseDown={handler_mouseDown}
        onMouseUp={handler_mouseUp}
        onMouseUpCapture={handler_mouseUp}
        onMouseLeave={handler_mouseUp}
        style={hanDleStyle}
      >
        {/* <span className={scss.text}>{handleText}</span> */}
        {handleText}
        {showCross && (
          <Image
            //
            src={crossRed}
            alt="關閉"
            className={classNames(scss.cross, crossClassName)}
            style={crossStyle}
            onClick={onCrossClick}
          />
        )}
      </div>

      {/*  */}

      {/* <div className={scss.body}>{children}</div> */}
      {children}
    </div>,
    document.body
  );
};

// =====================================================================

export default DragableModal;

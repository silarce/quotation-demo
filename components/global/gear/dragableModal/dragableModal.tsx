import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

import classNames from 'classnames';
import Image from 'next/image';

import scss from './dragableModal.module.scss';
import crossRed from 'public/image/icon/cross_red.svg';

type Tprops = {
  show: boolean;
  boxShadow?: boolean;

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
};

type Tprops_call = Omit<Tprops, 'show'>;

// =====================================================================
const DragableModal = ({
  show,
  boxShadow = true,

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
}: Tprops) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });

  //---------------------------------------------------------------------

  const handler_mouseDown = () => {
    window.getSelection()?.removeAllRanges();
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

      const { movementX, movementY } = e;
      const currentTarget = e.currentTarget as Element;
      const { left, right, top, bottom, width, height } = currentTarget.getBoundingClientRect();

      // if (left <= 0 && movementX < 0) {
      //   movementX = 0;
      // }

      // if (right >= windowSize.width && movementX > 0) {
      //   movementX = 0;
      // }

      // if (top <= 0 && movementY < 0) {
      //   movementY = 0;
      // }

      // if (bottom >= windowSize.height && movementY > 0) {
      //   movementY = 0;
      // }

      setCoordinate((座標) => {
        let x = 座標.x + movementX;
        let y = 座標.y + movementY;
        // 必須取整數，不然子元素與子元素，子元素與父元素之間會有間隙
        x = Math.round(x);
        y = Math.round(y);

        x < 0 && (x = 0);
        y < 0 && (y = 0);
        x + width >= windowSize.width && (x = windowSize.width - width);
        y + height >= windowSize.height && (y = windowSize.height - height);

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
        boxShadow && scss.boxShadow,
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
        <span>{handleText}</span>

        {showCross && (
          <Image
            //
            src={crossRed}
            alt="關閉"
            className={classNames(scss.cross, crossClassName)}
            style={crossStyle}
            onClick={onCrossClick}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
            onMouseUpCapture={(e) => {
              e.stopPropagation();
            }}
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

const createDragableModal = (props?: Tprops_call) => {
  const container = document.createElement('div');
  container.className = 'tempDOMContainer';
  document.body.appendChild(container);

  const root = createRoot(container);
  let isUnmounted = false; // 標誌是否已經卸載

  const unmountComponent = () => {
    if (isUnmounted) {
      return;
    }

    root.unmount();
    isUnmounted = true; // 設置標誌為已卸載
    // if (container) {
    // }
  };

  const { children, onCrossClick } = props ?? {};

  props &&
    root.render(
      <DragableModal
        //
        {...props}
        show={true}
        onCrossClick={() => {
          unmountComponent();
          onCrossClick?.();
        }}
      >
        {children}
      </DragableModal>
    );
  //
  //
  document.body.removeChild(container);

  //
  //
  const update = (props: Tprops_call) => {
    const { children, onCrossClick } = props ?? {};
    root.render(
      <DragableModal
        //
        {...props}
        show={true}
        onCrossClick={() => {
          unmountComponent();
          onCrossClick?.();
        }}
      >
        {children}
      </DragableModal>
    );
  };

  return {
    update,
    unmount: unmountComponent,
  };
};

DragableModal.create = createDragableModal;

// =====================================================================

export default DragableModal;
export { createDragableModal };

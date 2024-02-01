import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './table01.module.scss';

type Trow = {
  children: React.ReactNode;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  maxHeight?: React.CSSProperties['maxHeight'];
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Tcell = {
  children: React.ReactNode;
  width?: React.CSSProperties['width'];
  flex?: React.CSSProperties['flex'];
  justifyContent?: React.CSSProperties['justifyContent'];
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

type Ttable = {
  className?: string;
  style?: React.CSSProperties;
  haveBorder?: boolean;
  thead: {
    cellArr: Tcell[];
    rowProps?: Omit<Trow, 'children' | 'onClick'>;
    className?: string;
    style?: React.CSSProperties;
    stickyTop?: {
      top: React.CSSProperties['top'];
      zIndex?: React.CSSProperties['zIndex'];
    };
  };
  tbody: {
    rowArr: ({
      cellArr: Tcell[];
    } & Omit<Trow, 'children'>)[];
    className?: string;
    style?: React.CSSProperties;
  };
};

export type { Trow, Tcell, Ttable };

// ===================================================================
const Table01 = ({
  //
  thead,
  tbody,
  className,
  style,
  haveBorder = true,
}: Ttable) => {
  return (
    <div className={classNames(scss.table, haveBorder && scss.haveBorder, className)} style={style}>
      <div
        //
        className={classNames(scss.thead)}
        style={{
          position: thead.stickyTop ? 'sticky' : undefined,
          top: thead.stickyTop?.top,
          zIndex: thead.stickyTop?.zIndex ?? '2',
          ...thead.style,
        }}
      >
        <Row_thead {...thead.rowProps}>
          {thead.cellArr.map((item, index) => {
            const { width, flex, justifyContent, className, style, children } = item;

            return (
              <Cell
                key={index}
                width={width}
                flex={flex}
                justifyContent={justifyContent}
                className={className}
                style={style}
              >
                {children}
              </Cell>
            );
          })}
        </Row_thead>
      </div>

      {/*  */}
      <div className={classNames(scss.tbody)}>
        {tbody.rowArr.map((row, rIndex) => {
          const { cellArr, height, minHeight, maxHeight, className, style, onClick } = row;

          return (
            <Row
              key={rIndex}
              height={height}
              minHeight={minHeight}
              maxHeight={maxHeight}
              className={className}
              style={style}
              onClick={onClick}
            >
              {cellArr.map((cell, cIndex) => {
                const { width, flex, justifyContent, className, style, children } = cell;

                return (
                  <Cell
                    key={cIndex}
                    width={width}
                    flex={flex}
                    justifyContent={justifyContent}
                    className={className}
                    style={style}
                  >
                    {children}
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

const Row = ({ children, height, minHeight, maxHeight, className, style, onClick }: Trow) => {
  return (
    <CellWithBar className={scss.rowWrapper}>
      <div
        //
        className={classNames(scss.row, className, onClick && scss.clickable)}
        style={{
          height,
          minHeight,
          maxHeight,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </CellWithBar>
  );
};

const Row_thead = ({
  //
  children,
  height,
  minHeight,
  maxHeight,
  className,
  style,
}: Trow) => {
  return (
    <div
      //
      className={classNames(scss.row, className)}
      style={{
        height,
        minHeight,
        maxHeight,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Cell = ({
  //
  children,
  width,
  flex,
  justifyContent,
  className,
  style,
  onClick,
}: Tcell) => {
  return (
    <div
      //
      className={classNames(scss.cell, className)}
      style={{ width, flex, justifyContent, ...style }}
      onClick={onClick}
    >
      <span>{children}</span>
    </div>
  );
};

export default Table01;

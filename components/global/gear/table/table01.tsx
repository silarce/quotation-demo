import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './table01.module.scss';

type Trow = {
  children: React.ReactNode;
  height?: React.CSSProperties['height'];
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
  thead: {
    cellArr: Tcell[];
    rowProps?: Omit<Trow, 'children'>;
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

// ===================================================================
const Table01 = ({
  //
  thead,
  tbody,
  className,
  style,
}: Ttable) => {
  return (
    <div className={classNames(scss.table, className)} style={style}>
      <div
        //
        className={classNames(scss.thead, className)}
        style={{
          position: thead.stickyTop ? 'sticky' : undefined,
          top: thead.stickyTop?.top,
          zIndex: thead.stickyTop?.zIndex ?? '2',
          ...thead.style,
        }}
      >
        <div className={scss.row} {...thead.rowProps}>
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
        </div>
      </div>
      {/*  */}
      <div className={classNames(scss.tbody)}>
        {tbody.rowArr.map((row, rIndex) => {
          const { cellArr, height, className, style, onClick } = row;

          return (
            <Row key={rIndex} height={height} className={className} style={style} onClick={onClick}>
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

const Row = ({ children, height, className, style, onClick }: Trow) => {
  return (
    <CellWithBar className={scss.rowWrapper}>
      <div
        //
        className={classNames(scss.row, className, onClick && scss.clickable)}
        style={{ height, ...style }}
        onClick={onClick}
      >
        {children}
      </div>
    </CellWithBar>
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
export type { Trow, Tcell, Ttable };

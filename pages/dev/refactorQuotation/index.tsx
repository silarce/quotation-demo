import { useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import Image from 'next/image';

import { nanoid } from 'nanoid';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// antd
import { Collapse } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconMove from 'public/image/icon/move.svg';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

//
import scss from './index.module.scss';
import theme from 'styles/_theme01.module.scss';

// ===========================================================================

const arr = new Array(60).fill(0);

export default function Labe10() {
  // ----------------------------------------------------

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ----------------------------------------------------
  return (
    <div className="px-5">
      <div className={scss.tableContainer}>
        <div className={scss.topPanel}>
          <div>主產品設定</div>
          {/* <MyButton_v2 px="px22" py="py4">
            設定排序
          </MyButton_v2> */}
        </div>
        <div className={scss.table}>
          <div className={scss.normalPanel}>
            <div className={scss.thead}>
              <div className={scss.sidePanel}>
                <IconMove />
                <IconCopy />
                <IconCopy />
              </div>
              {arr.map((item, index) => {
                return (
                  <div key={index} className={scss.cell}>
                    Foo{index}
                  </div>
                );
              })}

              <div className={scss.attachPanel}>
                <div className={scss.AttachCell}>attach</div>
                <div className={scss.AttachCell}>attach</div>
                <div className={scss.AttachCell}>attach</div>
              </div>
            </div>
            {/*  */}
            {/*  */}

            <Collapse>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => {
                return (
                  <Collapse.Panel
                    key={index}
                    header={
                      <div
                        className={classNames(scss.bodyRow, index === activeIndex && scss.active)}
                        onClick={() => setActiveIndex(index)}
                      >
                        <div className={scss.sidePanel}>
                          <IconMove />
                          <IconCopy />
                          <IconCopy />
                        </div>

                        {arr.map((item, index) => {
                          return (
                            <div key={index} className={scss.cell}>
                              Foo{index}
                            </div>
                          );
                        })}
                        <div className={scss.attachPanel}>
                          <div className={scss.attachCell}>attach</div>
                          <div className={scss.attachCell}>attach</div>
                          <div className={scss.attachCell}>attach</div>
                        </div>
                      </div>
                    }
                  >
                    fffff
                  </Collapse.Panel>
                );
              })}
            </Collapse>
            {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => {
              return (
                <BodyRow key={index} active={index === activeIndex} onClick={() => setActiveIndex(index)}>
                  <SidePanel className="chameleon">
                    <IconMove />
                    <IconCopy />
                    <IconCopy />
                  </SidePanel>

                  {arr.map((item, index) => {
                    return <Cell key={index}>Foo{index}</Cell>;
                  })}
                  <AttachPanel>
                    <AttachCell>attach</AttachCell>
                    <AttachCell>attach</AttachCell>
                    <AttachCell>attach</AttachCell>
                  </AttachPanel>
                </BodyRow>
              );
            })} */}

            {/*  */}
            {/*  */}
          </div>
        </div>
        <div className={scss.totalBottom}></div>
      </div>
    </div>
  );
}

// ===============================================================

// const TableContainer = styled.div`
//   border: solid 1px ${theme.colors_border};
// `;

// const TopPanel = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 30px;
//   padding: 20px;
//   > div:nth-of-type(1) {
//     color: ${theme.colors_main};
//     font-size: 20px;
//   }
// `;

// const Table = styled.div`
//   overflow: auto;
//   border: solid 3px transparent;
//   border-width: 0 3px;
//   max-height: 500px;
// `;

// -----------------------------------------------------------------------
// const Row = styled.div`
//   position: relative;
//   display: flex;
//   flex-wrap: nowrap;
//   align-items: center;
//   /* gap: 16px; */
//   width: fit-content;
//   height: 60px;
//   > * {
//     margin-right: 16px;
//     &:nth-last-of-type(1) {
//       margin-right: 0;
//     }
//   }
// `;

// const SidePanel = styled.div`
//   position: sticky;
//   left: 0;
//   flex: none;
//   display: flex;
//   gap: 5px;
//   align-items: center;
//   width: fit-content;
//   /* next.js的Image有設置max-width:100%，不知為何這會造成跑版 */
//   img {
//     max-width: unset;
//   }
// `;

// const Thead = styled(Row)`
//   position: sticky;
//   top: 0;
//   height: 45px;

//   background-color: ${theme.colors_bgc01};
//   border-bottom: solid 5px white;
//   z-index: 1;
//   ${SidePanel} {
//     > * {
//       visibility: hidden;
//     }
//     margin-right: 0;
//     background-color: ${theme.colors_bgc01};
//     border-right: solid 16px ${theme.colors_bgc01};
//   }
// `;

// const BodyRow = styled(Row)<{ active?: boolean }>`
//   --bgc: ${({ active }) => (active ? theme.colors_chosenBgc : 'white')};
//   --bgc_hover: ${({ active }) => (active ? theme.colors_chosenBgc : theme.colors_hoverBgc)};

//   background-color: var(--bgc);

//   ${SidePanel} {
//     margin-right: 0;
//     background-color: var(--bgc);
//     border-right: solid 16px var(--bgc);
//   }

//   :hover {
//     background-color: var(--bgc_hover);
//     ${SidePanel} {
//       background-color: var(--bgc_hover);
//       border-color: var(--bgc_hover);
//     }
//   }

//   ${({ active }) => {
//     return active
//       ? `
//   position: sticky;
//   top: 45px;
//   z-index: 1;
//     `
//       : '';
//   }}
// `;

// -----------------------------------------------------------------------

// const Cell = styled.div``;

// const AttachCell = styled(Cell)``;
// const AttachCell_thead = styled(AttachCell)``;

// const TotalBottom = styled.div``;

// const NormalPanel = styled.div``;

// const AttachPanel = styled.div`
//   position: sticky;
//   right: 0;

//   display: flex;
//   flex-wrap: nowrap;
//   align-items: center;
//   gap: 5px;

//   height: 100%;
//   background-color: #dddd;
//   border-left: solid 5px white;
// `;

const IconMove = () => {
  return <Image src={iconMove} alt="iconMove" />;
};

// ===============================================================

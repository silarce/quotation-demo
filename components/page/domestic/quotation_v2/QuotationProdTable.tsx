import { useState, useEffect, memo } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';

// component
import {
  Tprops_cell,
  //
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
} from 'components/page/domestic/quotation_v2/quotationRow';
import { Cell_indexNumber, Cell_delete, Cell_copy } from './hook/quotationProduct/ui/cell';

// antd
import { Tabs, Spin } from 'antd';

// gear
import { InputSel_prod } from './hook/quotationProduct/ui/InputSel_prod';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

// css
import scss from './QuotationProdTable.module.scss';

import { TuseQuotationProductInstance, TstateProd } from './hook/quotationProduct/useQuotationProduct';

import { SearchModal_prodAccessories } from 'components/composition/searchModal/useSearchModal/useSearchModal_prodAccessories';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';

// ===================================================================

interface Tprops {
  instance_useQuotationProductInstance: TuseQuotationProductInstance;
  disabled: boolean;
  className?: string;
}

interface TtableProps {
  instance_useQuotationProductInstance: TuseQuotationProductInstance;
  disabled: boolean;
  className?: string;
}

// ===================================================================

// MARK: START
// 這個元件就是useQuotationProduct實例與UI元件的轉接器，
// 本來就預期會與useQuotationProduct高度耦合
export default function QuotationProdTable(tableProps: Tprops) {
  const { instance_useQuotationProductInstance, disabled, className } = tableProps;

  const activedProd = instance_useQuotationProductInstance.activedProd;

  // console.log(activedProd);

  // MARK:RENDER
  return (
    <div className={className}>
      {/* 主產品 product */}
      <Table_prod instance_useQuotationProductInstance={instance_useQuotationProductInstance} disabled={disabled} />
      <br />

      <Spin spinning={!!activedProd?.isFetching}>
        <Table_component
          instance_useQuotationProductInstance={instance_useQuotationProductInstance}
          disabled={disabled}
        />
      </Spin>
      <br />
      <Spin spinning={!!activedProd?.isFetching}>
        <Table_accessory
          instance_useQuotationProductInstance={instance_useQuotationProductInstance}
          disabled={disabled}
        />
      </Spin>
      {/* <Tabs>
        <Tabs.TabPane tab="材料配件" key="1">
          <Table_component
            instance_useQuotationProductInstance={instance_useQuotationProductInstance}
            disabled={disabled}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="選配設定" key="2">
          <Table_accessory
            instance_useQuotationProductInstance={instance_useQuotationProductInstance}
            disabled={disabled}
          />
        </Tabs.TabPane>
      </Tabs> */}
    </div>
  );
}

// MARK:END

// ===================================================================
// ===================================================================

// MARK:QuotationRow_dnd_preMemo
const QuotationRow_dnd_preMemo = (
  params: Parameters<typeof QuotationRow_dnd>[0] & {
    //
    rerenderTrigger01?: any;
    rerenderTrigger02?: any;
    rerenderTrigger03?: any;
    rerenderTrigger04?: any;
  }
) => {
  const { rerenderTrigger01, rerenderTrigger02, rerenderTrigger03, rerenderTrigger04, ...rest } = params;

  return <QuotationRow_dnd {...rest} />;
};

const QuotationRow_dnd_memo = memo(QuotationRow_dnd_preMemo, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.isActive === next.isActive &&
    prev.index === next.index &&
    prev.rerenderTrigger01 === next.rerenderTrigger01 &&
    prev.rerenderTrigger02 === next.rerenderTrigger02 &&
    prev.rerenderTrigger03 === next.rerenderTrigger03 &&
    prev.rerenderTrigger04 === next.rerenderTrigger04

    // 把rerenderTrigger設為陣列的方案發生問題
    // _.isEqual(prev.rerenderTrigger, next.rerenderTrigger)
  );
});

// MARK:Table_prod
const Table_prod = ({
  //
  instance_useQuotationProductInstance,
  disabled,
  className,
}: TtableProps) => {
  const {
    // classProdDict,
    // activedClassProd: activeClassProd,
    activedProd,
    //
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
    //
    nodeConfig_origin,
    //
    quotationDiscount,
    setQuotationDiscount,
    //
    //
    //
    state_prodDict,
    // lookup_classProd,
    // nodeConfig_prime,
    createClassProd,
    activedClassProd,
  } = instance_useQuotationProductInstance;

  return (
    <div className={scss.prodTableWrapper}>
      <div className={scss.tablePanel}>
        <span className={scss.title}>主產品設定</span>
        <InputSel_prod
          //
          caption="總折數 : "
          wrapperStyle={{ width: 130, gap: 5 }}
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              value: quotationDiscount,
              onChange(e) {
                setQuotationDiscount(e.target.value as `${number}` | '');
              },
            },
          }}
          fontSize="18"
          captionSize="18"
        />
        {/* <SquareBtn className="ml-2" sharp="mini">
          編輯欄位排序
        </SquareBtn> */}
      </div>
      {/*  */}
      <div className={classNames(scss.prodTable, className)}>
        <div className={scss.table}>
          <QuotationRow_dndThead
            className={scss.rowThead}
            disabled={disabled}
            keyArr={cellKeyArr}
            onDragEnd={({ move }) => {
              setCellKeyArr(move(cellKeyArr));
            }}
            configDict={nodeConfig_origin}
            dragHandleInvisible={true}
            left={
              <>
                <Cell_delete className={'invisible'} onClick={() => {}} />
                <Cell_copy className={'invisible'} onClick={() => {}} />
                <Cell_indexNumber />
                <Cell
                  className={classNames('text-lg text-main', nodeConfig_origin['itemName'].className)}
                  style={nodeConfig_origin['itemName'].style}
                >
                  {nodeConfig_origin['itemName'].label}
                </Cell>
              </>
            }
          />
          <Table_dnd
            items={prodKeyArr}
            onDragEnd={({ move }) => {
              setProdKeyArr(move(prodKeyArr));
            }}
          >
            {prodKeyArr.map((prodKey, index) => {
              const stateProd = state_prodDict[prodKey];
              const isActive = activedProd === stateProd;

              return (
                <QuotationRow_dealClass_memo
                  key={prodKey}
                  stateProd={stateProd}
                  disabled={disabled}
                  isActive={isActive}
                  cellKeyArr={cellKeyArr}
                  index={index}
                  //
                  rerenderTrigger01={stateProd.renderCount}
                  //
                  prodKey={prodKey}
                  choseActiveProd={choseActiveProd}
                  createClassProd={createClassProd}
                  //
                  activedClassProd={activedClassProd}
                />
              );
            })}
          </Table_dnd>
        </div>
        <div className={classNames(scss.bottom, disabled && 'invisible')}>
          <SquareBtn sharp="mini" onClick={() => {}} className={scss.btn}>
            新增主產品
          </SquareBtn>
        </div>
      </div>
    </div>
  );
};

// MARK:Table_component
const Table_component = ({ instance_useQuotationProductInstance, disabled, className }: TtableProps) => {
  const {
    activedProd,
    activedClassComponentDict,
    activedClassPseudoComponentDict,
    //
    cellKeyArr_component,
    setCellKeyArr_component,
    componentKeyArr,
    setComponentKeyArr,
    nodeConfig_component_origin,

    createActivedClassComponentDict,
  } = instance_useQuotationProductInstance;

  const [activeIndex, setActiveIndex] = useState<number | string | undefined>(undefined);

  const classComponentDict = activedClassComponentDict;

  useEffect(() => {
    setActiveIndex(undefined);
  }, [activedProd]);

  return (
    <div>
      <div className={classNames(scss.title, 'p-[10px]')}>材料配件</div>
      <div className={classNames(scss.componentTable, className)}>
        <QuotationRow_dndThead
          className={scss.rowThead}
          disabled={disabled}
          keyArr={cellKeyArr_component}
          onDragEnd={({ move }) => {
            setCellKeyArr_component(move(cellKeyArr_component));
          }}
          configDict={nodeConfig_component_origin}
          dragHandleInvisible={true}
          left={
            <>
              <Cell
                className={classNames('text-lg text-main', nodeConfig_component_origin['name'].className)}
                style={nodeConfig_component_origin['name'].style}
              >
                {nodeConfig_component_origin['name'].label}
              </Cell>
            </>
          }
        />
        <Table_dnd
          items={componentKeyArr ?? []}
          onDragEnd={({ move }) => {
            if (!componentKeyArr) {
              return;
            }

            setComponentKeyArr(move(componentKeyArr));
          }}
        >
          {componentKeyArr?.map((componentKey, index) => {
            if (!classComponentDict) {
              return null;
            }

            const classComponent = classComponentDict[componentKey];

            if (!classComponent) {
              return null;
            }

            const nodeConfig_name = classComponent.nodeConfig['name'];

            const left = (
              <>
                <Cell className={classNames(nodeConfig_name.className)} style={nodeConfig_name.style}>
                  {nodeConfig_name.createNode?.({
                    disabled,
                    classComponent: classComponent,
                  })}
                </Cell>
              </>
            );

            return (
              <QuotationRow_dnd_memo
                //
                rerenderTrigger01={classComponent.state.renderCount}
                rerenderTrigger02={disabled}
                rerenderTrigger03={cellKeyArr_component}
                rerenderTrigger04={classComponent.constructor}
                //
                key={componentKey}
                id={componentKey}
                index={index}
                isActive={activeIndex === index}
                //
                // isActive={isActive}
                left={left}
                //
                onClick={() => {
                  setActiveIndex(index);
                }}
                // onDragStart={(e) => {
                //   choseActiveProd(undefined);
                // }}
              >
                {cellKeyArr_component.map((cellKey, cIndex) => {
                  const { style, className, createNode } = classComponent.nodeConfig[cellKey];

                  const node = createNode?.({
                    disabled,
                    classComponent: classComponent,
                  });

                  return (
                    <Cell key={cellKey} className={classNames(className)} style={style}>
                      {node}
                    </Cell>
                  );
                })}
              </QuotationRow_dnd_memo>
            );
          })}
          {/*  */}
          {Object.entries(activedClassPseudoComponentDict ?? {}).map(([key, classComponent], index) => {
            if (!classComponent) {
              return null;
            }

            const nodeConfig_name = classComponent.nodeConfig['name'];

            const left = (
              <>
                <Cell className={classNames(nodeConfig_name.className)} style={nodeConfig_name.style}>
                  {nodeConfig_name.createNode?.({
                    disabled,
                    classComponent: classComponent,
                  })}
                </Cell>
              </>
            );

            return (
              <QuotationRow_dnd_memo
                //
                rerenderTrigger01={classComponent.state}
                rerenderTrigger02={disabled}
                rerenderTrigger03={null}
                rerenderTrigger04={null}
                //
                key={classComponent.key}
                id={classComponent.key}
                index={index}
                isActive={activeIndex === key}
                //
                dragHandleInvisible={true}
                left={left}
                //
                onClick={() => {
                  setActiveIndex(key);
                }}
              >
                {cellKeyArr_component.map((cellKey, cIndex) => {
                  const { style, className, createNode } = classComponent.nodeConfig[cellKey];

                  const node = createNode?.({
                    disabled,
                    classComponent: classComponent,
                  });

                  return (
                    <Cell key={cellKey} className={classNames(className)} style={style}>
                      {node}
                    </Cell>
                  );
                })}
              </QuotationRow_dnd_memo>
            );
          })}
        </Table_dnd>
      </div>
    </div>
  );
};

// MARK:Table_accessory
const Table_accessory = ({ instance_useQuotationProductInstance, disabled, className }: TtableProps) => {
  const {
    // activedProd,
    activedClassProd,
    activedClassAccessoryDict,
    // showAccessorySelector,
    // activedClassAccessoryDict,
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr,
    setAccessoryKeyArr,
    nodeConfig_accessory_origin,

    createActivedClassAccessoryDict,
  } = instance_useQuotationProductInstance;

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const [showSelector, setShowSelector] = useState(false);

  // const classAccessoryDict = createActivedClassAccessoryDict(activedProd);

  useEffect(() => {
    setActiveIndex(undefined);
    setShowSelector(false);
  }, [activedClassProd]);

  useEffect(() => {
    setShowSelector(false);
  }, [disabled]);

  return (
    <div>
      <div className={classNames(scss.title, 'p-[10px]')}>選配</div>
      <div className={classNames(scss.accessoryTable, className)}>
        <div className={scss.table}>
          <QuotationRow_dndThead
            className={scss.rowThead}
            disabled={disabled}
            keyArr={cellKeyArr_accessory}
            onDragEnd={({ move }) => {
              setCellKeyArr_accessory(move(cellKeyArr_accessory));
            }}
            configDict={nodeConfig_accessory_origin}
            dragHandleInvisible={true}
            left={
              <>
                <Cell_delete className={'invisible'} onClick={() => {}} />
                <Cell_indexNumber className="invisible" />
                <Cell
                  className={classNames('text-xl text-main', nodeConfig_accessory_origin['name'].className)}
                  style={nodeConfig_accessory_origin['name'].style}
                >
                  {nodeConfig_accessory_origin['name'].label}
                </Cell>
              </>
            }
          />

          <Table_dnd
            items={accessoryKeyArr ?? []}
            onDragEnd={({ move }) => {
              if (!accessoryKeyArr) {
                return;
              }

              setAccessoryKeyArr(move(accessoryKeyArr));
            }}
          >
            {accessoryKeyArr?.map((acceKey, index) => {
              if (!activedClassAccessoryDict) {
                return null;
              }

              const classAccessory = activedClassAccessoryDict[acceKey];

              const nodeConfig_name = classAccessory.nodeConfig['name'];

              const left = (
                <>
                  <Cell_delete onClick={() => {}} />
                  <Cell_indexNumber>{index + 1}</Cell_indexNumber>
                  <Cell className={classNames(nodeConfig_name.className)} style={nodeConfig_name.style}>
                    {nodeConfig_name.createNode({
                      disabled,
                      classAcce: classAccessory,
                    })}
                  </Cell>
                </>
              );

              return (
                <QuotationRow_dnd_memo
                  rerenderTrigger01={classAccessory.state}
                  rerenderTrigger02={disabled}
                  rerenderTrigger03={cellKeyArr_accessory}
                  key={acceKey}
                  id={acceKey}
                  index={index}
                  isActive={activeIndex === index}
                  left={left}
                  onClick={() => setActiveIndex(index)}
                >
                  {cellKeyArr_accessory.map((cellKey) => {
                    const { style, className, createNode } = classAccessory.nodeConfig[cellKey];

                    const node = createNode({
                      disabled,
                      classAcce: classAccessory,
                    });

                    return (
                      <Cell key={cellKey} className={classNames(className)} style={style}>
                        {node}
                      </Cell>
                    );
                  })}
                </QuotationRow_dnd_memo>
              );
            })}
          </Table_dnd>
        </div>
        <div className={classNames(scss.bottom, disabled && 'invisible')}>
          <SquareBtn
            sharp="mini"
            className={scss.btn}
            //
            onClick={() => {
              activedClassProd && !activedClassProd.isSpecial && setShowSelector(true);
            }}
          >
            {activedClassProd?.isSpecial ? '特殊門無選配' : '新增選配'}
          </SquareBtn>
        </div>
        <DragableModal show={showSelector} onCrossClick={() => setShowSelector(false)}>
          <SearchModal_prodAccessories
            doorNModelName={activedClassProd?.doorModelName ?? ''}
            onConfirm={(v) => {
              activedClassProd?.addAccessory(Object.values(v));
              setShowSelector(false);
            }}
            checkForbbiden={({ dto }) => {
              return accessoryKeyArr?.some((key) => key === dto.id);
            }}
          />
        </DragableModal>
      </div>
    </div>
  );
};

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

// const Cell_indexNumber = (props: Tprops_cell) => {
//   return <Cell className={classNames('w-5')} {...props} />;
// };

// const Cell_delete = ({
//   //
//   onClick,
//   className,
//   ...props
// }: Omit<Tprops_cell, 'children' | 'onClick'> & {
//   onClick: () => void;
// }) => {
//   return (
//     <Cell className={classNames('w-5 text-center', className)} {...props}>
//       <IconDelete01 onClick={onClick} />
//     </Cell>
//   );
// };

// const Cell_copy = ({
//   //
//   onClick,
//   className,
//   ...props
// }: Omit<Tprops_cell, 'children' | 'onClick'> & {
//   onClick: () => void;
// }) => {
//   return (
//     <Cell className={classNames('w-5 text-center', className)} {...props}>
//       <IconCopy onClick={onClick} />
//     </Cell>
//   );
// };

const QuotationRow_dealClass = ({
  //
  stateProd,

  prodKey,

  isActive,
  index,
  disabled,
  cellKeyArr,
  choseActiveProd,
  createClassProd,
  activedClassProd,
}: {
  stateProd: TstateProd;

  prodKey: string;

  isActive: boolean;
  index: number;
  disabled: boolean;
  cellKeyArr: TuseQuotationProductInstance['cellKeyArr'];
  choseActiveProd: TuseQuotationProductInstance['choseActiveProd'];
  createClassProd: TuseQuotationProductInstance['createClassProd'];
  activedClassProd: TuseQuotationProductInstance['activedClassProd'];
  rerenderTrigger01?: any; // 只在QuotationRow_dealClass_memo使用
}) => {
  const [viewRef, inView] = useInView();

  // const classProd = activedClassProd || createClassProd(stateProd);
  const classProd = activedClassProd?.state === stateProd ? activedClassProd : createClassProd(stateProd);

  const nodeConfig_itemName = classProd.nodeConfig['itemName'];

  const left = (
    <>
      <div ref={viewRef} className={scss.viewIndicator} />
      <Cell_delete onClick={() => {}} />
      <Cell_copy onClick={() => {}} />
      <Cell_indexNumber>{index + 1}</Cell_indexNumber>
      <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
        {nodeConfig_itemName.createNode({
          disabled,
          classProd,
        })}
      </Cell>
    </>
  );

  return (
    <Spin spinning={classProd.isFetching}>
      <QuotationRow_dnd
        //
        // rerenderTrigger01={classProd.state}
        // rerenderTrigger02={disabled}
        // rerenderTrigger03={cellKeyArr}
        //
        key={prodKey}
        id={prodKey}
        index={index}
        //
        isActive={isActive}
        left={left}
        //
        onDragStart={(e) => {
          choseActiveProd(undefined);
        }}
        onClick={(e) => {
          e.stopPropagation();
          choseActiveProd(classProd.state);
        }}
        className="min-h-11"
      >
        {cellKeyArr.map((cellKey, cIndex) => {
          const { style, className, createNode } = classProd.nodeConfig[cellKey];

          if (!inView) {
            return <div key={cellKey} className={classNames(className)} style={style} />;
          }

          const node = createNode({
            disabled,
            classProd,
          });

          return (
            <Cell key={cellKey} className={classNames(className)} style={style}>
              {node}
            </Cell>
          );
        })}
      </QuotationRow_dnd>
    </Spin>
  );
};

const QuotationRow_dealClass_memo = memo(QuotationRow_dealClass, (prev, next) => {
  return (
    prev.rerenderTrigger01 === next.rerenderTrigger01 &&
    // prev.stateProd === next.stateProd &&
    prev.disabled === next.disabled &&
    prev.isActive === next.isActive &&
    prev.cellKeyArr === next.cellKeyArr &&
    prev.index === next.index &&
    prev.createClassProd === next.createClassProd
  );
});

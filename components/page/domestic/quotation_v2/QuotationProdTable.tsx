import { useState, useEffect, memo } from 'react';

import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';

// antd
import { Spin } from 'antd';

// component
import {
  Tprops_cell,
  //
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
  Panel_iterativeProd_right_thead,
  Panel_iterativeProd_right,
  Panel_prod,
  Panel_iterativeProd,
  Panel_accessory,
} from 'components/page/domestic/quotation_v2/quotationRow';

// gear
import { InputSel_prod } from './hook/quotationProduct/ui/InputSel_prod';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// css
import scss from './QuotationProdTable.module.scss';

import {
  ClassProd,
  Tinstance_useQuotationProduct,
  // Tinstance_useQuotationProduct,
  TstateProd,
  TclassComponentDict,
  // TcreateSetComponent,
  // TcreateSetAccessory,
  TclassAccessoryDict,
  TstateProdDict,
  // TsetComponent,
  // TsetAccessory,
  TclassPsuedoComponentDict,
} from './hook/quotationProduct/useQuotationProduct';

import { SearchModal_prodAccessories } from 'components/composition/searchModal/useSearchModal/useSearchModal_prodAccessories';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';

// ===================================================================

interface Tprops {
  instance_useQuotationProductInstance: Tinstance_useQuotationProduct;
  disabled: boolean;
  className?: string;
  showQuotationDiscount?: TtableProps['showQuotationDiscount'];
  isIterativeProd?: TtableProps['isIterativeProd'];
  prodTotal?: TtableProps['prodTotal'];
}

interface TtableProps {
  instance_useQuotationProductInstance: Tinstance_useQuotationProduct;
  disabled: boolean;
  className?: string;
  showQuotationDiscount?: boolean;
  isIterativeProd?: boolean;
  prodTotal?: React.ReactNode;
}

// ===================================================================

// MARK: START
// 這個元件就是useQuotationProduct實例與UI元件的轉接器，
// 本來就預期會與useQuotationProduct高度耦合
export default function QuotationProdTable(tableProps: Tprops) {
  const {
    //
    disabled,
    className,
    showQuotationDiscount = true,
    isIterativeProd,
    prodTotal,
  } = tableProps;

  const instance_useQuotationProductInstance = tableProps.instance_useQuotationProductInstance;

  const activedProd = instance_useQuotationProductInstance.activedProd;

  // MARK:RENDER
  return (
    <div className={classNames(className)}>
      {/* 主產品 product */}
      <Table_prod
        instance_useQuotationProductInstance={instance_useQuotationProductInstance}
        disabled={disabled}
        showQuotationDiscount={showQuotationDiscount}
        isIterativeProd={isIterativeProd}
        prodTotal={prodTotal}
      />
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
    rerenderTrigger05?: any;
  }
) => {
  const { rerenderTrigger01, rerenderTrigger02, rerenderTrigger03, rerenderTrigger04, rerenderTrigger05, ...rest } =
    params;

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
    prev.rerenderTrigger04 === next.rerenderTrigger04 &&
    prev.rerenderTrigger05 === next.rerenderTrigger05

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
  showQuotationDiscount,
  isIterativeProd,
  prodTotal,
}: TtableProps) => {
  const {
    state_prodDict,
    activedProd,
    activedClassProd,

    prodKeyArr,
    setProdKeyArr,

    cellKeyArr,
    setCellKeyArr,

    choseActiveProd,

    nodeConfig_origin,

    quotationDiscount,
    setQuotationDiscount,

    // state_prodDict,

    createClassProd,
    // activedClassProd,

    addEmptyProd,
    removeProd,
    copyProd,
  } = instance_useQuotationProductInstance;

  let theadLeft = (
    <Panel_prod className_delete="invisible" className_copy="invisible">
      <Cell
        className={classNames('text-lg text-main', nodeConfig_origin['itemName'].className)}
        style={nodeConfig_origin['itemName'].style}
      >
        {nodeConfig_origin['itemName'].label}
      </Cell>
    </Panel_prod>
  );

  let theadRight: React.ReactNode = null;

  if (isIterativeProd) {
    theadLeft = (
      <Panel_iterativeProd className_reset="invisible" className_copy="invisible" className_copy2="invisible">
        <Cell
          className={classNames('text-lg text-main', nodeConfig_origin['itemName'].className)}
          style={nodeConfig_origin['itemName'].style}
        >
          {nodeConfig_origin['itemName'].label}
        </Cell>
      </Panel_iterativeProd>
    );

    theadRight = <Panel_iterativeProd_right_thead />;
  }

  return (
    <div
      id="quotationProdTableWrapper" // 作為下拉式選單的menuPortalTarget
      className={scss.prodTableWrapper}
    >
      <div className={scss.tablePanel}>
        <span className={scss.title}>主產品設定</span>
        {showQuotationDiscount && (
          <InputSel_prod
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
        )}
        {/* <SquareBtn className="ml-2" sharp="mini">
          編輯欄位排序
        </SquareBtn> */}
      </div>
      {/*  */}
      <div className={classNames(scss.prodTable, className)}>
        <div className={classNames(scss.table, 'pb-5')}>
          <QuotationRow_dndThead
            className={scss.rowThead}
            // disabled={disabled}
            disabled={true}
            keyArr={cellKeyArr}
            onDragEnd={({ move }) => {
              setCellKeyArr(move(cellKeyArr));
            }}
            configDict={nodeConfig_origin}
            dragHandleInvisible={true}
            left={theadLeft}
            right={theadRight}
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
                  rerenderTrigger01={stateProd.renderCount}
                  prodKey={prodKey}
                  stateProd={stateProd}
                  disabled={disabled}
                  isActive={isActive}
                  cellKeyArr={cellKeyArr}
                  index={index}
                  isIterativeProd={isIterativeProd}
                  instance_useQuotationProductInstance={instance_useQuotationProductInstance}
                />
              );
            })}
          </Table_dnd>
        </div>
        <div className={classNames(scss.bottom)}>
          <SquareBtn sharp="mini" onClick={addEmptyProd} className={classNames(scss.btn, disabled && 'invisible')}>
            新增主產品
          </SquareBtn>
          <div className={scss.total}>複價合計：{prodTotal}</div>
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

    // createActivedClassComponentDict,
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
          // disabled={disabled}
          disabled={true}
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
                rerenderTrigger01={classComponent.state}
                rerenderTrigger02={classComponent.state.renderCount}
                rerenderTrigger03={disabled}
                rerenderTrigger04={cellKeyArr_component} // 應該不需要
                rerenderTrigger05={classComponent.constructor} // 應該不需要
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
                rerenderTrigger01={classComponent.state.renderCount}
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
    activedClassProd,
    activedClassAccessoryDict,
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr,
    setAccessoryKeyArr,
    nodeConfig_accessory_origin,
    // createActivedClassAccessoryDict,
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
        <div className={classNames(scss.table, 'pb-5')}>
          <QuotationRow_dndThead
            className={scss.rowThead}
            // disabled={disabled}
            disabled={true}
            keyArr={cellKeyArr_accessory}
            onDragEnd={({ move }) => {
              setCellKeyArr_accessory(move(cellKeyArr_accessory));
            }}
            configDict={nodeConfig_accessory_origin}
            dragHandleInvisible={true}
            left={
              <Panel_accessory className_delete="invisible">
                <Cell
                  className={classNames('text-xl text-main', nodeConfig_accessory_origin['name'].className)}
                  style={nodeConfig_accessory_origin['name'].style}
                >
                  {nodeConfig_accessory_origin['name'].label}
                </Cell>
              </Panel_accessory>
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
                <Panel_accessory
                  onDeleteClick={() => activedClassProd?.removeAccessory(acceKey)}
                  indexNumber={index + 1}
                >
                  <Cell className={classNames(nodeConfig_name.className)} style={nodeConfig_name.style}>
                    {nodeConfig_name.createNode({
                      disabled,
                      classAcce: classAccessory,
                    })}
                  </Cell>
                </Panel_accessory>
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
        <DragableModal style={{ zIndex: 50 }} show={showSelector} onCrossClick={() => setShowSelector(false)}>
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

const QuotationRow_dealClass = ({
  //

  isActive,
  index,
  disabled,
  cellKeyArr,
  // choseActiveProd,
  // createClassProd,
  // activedClassProd,
  // //
  // removeProd,
  // copyProd,
  isIterativeProd,

  stateProd,
  prodKey,

  instance_useQuotationProductInstance: {
    //
    choseActiveProd,
    createClassProd,
    activedClassProd,
    removeProd,
    copyProd,
  },
}: {
  rerenderTrigger01?: any; // 只在QuotationRow_dealClass_memo使用

  disabled: boolean;
  isActive: boolean;
  cellKeyArr: Tinstance_useQuotationProduct['cellKeyArr'];
  index: number;

  isIterativeProd?: boolean;

  instance_useQuotationProductInstance: Tinstance_useQuotationProduct;

  stateProd: TstateProd;
  prodKey: string;
}) => {
  const [viewRef, inView] = useInView();

  // const classProd = activedClassProd || createClassProd(stateProd);
  const classProd = activedClassProd?.state === stateProd ? activedClassProd : createClassProd(stateProd);

  const nodeConfig_itemName = classProd.nodeConfig['itemName'];

  let left = (
    <>
      <div ref={viewRef} className={scss.viewIndicator} />
      <Panel_prod
        onDeleteClick={() => removeProd(classProd.key)}
        onCopyClick={() => copyProd(classProd.key)}
        indexNumber={index + 1}
      >
        <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
          {nodeConfig_itemName.createNode({
            disabled,
            classProd,
          })}
        </Cell>
      </Panel_prod>
    </>
  );

  let right: React.ReactNode = null;

  if (isIterativeProd) {
    left = (
      <>
        <div ref={viewRef} className={scss.viewIndicator} />
        <Panel_iterativeProd>
          <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
            {nodeConfig_itemName.createNode({
              disabled,
              classProd,
            })}
          </Cell>
        </Panel_iterativeProd>
      </>
    );

    right = (
      <Panel_iterativeProd_right
        qty="9999"
        price="9999"
        reduceValue="9999"
        modifyValue="9999"
        onReduceChange={() => {}}
        onModifyChange={() => {}}
      />
    );
  }

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
        right={right}
        dragHandleInvisible={isIterativeProd}
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
    prev.index === next.index
    // &&
    // prev.createClassProd === next.createClassProd
  );
});

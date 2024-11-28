import { memo } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// antd
import { Tabs } from 'antd';

import {
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
} from 'components/page/domestic/quotation_v2/quotationRow';

// css
import scss from './QuotationProdTable.module.scss';

import { TuseQuotationProductInstance } from './hook/quotationProduct/useQuotationProduct';

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

  // MARK:RENDER
  return (
    <div className={className}>
      {/* 主產品 product */}
      <Table_prod instance_useQuotationProductInstance={instance_useQuotationProductInstance} disabled={disabled} />
      <br />

      <Tabs>
        <Tabs.TabPane tab="材料配件" key="1">
          {/* 材料配件 component */}
          <Table_component
            instance_useQuotationProductInstance={instance_useQuotationProductInstance}
            disabled={disabled}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="選配設定" key="2">
          {/* 選配設定 */}
          <Table_accessory
            instance_useQuotationProductInstance={instance_useQuotationProductInstance}
            disabled={disabled}
          />
        </Tabs.TabPane>
      </Tabs>
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
  }
) => {
  const { rerenderTrigger01, rerenderTrigger02, rerenderTrigger03, ...rest } = params;

  return <QuotationRow_dnd {...rest} />;
};

const QuotationRow_dnd_memo = memo(QuotationRow_dnd_preMemo, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.isActive === next.isActive &&
    prev.index === next.index &&
    prev.rerenderTrigger01 === next.rerenderTrigger01 &&
    prev.rerenderTrigger02 === next.rerenderTrigger02 &&
    prev.rerenderTrigger03 === next.rerenderTrigger03

    // 把rerenderTrigger設為陣列的方案發生問題
    // _.isEqual(prev.rerenderTrigger, next.rerenderTrigger)
  );
});

// MARK:Table_prod
const Table_prod = ({ instance_useQuotationProductInstance, disabled, className }: TtableProps) => {
  const {
    classProdDict,
    activedClassProd: activeClassProd,
    //
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
    //
    nodeConfig_origin,
  } = instance_useQuotationProductInstance;

  return (
    <div className={classNames(scss.prodTable, className)}>
      <QuotationRow_dndThead
        disabled={disabled}
        keyArr={cellKeyArr}
        onDragEnd={({ move }) => {
          setCellKeyArr(move(cellKeyArr));
        }}
        configDict={nodeConfig_origin}
        dragHandleInvisible={true}
        left={
          <>
            <Cell
              className={classNames(nodeConfig_origin['itemName'].className)}
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
          const classProd = classProdDict[prodKey];
          const isActive = activeClassProd === classProd;

          const nodeConfig_itemName = classProd.nodeConfig['itemName'];

          const left = (
            <>
              <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
                {nodeConfig_itemName.createNode({
                  disabled,
                  classProd,
                })}
              </Cell>
            </>
          );

          return (
            <QuotationRow_dnd_memo
              //
              rerenderTrigger01={classProd.state}
              rerenderTrigger02={disabled}
              rerenderTrigger03={cellKeyArr}
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

                // if (!isActive) {
                //   choseActiveProd(classProd.state);

                //   const handler = () => {
                //     choseActiveProd(undefined);
                //     window?.removeEventListener('click', handler);
                //   };

                //   window?.addEventListener('click', handler);
                // }
              }}
            >
              {cellKeyArr.map((cellKey, cIndex) => {
                const { style, className, createNode } = classProd.nodeConfig[cellKey];

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
            </QuotationRow_dnd_memo>
          );
        })}
      </Table_dnd>
    </div>
  );
};

// MARK:Table_component
const Table_component = ({ instance_useQuotationProductInstance, disabled, className }: TtableProps) => {
  const {
    activedClassComponentArr,
    activedClassComponentDict,
    cellKeyArr_component,
    setCellKeyArr_component,
    componentKeyArr,
    setComponentKeyArr,
    nodeConfig_component_origin,
  } = instance_useQuotationProductInstance;

  return (
    <div className={classNames(scss.componentTable, className)}>
      <QuotationRow_dndThead
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
              className={classNames(nodeConfig_component_origin['name'].className)}
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
          if (!activedClassComponentDict) {
            return null;
          }

          const classComponent = activedClassComponentDict[componentKey];

          if (!classComponent) {
            return null;
          }

          const nodeConfig_name = classComponent.nodeConfig['name'];

          const left = (
            <>
              <Cell className={classNames(nodeConfig_name.className)} style={nodeConfig_name.style}>
                {nodeConfig_name.createNode({
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
              rerenderTrigger03={cellKeyArr_component}
              //
              key={componentKey}
              id={componentKey}
              index={index}
              //
              // isActive={isActive}
              left={left}
              //
              // onDragStart={(e) => {
              //   choseActiveProd(undefined);
              // }}
            >
              {cellKeyArr_component.map((cellKey, cIndex) => {
                const { style, className, createNode } = classComponent.nodeConfig[cellKey];

                const node = createNode({
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
  );
};

// MARK:Table_accessory
const Table_accessory = ({ instance_useQuotationProductInstance, disabled, className }: TtableProps) => {
  const {
    activedClassAccessoryDict,
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr,
    setAccessoryKeyArr,
    nodeConfig_accessory_origin,
  } = instance_useQuotationProductInstance;

  return (
    <div className={classNames(scss.accessoryTable, className)}>
      <QuotationRow_dndThead
        disabled={disabled}
        keyArr={cellKeyArr_accessory}
        onDragEnd={({ move }) => {
          setCellKeyArr_accessory(move(cellKeyArr_accessory));
        }}
        configDict={nodeConfig_accessory_origin}
        dragHandleInvisible={true}
        left={
          <>
            <Cell
              className={classNames(nodeConfig_accessory_origin['name'].className)}
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

          // 沒出錯的話，這是一定會有的
          const classAccessory = activedClassAccessoryDict[acceKey];

          const nodeConfig_name = classAccessory.nodeConfig['name'];

          const left = (
            <>
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
              left={left}
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
  );
};

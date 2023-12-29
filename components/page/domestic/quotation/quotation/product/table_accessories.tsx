import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import AccessorySelector, { TdoorAccessoryDto } from 'components/global/gear/modal/accessorySelector';

// type
import { TaccessoriesKey, TaccessoriesList } from 'hooks/quotation/useProduct';
// css
import scss from '../table.module.scss';

export default function Table_accessories({
  disabled,
  list,
  cellConfig,
  keyArr,
  changeKeyArr,
  defalutVKeyArr,
  onVKeyChange,
  doorModel,
  onSelectorConfirm,
  panelBox,
  emptyBlockWidth,
  isRedBorder,
}: {
  disabled: boolean;
  list: TaccessoriesList | undefined;
  cellConfig: TcellConfig;
  keyArr: TaccessoriesKey[];
  changeKeyArr: (arr: TaccessoriesKey[]) => void;
  defalutVKeyArr?: string[] | undefined;
  onVKeyChange?: (keyArr: string[] | undefined) => void;
  doorModel: string | undefined;
  onSelectorConfirm: (arr: TdoorAccessoryDto[]) => void;
  panelBox?: 'copyDelBtnBox' | 'easyBox' | 'comBox';
  emptyBlockWidth?: string;
  isRedBorder?: boolean;
}) {
  const [showSelector, setShowSelector] = useState(false);

  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={classNames(scss.tableContainer, isRedBorder && scss.redBorder)}>
      <div className={scss.header}>
        <h2>選配設定</h2>
        <button className={(allowMove && scss.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      {/*  */}
      <div className={scss.main}>
        <div className={scss.listContainer}>
          <div className={scss.theadContainer}>
            <DndThead
              keyArr={keyArr}
              cellConfigList={cellConfig}
              allowMove={allowMove}
              resetTrigger={keyArr.length}
              emptyBlockWidth={emptyBlockWidth || '137px'}
              onDragEndCallback={(dndKeyArr) => {
                const keyArr = dndKeyArr as TaccessoriesKey[];
                changeKeyArr(keyArr);
              }}
            />
          </div>
          {list && (
            <Tbody
              disabled={disabled}
              rowList={list}
              keyArr={keyArr}
              prodCellConfig={cellConfig}
              onRowClick={(obj) => {}}
              // defalutVKeyArr={defalutVKeyArr}
              onVKeyChange={onVKeyChange}
              panelBox={panelBox}
            />
          )}

          {!disabled && (
            <div className={classNames(scss.addBtnWrapper)}>
              <MyButton_v2
                className={scss.addBtn}
                label="新增選配"
                onClick={() => {
                  if (!doorModel) {
                    return myAlert.info({ title: '請先選擇主產品與主產品門型' });
                  }

                  setShowSelector(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/*  */}
      <AccessorySelector
        showModal={showSelector}
        modelName={doorModel}
        onConfirm={onSelectorConfirm}
        onCancel={() => setShowSelector(false)}
      />
    </div>
  );
}

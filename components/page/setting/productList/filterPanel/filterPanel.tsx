import { useState } from 'react';

// antd
import { Collapse, Checkbox } from 'antd';
const { Panel } = Collapse;

// css
import scss from './filterPanel.module.scss';

// type
import type { TprodClassOptions, TdoorTypeOptions, TpartOptions, TfilterCtrl } from 'pages/setting/productList';

// =============================================================================
export default function FilterPanel({
  prodClassOptions,
  doorTypeOptions,
  partOptions,
  filterCtrl,
}: {
  prodClassOptions: TprodClassOptions;
  doorTypeOptions: TdoorTypeOptions;
  partOptions: TpartOptions;
  filterCtrl: TfilterCtrl;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const switchPanel = () => setIsOpen(!isOpen);

  const {
    checkedProdClass,
    checkProdClass,
    checkedDoorType,
    checkDoorType,
    checkedPart,
    checkPark,
    filterConfirm,
    filterClear,
  } = filterCtrl;

  // --------------------------------------------------------------------------
  return (
    <div className={scss.filterPanel}>
      <Collapse activeKey={+isOpen} ghost>
        <Panel
          className={scss.panel}
          key={1}
          header={<PanelHeader switchPanel={switchPanel} isOpen={isOpen} />}
          showArrow={false}
        >
          <div className={scss.panelBody}>
            <div className={scss.item}>
              <p className={scss.caption}>類別</p>
              <div className={scss.checkContainer}>
                {prodClassOptions.map((option, index) => {
                  const { label, value } = option;
                  const checked = checkedProdClass.find((item) => item === value);

                  return (
                    <Checkbox
                      className={scss.checkBox}
                      key={index}
                      checked={!!checked}
                      onChange={() => checkProdClass(value)}
                    >
                      {label}
                    </Checkbox>
                  );
                })}
              </div>
            </div>

            <div className={scss.item}>
              <p className={scss.caption}>門型</p>
              <div className={scss.checkContainer}>
                {doorTypeOptions.map((option, index) => {
                  const { label, value } = option;
                  const checked = checkedDoorType.find((item) => item === value);

                  return (
                    <Checkbox
                      className={scss.checkBox}
                      key={index}
                      checked={!!checked}
                      onChange={() => checkDoorType(value)}
                    >
                      {label}
                    </Checkbox>
                  );
                })}
              </div>
            </div>

            <div className={scss.item}>
              <p className={scss.caption}>顯示條件</p>
              <div className={scss.checkContainer02}>
                {partOptions.map((option, index) => {
                  const { label, value } = option;
                  const checked = checkedPart.find((item) => item === value);

                  return (
                    <Checkbox
                      className={scss.checkBox}
                      key={index}
                      checked={!!checked}
                      onChange={() => checkPark(value)}
                    >
                      {label}
                    </Checkbox>
                  );
                })}
              </div>
            </div>

            <div className={scss.sideBtnBox}>
              <button onClick={filterConfirm}>
                <span>篩選</span>
              </button>
              <button onClick={filterClear}>
                <span>清除</span>
              </button>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
}

// ==============================================================================

const PanelHeader = ({ switchPanel, isOpen }: { switchPanel: () => void; isOpen: boolean }) => {
  return (
    <div className={scss.panelHeader}>
      <span>篩選內容</span>
      <button onClick={switchPanel}>
        <span>{isOpen ? '收合' : '展開'}</span>
      </button>
    </div>
  );
};

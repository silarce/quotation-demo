import { useState, useEffect } from 'react';

import classNames from 'classnames';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';

import { Class_legacyContract, Class_addition } from 'hooks/quotation/useLegacyContract';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// css
import styleL from '../local.module.scss';
import scss from './quotationAdditions_legacyContract.module.scss';

export default function QuotationAdditions({
  legacyContract,
  disabled,
  isAppend,
  isExchange,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
  isExchange?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const { additionCellConfig: additionCellConfig } = legacyContract;

  const additionArr = legacyContract.classAdditionArr;

  const { addAddition, delAddition } = legacyContract ?? {};

  const additionKeyindex = additionCellConfig.keyList;
  const cellConfig = additionCellConfig.cellConfig;

  return (
    <div className={scss.container}>
      <div className={styleL.header}>
        <h2>其他設定</h2>
      </div>

      <div className={scss.main}>
        <div className={scss.left}>
          {/* thead */}
          <div className={styleL.thead + ' ' + scss.thead}>
            <div className={scss.btnBox} />

            {additionKeyindex.map((item, index) => {
              const { label, flex, width } = cellConfig[item];
              const theStyle = { width, flex };

              return (
                <div className={classNames(styleL.theadCell, 'relative')} key={index} style={theStyle}>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          {/* tbody */}
          {additionArr?.map((part, pIndex) => {
            return (
              <CellWithBar
                key={pIndex}
                isActive={activeIndex === pIndex}
                className={classNames(styleL.row, scss.row)}
                onClick={() => {
                  setActiveIndex(pIndex);
                }}
              >
                {/*  */}

                <ProdBtnBox disabled={disabled} del={() => delAddition(pIndex)} indexNumber={pIndex + 1} />
                {/*  */}
                {additionKeyindex.map((key, cIndex) => {
                  const { width, flex, type, inputType } = cellConfig[key];
                  const theStyle = { width, flex };

                  let showBaseline: 'auto' | 'invisible' = 'auto';

                  let theDisabled = disabled;

                  if (key === 'quotationNumber') {
                    theDisabled = true;
                    showBaseline = 'invisible';
                  }

                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <InputSel
                        disabled={theDisabled}
                        showBaseline={showBaseline}
                        inputProps={{
                          value: part[key],
                          onChange: (v) => (part[key] = v),
                          inputType: inputType,
                        }}
                      />
                    </div>
                  );
                })}
              </CellWithBar>
            );
          })}
          {!disabled && <AddButton className={scss.addBtn} label="新增項目" onClick={addAddition} />}
        </div>
        <div className={scss.right}></div>
      </div>
    </div>
  );
}

// =======================================================================
const ProdBtnBox = ({
  disabled,
  del,
  indexNumber,
}: {
  disabled?: boolean;
  del: () => void;
  indexNumber: number | string;
}) => {
  return (
    <div className={scss.btnBox}>
      <div className={scss.delBtn}>
        <IconDelete01
          onClick={(e) => {
            e.stopPropagation();

            if (disabled) {
              return;
            }

            del;
          }}
        />
      </div>

      <span>{indexNumber}</span>
    </div>
  );
};

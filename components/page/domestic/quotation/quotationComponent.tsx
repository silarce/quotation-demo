// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';

// css
import style from './quotationComponent.module.scss';
import styleL from './local.module.scss';

// options
import { Toption, optionsCreator_material, optionsCreator_surface } from 'js/utils/options/options';

const optionsObj: {
  [key: string]: Toption[];
} = {
  material: optionsCreator_material(),
  surface: optionsCreator_surface(),
};

// type
import { Class_quotation, TpartSelectCellType } from 'hooks/quotation/useQuotation';

// =========================================================
export default function QuotationComponent({
  classQuotation,
  disabled = false,
}: {
  classQuotation: Class_quotation;
  disabled: boolean;
}) {
  const { partCellConfig } = classQuotation;
  const partList = classQuotation.mainProductArr[classQuotation.activeMainProd]?.partArr;
  const addPart = classQuotation.mainProductArr[classQuotation.activeMainProd]?.addPart;
  const partKeyindex = partCellConfig.keyList;
  const cellConfig = partCellConfig.cellConfig;

  return (
    <>
      <div className={styleL.header}>
        <h2>材料/配件設定</h2>
      </div>

      <div className={styleL.scrollDiv + ' ' + style.scrollDiv}>
        {/* thead */}
        <div className={styleL.thead + ' ' + style.thead}>
          <div className={styleL.rowIndex}>
            <span></span>
          </div>
          {partKeyindex.map((item, index) => {
            const { label, width } = cellConfig[item];
            const theStyle = { width };

            return (
              <div className={styleL.theadCell} key={index} style={theStyle}>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {/* tbody */}
        <div>
          {!partList && (
            <>
              <div className={styleL.rowIndex}></div>
              <span className={styleL.noListTip}>尚未選擇產品</span>
            </>
          )}
        </div>
        {/*  */}
        {partList?.map((part, pIndex) => {
          return (
            <div className={styleL.row} key={pIndex}>
              <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div>

              {partKeyindex.map((key, cIndex) => {
                const { width, type } = cellConfig[key];
                const theStyle = { width };
                let item = part[key];

                // _______
                if (item === null) {
                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <div>
                        <span></span>
                      </div>
                    </div>
                  );
                }

                // _______
                if (type === 'readOnly') {
                  let theTwo;

                  if (typeof item === 'object' && 'value' in item) {
                    item = item.value;
                  }

                  if (typeof item === 'string') {
                    // 如果是數值，就加千分位符號
                    const intReg = /^[0-9]*$/;
                    const floatReg = /^[+-]?\d+(\.\d+)?$/;

                    if (intReg.test(item) || floatReg.test(item)) {
                      item = item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }

                    // 改變平方單位的格式
                    const unitReg = /cm2|m2|km2|mm2 /;

                    if (unitReg.test(item)) {
                      item = item.replace(/[0-9]/g, '');
                      theTwo = 2;
                    }
                  }

                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <div>
                        <span>{item}</span>
                        <sup>{theTwo}</sup>
                      </div>
                    </div>
                  );
                }

                // _______
                if (type === 'select') {
                  const onChange = (option: Toption | null) => {
                    part[key as keyof TpartSelectCellType] = option!;
                  };

                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <InputSel
                        selectProps={{
                          value: item,
                          options: optionsObj[key],
                          onChange,
                          arrowType: 'black',
                          fontSize: '16px',
                        }}
                        disabled={disabled}
                      />
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
        {partList && !disabled && <AddButton className={style.addBtn} label="新增材料/配件" onClick={addPart} />}
      </div>
    </>
  );
}

import classNames from 'classnames';
import _ from 'lodash';
import Image from 'next/image';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './table_quotationRanges.module.scss';

// options
import {
  optionsCreator_category,
  optionsCreator_doorModel_2,
  optionsCreator_doorForm,
} from 'js/utils/options/productOptions';

// icon
import { IconEdit, IconCopy, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
import iconCheck from 'public/image/icon/check02.svg';
import iconCross from 'public/image/icon/cross_thin.svg';

// type
import { TquotationRangeDto, TcreateQuotationRangeDto } from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';
import { Class_quotationRange } from 'pages/setting/quotationRanges';
import { TuseClassQuotationRange } from 'pages/setting/quotationRanges';

// =======================================================================
const optionArr_category = optionsCreator_category();
const optionArr_doorModel = optionsCreator_doorModel_2();
const optionArr_doorForm = optionsCreator_doorForm();

// =======================================================================
export default function Table_quotationRange({
  quotationRangeArr,
  hookPack,
  apiReq,
  viewRef,
}: {
  quotationRangeArr: TquotationRangeDto[] | undefined;
  hookPack: ReturnType<TuseClassQuotationRange>;
  apiReq: (method: 'post' | 'patch' | 'delete', delId?: string) => void;
  viewRef: (node?: Element | null | undefined) => void;
}) {
  const { classQuotationRange, clearRange, editClassRange, copyClassRange } = hookPack;

  return (
    <div className={scss.table}>
      <Thead />
      <div className={scss.tbodyWrapper}>
        {classQuotationRange?.source === 'new' && (
          <EditRow
            className={scss.editRow_add}
            classQuotationRange={classQuotationRange}
            cancel={clearRange}
            confirm={() => apiReq('post')}
          />
        )}
        <BodyRowGroup
          quotationRangeArr={quotationRangeArr}
          editClassRange={editClassRange}
          classQuotationRange={classQuotationRange}
          clearRange={clearRange}
          apiReq={apiReq}
          copyClassRange={copyClassRange}
          viewRef={viewRef}
        />
      </div>
    </div>
  );
}

// ===========================================================================
const Thead = () => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      {headKeyArr.map((key) => {
        const { label, className } = config[key];

        return (
          <div key={key} className={classNames(className)}>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

const EditRow = ({
  classQuotationRange,
  cancel,
  confirm,
  className,
}: {
  classQuotationRange?: Class_quotationRange;
  cancel: () => void;
  confirm: () => void;
  className?: string;
}) => {
  if (!classQuotationRange) {
    return null;
  }

  return (
    <CellWithBar isActive={true} className={classNames(scss.row, scss.editRow, className)}>
      {addKeyArr.map((key) => {
        const { className, optionArr } = config[key];

        return (
          <div key={key} className={classNames(className)}>
            {(() => {
              if (optionArr) {
                return (
                  <InputSel
                    selectProps={{
                      value: classQuotationRange[key],
                      options: optionArr,
                      onChange: (option) => {
                        classQuotationRange[key] = option!.value;
                      },
                      arrowType: 'black',
                      fontSize: '16px',
                    }}
                  />
                );
              }

              return (
                <InputSel
                  textareaProps={{
                    value: classQuotationRange[key] ?? '',
                    onChange: (v) => {
                      classQuotationRange[key] = v;
                    },
                    className: scss.inputSel_textarea,
                  }}
                />
              );
            })()}
          </div>
        );
      })}
      <Image className={config.confirm.className} src={iconCheck} alt="確認" onClick={confirm} />
      <Image className={config.cancel.className} src={iconCross} alt="取消" onClick={cancel} />
    </CellWithBar>
  );
};

const BodyRowGroup = ({
  quotationRangeArr,
  editClassRange,
  classQuotationRange,
  clearRange,
  apiReq,
  copyClassRange,
  viewRef,
}: {
  quotationRangeArr: TquotationRangeDto[] | undefined;
  editClassRange: (quotationRange: TquotationRangeDto) => void;
  classQuotationRange: Class_quotationRange | undefined;
  clearRange: () => void;
  apiReq: (method: 'post' | 'patch' | 'delete', delId?: string) => void;
  copyClassRange: (quotationRange: TquotationRangeDto) => void;
  viewRef: (node?: Element | null | undefined) => void;
}) => {
  const quotationRangeLookup = _.groupBy(quotationRangeArr, 'category');
  const keyArr = Object.keys(quotationRangeLookup);

  return (
    <div className={scss.tbody}>
      {keyArr.map((rangeKey) => {
        const arr = quotationRangeLookup[rangeKey];

        return (
          <div className={scss.bodyRowGroup} key={rangeKey}>
            <div className={classNames(scss.row, scss.rowTitle)}>
              <span>{rangeKey}</span>
            </div>
            {arr.map((range, index) => {
              const { id, doorModelName, type, description } = range;

              if (classQuotationRange?.id === id && classQuotationRange.source === 'edit') {
                return (
                  <EditRow
                    key={id}
                    classQuotationRange={classQuotationRange}
                    cancel={clearRange}
                    confirm={() => apiReq('patch')}
                  />
                );
              }

              const ref = index === arr.length - 5 ? viewRef : undefined;
              // const ref = (index === arr.length - 5) ? undefined : undefined

              return (
                <CellWithBar key={id} className={classNames(scss.row, scss.item)}>
                  <div ref={ref} className={config['category'].className}></div>
                  <div className={config['doorModelName'].className}>
                    <span>{doorModelName}</span>
                  </div>
                  <div className={config['type'].className}>
                    <span>{typeLookup[type]}</span>
                  </div>
                  <div className={config['description'].className}>
                    <span>{description}</span>
                  </div>
                  <div className={config['edit'].className} onClick={() => editClassRange(range)}>
                    <IconEdit />
                  </div>
                  <div className={config['copy'].className} onClick={() => copyClassRange(range)}>
                    <IconCopy />
                  </div>
                  <div
                    className={config['del'].className}
                    onClick={() =>
                      myAlert.confirm({
                        title: '確定刪除備註?',
                        content: description,
                        props: {
                          onOk: () => apiReq('delete', id),
                        },
                      })
                    }
                  >
                    <IconDelete01 />
                  </div>
                </CellWithBar>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ===========================================================================

type Tconfig = {
  readonly [key: string]: {
    readonly label?: string;
    readonly className?: string;
    readonly optionArr?: Toption[];
  };
};

const config: Tconfig = {
  category: {
    label: '類別',
    className: 'w-[156px] flex-none',
    optionArr: optionArr_category,
  },
  doorModelName: {
    label: '門型',
    className: 'w-[86px] flex-none',
    optionArr: optionArr_doorModel,
  },
  type: {
    label: '形式',
    className: 'w-[64px] flex-none',
    optionArr: optionArr_doorForm,
  },
  description: {
    label: '內容',
    className: 'w-auto flex-auto',
  },
  edit: {
    className: 'w-[20px] flex-none',
  },
  copy: {
    className: 'w-[20px] flex-none',
  },
  del: {
    className: 'w-[20px] flex-none',
  },
  confirm: {
    className: 'w-[20px] flex-none',
  },
  cancel: {
    className: 'w-[20px] flex-none',
  },
};

const headKeyArr = ['category', 'doorModelName', 'type', 'description'] as const;

const bodyKeyArr = ['category', 'doorModelName', 'type', 'description', 'edit', 'copy', 'del'] as const;

const addKeyArr = ['category', 'doorModelName', 'type', 'description'] as const;

// =============================================================================
const typeLookup = {
  normal: '一般',
  'anti-typhoon': '防颱',
} as const;

// =============================================================================

import { useState, useEffect } from 'react';
import _ from 'lodash';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert, { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';
import LoadingCoverWrapper01 from '../loadingCover/loadingCoverWrapper01';

// css
import style from './workSheetSelector.module.scss';

import {
  Tparams,
  TgetAnnotation,
  TgetQuotataionRanges,
  useGetAnnotation_v2,
  useGetQuotationRanges_v2,
} from 'js/api/api_workSheet';

// other
import { optionsCreator_doorForm } from 'js/utils/options/productOptions';

// ================================================================

const doorFormLookup = (() => {
  const optionArr = optionsCreator_doorForm();
  const lookup: { [key: string]: string } = {};
  optionArr.forEach((option) => {
    const { value, label } = option;
    lookup[value] = label;
  });

  return lookup;
})();

const doorFormLookup_reverse = (() => {
  const optionArr = optionsCreator_doorForm();
  const lookup: { [key: string]: string } = {};
  optionArr.forEach((option) => {
    const { value, label } = option;
    lookup[label] = value;
  });

  return lookup;
})();

// ================================================================
export default function WorkSheetSelector({
  showModal,
  onConfirm,
  onCancel,
  label,
  tip,
  selLimit,
  apiFamily,
}: {
  showModal: boolean;
  onConfirm: (v: TgetAnnotation['data'] | TgetQuotataionRanges['data']) => void;
  onCancel: () => void;
  label?: string;
  tip?: React.ReactNode;
  selLimit?: 1;
  apiFamily: 'annotation' | 'quotationRanges';
}) {
  // 被選的資料
  const [selSheetArr, setSelSheetArr] = useState<TgetAnnotation['data'] | TgetQuotataionRanges['data']>([]);

  const [searchValue, setSearchValue] = useState<string | undefined>();

  const params: Tparams = (() => {
    let type: string | undefined = undefined;

    if (searchValue) {
      type = doorFormLookup_reverse[searchValue];
    }

    return {
      filter: {
        $or: {
          category: { $contains: searchValue },
          doorModelName: { $contains: searchValue },
          type: { $eq: type },
          description: { $contains: searchValue },
        },
      },
    };
  })();

  const annoPack = useGetAnnotation_v2(params);

  const qrPack = useGetQuotationRanges_v2(params);

  const {
    data: sheetArr,
    reset,
    setData,
    viewRef,
    isLoading,
  } = (() => {
    if (apiFamily === 'annotation') {
      return annoPack;
    } else {
      return qrPack;
    }
  })();

  // ==================================================

  const onClick = (newSheet: TgetAnnotation['data'][number] | TgetQuotataionRanges['data'][number]) => {
    const newArr = [...selSheetArr];

    if (selLimit === 1) {
      newArr[0] = newSheet;
      setSelSheetArr(newArr);

      return;
    }

    const theIndex = newArr.findIndex((emp) => emp.id === newSheet.id);

    if (theIndex > -1) {
      newArr.splice(theIndex, 1);
    } else {
      newArr.push(newSheet);
    }

    setSelSheetArr(newArr);
  };

  const theOnConfirm = () => {
    if (!selSheetArr) {
      return ModalInfo('請選擇客戶');
    }

    onConfirm(selSheetArr);
    theOnCancel();
  };

  const theOnCancel = () => {
    onCancel();
    setSelSheetArr([]);
  };

  const onSearch = (v: string) => {
    setSearchValue(v);
  };

  useEffect(() => {
    if (showModal) {
      reset();
    }

    if (!showModal) {
      setSearchValue(undefined);
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal]);

  // ==================================================

  return (
    <ModalListSelectorWithSearch
      label={label ?? ''}
      open={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      onSearch={onSearch}
      width={'1000'}
      className={style.container}
      tip={tip}
    >
      <LoadingCoverWrapper01 isLoading={isLoading}>
        <div className={style.listContainer}>
          {sheetArr?.map((sheet, index, arr) => {
            const { id, category, doorModelName, type, description } = sheet;

            const isActive = selSheetArr.some((selSheet) => selSheet.id === id);

            const theViewRef = (() => {
              if (arr.length - 11 === index) {
                return viewRef;
              }

              return undefined;
            })();

            const typeLabel = doorFormLookup[type];

            return (
              <CellWithBar key={index} isActive={isActive}>
                <div className={`${style.listItem}`} onClick={() => onClick(sheet)} ref={theViewRef}>
                  <span>{category}</span>
                  <span>{doorModelName}</span>
                  <span>{typeLabel}</span>
                  <span>{description}</span>
                </div>
              </CellWithBar>
            );
          })}
        </div>
      </LoadingCoverWrapper01>
    </ModalListSelectorWithSearch>
  );
}

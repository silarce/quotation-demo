import { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

// component
import Table_quotationRanges from 'components/page/setting/quotationRanges/table_quotationRanges';

// glogal gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './quotationRanges.module.scss';

// api
import {
  TcreateQuotationRangeDto,
  useGetQuotationRanges_v2,
  apiPostQuotationRanges,
  apiPatchQuotationRanges,
  apiDeleteQuotationRanges,
} from 'js/api/api_workSheet';

// type
import { TquotationRangeDto } from 'js/api/dtoTypes';
import { Tparams } from 'js/api/dtoTypes';

// other
import {
  Toption,
  optionsCreator_category,
  optionsCreator_doorModel_2,
  optionsCreator_doorForm,
} from 'js/utils/options/productOptions';

// ==========================================================================
const optionsCategory = optionsCreator_category({ haveEmpty: true });
const optionsDoorModel = optionsCreator_doorModel_2({ haveEmpty: true });
const optionsDoorForm = optionsCreator_doorForm({ haveEmpty: true });

type Tfilter = Partial<Pick<TquotationRangeDto, 'category' | 'doorModelName' | 'type' | 'description'>>;

// ==========================================================================
export default function QuotationRanges() {
  const [isLoading, setIsLoading] = useState(false);
  // ------------------------------------------------------------------------

  const [filter, setFilter] = useState<Tfilter>({
    category: undefined,
    doorModelName: undefined,
    type: undefined,
    description: undefined,
  });

  const params: Tparams = {
    sort: 'updatedAt',
    filter: {
      category: { $eq: filter.category },
      doorModelName: { $eq: filter.doorModelName },
      type: { $eq: filter.type },
      description: { $contains: filter.description },
    },
  };
  const { data: quotationRangeArr, reset, viewRef, isLoading: getIsLoading } = useGetQuotationRanges_v2(params);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const hookPack = useClassQuotationRange();
  const { classQuotationRange, newClassRange, clearRange: clearRange } = hookPack;

  const apiReq = async (method: 'post' | 'patch' | 'delete', delId?: string) => {
    let id: undefined | string = undefined;
    let body: undefined | Parameters<typeof apiPostQuotationRanges>[0]['body'] = undefined;

    if (method !== 'delete') {
      if (!classQuotationRange) {
        return;
      }

      const { id: classId, apiBody } = classQuotationRange;
      const { category, doorModelName, type, description } = apiBody;

      if (!category) {
        return myAlert.warning({ title: '請選擇類型' });
      }

      if (!doorModelName) {
        return myAlert.warning({ title: '請選擇門型' });
      }

      if (!type) {
        return myAlert.warning({ title: '請選擇形式' });
      }

      id = classId;
      body = {
        category,
        doorModelName: doorModelName as TcreateQuotationRangeDto['doorModelName'],
        type: type as TcreateQuotationRangeDto['type'],
        description,
      };
    }

    try {
      setIsLoading(true);

      const apiReq = (() => {
        if (method === 'post') {
          return () => apiPostQuotationRanges({ body: body! });
        }

        if (method === 'patch') {
          return () => apiPatchQuotationRanges({ body: body!, id: id! });
        }

        if (method === 'delete') {
          return () => apiDeleteQuotationRanges({ id: delId! });
        }
      })();
      await apiReq?.();
      await reset();
      clearRange();
    } catch (err) {
      myAlert.err({ title: '上傳失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      placeholder: '選擇類別',
      options: optionsCategory,
      width: '150px',
    },
    {
      placeholder: '選擇門型',
      options: optionsDoorModel,
    },
    {
      placeholder: '選擇形式',
      options: optionsDoorForm,
    },
    {
      placeholder: '請輸入搜尋內容',
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (arr) => {
    const category = (arr[0] as Toption).value;
    const doorModelName = (arr[1] as Toption).value as Tfilter['doorModelName'];
    const type = (arr[2] as Toption).value as Tfilter['type'];
    const description = arr[3] as string;
    setFilter({ category, doorModelName, type, description });
  };

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch,
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'addButton',
      label: '新增報價範圍',
      onClick: newClassRange,
    },
  ];

  // ------------------------------------------------------------------------
  return (
    <SubLayer className={scss.container} bodyClassName={classNames(scss.subLayer, scss.plus)}>
      <PageHeader02 tag="報價範圍列表" panelList={panelList} />
      <Table_quotationRanges
        quotationRangeArr={quotationRangeArr}
        hookPack={hookPack}
        apiReq={apiReq}
        viewRef={viewRef}
      />
      <LoadingCover01 isLoading={isLoading || getIsLoading} />
    </SubLayer>
  );
}

// ==========================================================================
const emptyQuotationRangeCre = () => ({
  id: undefined,
  category: undefined,
  doorModelName: undefined,
  type: undefined,
  description: '',
});

export class Class_quotationRange {
  constructor({
    reRender,
    quotationRange = emptyQuotationRangeCre(),
    source,
  }: {
    reRender: () => void;
    quotationRange?: {
      id: string | undefined;
      category: string | undefined;
      doorModelName: string | undefined;
      type: string | undefined;
      description: string;
    };
    source: 'new' | 'edit';
  }) {
    this._reRender = reRender;
    this._quotationRange = quotationRange;
    this.source = source;
  } // constructor

  private _reRender;
  private _quotationRange;
  source;

  get id() {
    return this._quotationRange.id;
  }

  get category() {
    return this._quotationRange.category;
  }
  set category(v) {
    this._quotationRange.category = v;
    this._reRender();
  }

  get doorModelName() {
    return this._quotationRange.doorModelName;
  }
  set doorModelName(v) {
    this._quotationRange.doorModelName = v;
    this._reRender();
  }

  get type() {
    return this._quotationRange.type;
  }
  set type(v) {
    this._quotationRange.type = v;
    this._reRender();
  }

  get description() {
    return this._quotationRange.description;
  }
  set description(v) {
    this._quotationRange.description = v;
    this._reRender();
  }

  get apiBody() {
    return {
      category: this.category ?? '',
      doorModelName: this.doorModelName ?? '',
      type: this.type as 'normal' | 'anti-typhoon' | '',
      description: this.description ?? '',
    };
  }
}

const useClassQuotationRange = () => {
  const [render, setRender] = useState(0);

  const reRender = () => {
    setRender((state) => ++state);
  };

  const [classQuotationRange, setClassQuotationRange] = useState<Class_quotationRange>();

  const newClassRange = () => {
    const theClass = new Class_quotationRange({ reRender, source: 'new' });
    setClassQuotationRange(theClass);
  };

  const editClassRange = (quotationRange: TquotationRangeDto) => {
    const copy = _.cloneDeep(quotationRange);
    const theClass = new Class_quotationRange({ reRender, quotationRange: copy, source: 'edit' });
    setClassQuotationRange(theClass);
  };

  const copyClassRange = (quotationRange: TquotationRangeDto) => {
    const copy = _.cloneDeep(quotationRange);
    const theClass = new Class_quotationRange({ reRender, quotationRange: copy, source: 'new' });
    setClassQuotationRange(theClass);
  };

  const clearRange = () => {
    setClassQuotationRange(undefined);
  };

  return {
    classQuotationRange,
    newClassRange,
    editClassRange,
    clearRange,
    copyClassRange,
  };
};

export type TuseClassQuotationRange = typeof useClassQuotationRange;

// =========================================================================

import classNames from 'classnames';

import { useRouter } from 'next/router';

// antd
import { Switch } from 'antd';

// gear
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import SearchBar, { TsearchGroup } from 'components/global/gear/HOC/searchBar/searchBar';

import scss from './SearchSwitch.module.scss';

import { Toption } from 'js/utils/options/options';

type Tquery = {
  year?: string;
  month?: string;
  invoiceNumber?: string;
  searchType: 'date' | 'invoice';
};

const SearchSwitch = ({ className }: { className?: string }) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { yearOptionArr, monthOptionArr } = useYearMonth_options();
  const {
    //
    year,
    month,
    invoiceNumber,
    searchType,
  } = query;

  const checked = searchType === 'invoice';

  const searchGroup_invoice: TsearchGroup = {
    searchTargetList: [
      {
        width: '220px',
        defaultValue: invoiceNumber,
        placeholder: '以發票號碼搜尋所有應付帳款',
      },
    ],

    doSearch: (searchValueArr) => {
      const invoiceNumber = searchValueArr[0] as string;

      const newQuery: Tquery = {
        ...query,
        invoiceNumber,
      };

      if (!newQuery.invoiceNumber) {
        delete newQuery.invoiceNumber;
      }

      router.replace({
        query: newQuery,
      });
    },
  };

  return (
    <div className={classNames(scss.mySwitch, className)}>
      <Switch
        className={classNames(scss.antdSwitch)}
        checked={searchType === 'invoice'}
        onChange={(checked) => {
          const searchType = checked ? 'invoice' : 'date';
          router.replace({
            query: {
              ...router.query,
              searchType,
            },
          });
        }}
        checkedChildren={
          <>
            以<i className="text-white font-bold">發票</i> 搜尋 <i className="text-white font-bold">所有</i> 應付帳款
          </>
        }
        unCheckedChildren={
          <>
            以<i className="text-white font-bold">日期</i> 搜尋 <i className="text-white font-bold">未付</i> 應付帳款
          </>
        }
      />
      {!checked && (
        <DateSelector
          key="DateSelector"
          className="ml-2"
          yearOptionArr={yearOptionArr}
          monthOptionArr={monthOptionArr}
          year={year || ''}
          month={month || ''}
        />
      )}
      {checked && <SearchBar className="ml-2 w-[282px]" {...searchGroup_invoice} />}
    </div>
  );
};

const DateSelector = ({
  yearOptionArr,
  monthOptionArr,
  year,
  month,
  className,
}: {
  yearOptionArr: Toption[];
  monthOptionArr: Toption[];
  year: string;
  month: string;
  className?: string;
}) => {
  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  return <SelectBar key="selectBar" className={className} selectPropsArr={selectPropsArr} />;
};

export default SearchSwitch;

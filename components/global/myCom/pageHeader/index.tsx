import { useTranslation } from 'react-i18next';
import { DatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import FilterItemsPageHeader from './FilterItems';

type Title = {
  name: string;
  onClick?: () => void;
  className?: string;
};

export type ButtonType = {
  type: 'button';
  name: string;
  className: string;
  onClick: () => void;
  icon?: string;
  badgeNum?: number;
};

export type SearchType = {
  type: 'search';
  placeholder: string;
  style?: { [key: string]: string | number };
  onSearch?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type SelectType = {
  type: 'select';
  options: { value: string; label: string }[];
  onChange: (e: string) => void;
  placeholder?: string;
  defaultValue?: string;
  style?: { [key: string]: string | number };
};

export type TextType = {
  type: 'text';
  texts: { [key: string]: string | number }[];
};

// export type DateType = {
//   type: 'date';
//   disabledDate: DatePickerProps['disabledDate'];
//   onChange: RangePickerProps['onChange'];
//   defaultValue?: [Dayjs, Dayjs];
//   placeholder?: [string, string];
// };
export type DateType = RangePickerProps & {
  type: 'date';
};

export type MapPageHeader = {
  title?: string | Title[];
  titleParams?: { [key: string]: any };
  items?: Array<ButtonType | SearchType | SelectType | TextType | DateType>;
  leftItems?: Array<ButtonType | SearchType | SelectType | TextType | DateType>;
  activeTitleName?: string;
};
// example
// const mapPageHeader: MapPageHeader = {
//   title: '我是標題',
//   title: [
//     { name: 'A', onClick: () => console.log('test'), className: 'bg-[#ffeeee]' },
//     { name: 'B', onClick: () => console.log('test') },
//   ],
//   leftItems:[],
//   items: false
//     ? [
//         {
//           type: 'text',
//           texts: [
//             { key: totalNumberOfMaterials, value: productList?.length || 0 },
//             { key: totalNumberOfMatches, value: filterProductList?.length || 0 },
//           ],
//         },
//         { type: 'button', name: '編輯', className: "blueButton", onClick: () => console.log('test') },
//         {
//           type: 'search',
//           placeholder: 'enterName,
//           style: { width: 350 },
//           onChange: (e) => setFilterProductList({ type: 'name', value: e.target.value }),
//         },
//         {
//           type: 'select',
//           placeholder: '部門',
//           options: [
//             { label: '1', value: '1' },
//             { label: '2', value: '2' },
//           ],
//           onChange: (value) => setFilterEmployee({ departmentId: value }),
//           style: { width: 100 },
//         },
//         {
//           type: 'date',
//           placeholder: ['起始日期', '截止日期'],
//           defaultValue: [dayjs().startOf('day'), dayjs().add(1, 'month').startOf('day')],
//           disabledDate: disabled31DaysDate,
//           onChange: (dates, dateStrings) => {
//             console.log('格式化後的日期字串：', dateStrings);
//             setKeywordstartdate(dateStrings[0]);
//             setKeywordenddate(dateStrings[1]);
//           },
//         },
//       ]
//     : [{ type: 'button', name: '編輯', className: 'blueButton', onClick: () => console.log('test') }],
// };

export default function PageHeader(mapPageHeader: MapPageHeader) {
  const { title, titleParams, items, leftItems } = mapPageHeader;
  const { t } = useTranslation('common', { keyPrefix: 'PageHeader' });

  return (
    <div className="flex  justify-between  bg-white mb-3">
      {/* sticky -top-5 z-50 */}
      <div className="flex ">
        {/* title */}
        {typeof title === 'string' ? (
          <div className={`pageHeaderTitle border-b-[2px] `}>{t(`title.${title}`, titleParams)}</div>
        ) : (
          <>
            {title?.map((object) => {
              const { name, className, ...props } = object;

              return (
                <div
                  key={`PageHeader-title-${name}`}
                  className={`cursor-pointer  pageHeaderTitle ${className}`}
                  {...props}
                >
                  {t(`title.${name}`, titleParams)}
                </div>
              );
            })}
          </>
        )}
        <div className="flex justify-cneter items-center ml-1">
          {/* leftbutton, type: button, search, select, text, date */}
          <FilterItemsPageHeader items={leftItems} />
        </div>
      </div>
      <div className="flex justify-cneter items-center">
        {/* rightbutton, type: button, search, select, text, date */}
        <FilterItemsPageHeader items={items} />
      </div>
    </div>
  );
}

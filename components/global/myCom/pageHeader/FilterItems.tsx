import { Fragment } from 'react';

import { Badge, DatePicker, Input, Select } from 'antd';
import Image from 'next/image';
import { toMinguoYear } from 'js/utils/dayjs';
import { ButtonType, DateType, SearchType, SelectType, TextType } from '.';
import { useTranslation } from 'react-i18next';

export default function FilterItemsPageHeader(props: {
  items: Array<ButtonType | SearchType | SelectType | TextType | DateType> | undefined;
}) {
  const { Search } = Input;
  const { RangePicker } = DatePicker;
  const { items } = { ...props };
  const { t } = useTranslation('common', { keyPrefix: 'PageHeader' });

  return (
    <>
      {items?.map((item, index) => {
        const type = item.type;

        if (type === 'button') {
          const { name, icon, badgeNum, ...props } = item;

          return (
            <Fragment key={`PageHeader-button-${name}-${index}`}>
              <button {...props}>
                {icon && <Image className="mr-1" src={icon} alt={''} width={20} height={20} />}
                {t(`button.${name}`)}
              </button>

              {badgeNum ? <Badge count={badgeNum} offset={[-10, -30]} title="" color="#ff4d4f" /> : ''}
            </Fragment>
          );
        }

        if (type === 'search') {
          const name = item.placeholder;
          const { type, placeholder, ...props } = item;

          return (
            <Search
              size="large"
              className="ml-1"
              key={`PageHeader-button-${name}`}
              allowClear
              placeholder={t(`placeholder.${placeholder}`)}
              {...props}
            />
          );
        }

        if (type === 'select') {
          const name = item.placeholder;
          const { ...props } = item;

          return <Select className="mr-1" key={`PageHeader-select-${name}`} size="large" {...props} />;
        }

        if (type === 'text') {
          const { texts } = item;

          return (
            <>
              {texts.map((text) => {
                const { key, value } = text;
                const name = key;

                return (
                  <div key={`PageHeader-text-${name}`} className="flex p-[4px_5px]">
                    <p className="text-[#14256a] text-[50px] mb-0">
                      {t(`key.${key}`)}：<span className="text-gray-500">{value}</span>
                    </p>
                  </div>
                );
              })}
            </>
          );
        }

        if (type === 'date') {
          const name = 'item.placeholder';
          const { type, ...props } = item;

          return (
            <div key={`PageHeader-date-${name}`} className="ml-1">
              <RangePicker format={(date) => toMinguoYear(date)} size="large" allowClear={false} {...props} />
            </div>
          );
        }
      })}
    </>
  );
}

import { useMemo } from 'react';
import moment from 'moment';

import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Tstate, Tconfig_filter } from './types';

const useInputSelProps = ({
  config_filter,
  state,
  setState,
}: {
  config_filter: Tconfig_filter;
  state: Tstate;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}) => {
  const inputSelPropsArr: TinputSelProps[] = useMemo(() => {
    return config_filter.map((item, index) => {
      return createInputSel({
        config: item,
        state,
        setState,
      });
    });
  }, [config_filter, state, setState]);

  return inputSelPropsArr;
};

const createInputSel = ({
  config,
  state,
  setState,
}: {
  config: Tconfig_filter[number];
  state: Tstate;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}) => {
  const { caption, key, type, selectOptions } = config;

  const inputSelProps: TinputSelProps = {
    caption,
  };

  switch (type) {
    case 'input':
      inputSelProps.inputProps = {
        props: {
          name: key,
          value: state[key],
          onChange: (e) => {
            setState((prev) => {
              return {
                ...prev,
                [key]: e.target.value,
              };
            });
          },
        },
      };
      break;

    case 'select':
      inputSelProps.selectProps = {
        props: {
          isClearable: true,
          name: key,
          placeholder: '請選擇',
          options: selectOptions,
          value: selectOptions?.find((item) => item.value === state[key]) || null,
          onChange: (option) => {
            setState((prev) => {
              return {
                ...prev,
                [key]: option?.value || '',
              };
            });
          },
        },
      };
      break;

    case 'date':
      inputSelProps.datePickerProps = {
        props: {
          name: key,
          value: state[key] ? moment(state[key]) : null,
          onChange: (date) => {
            const isoStr = date?.toISOString() || '';

            setState((prev) => {
              return {
                ...prev,
                [key]: isoStr,
              };
            });
          },
        },
      };

    default:
      break;
  }

  return inputSelProps;
};

export { useInputSelProps };

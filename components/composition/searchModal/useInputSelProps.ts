import { useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Tstate_filter, Tconfig_filter } from './types';
import scss from './searchModal.module.scss';

const useInputSelProps = ({
  config_filter,
  state,
  setState,
}: {
  config_filter: Tconfig_filter;
  state: Tstate_filter | undefined;
  setState: React.Dispatch<React.SetStateAction<Tstate_filter | undefined>>;
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
  state: Tstate_filter | undefined;
  setState: React.Dispatch<React.SetStateAction<Tstate_filter | undefined>>;
}) => {
  const { caption, key, type, selectOptions, disabled, placeholder } = config;

  const inputSelProps: TinputSelProps = {
    disabled,
    caption,
    showBaseline: 'auto',
  };

  switch (type) {
    case 'input':
      inputSelProps.inputProps = {
        props: {
          name: key,
          value: state?.[key] ?? '',
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
      placeholder !== undefined && (inputSelProps.inputProps.props!.placeholder = placeholder);
      break;

    case 'select':
      inputSelProps.selectProps = {
        props: {
          classNames: {
            menuPortal: () => classNames(scss.select_menuPortal, scss.plus),
          },
          isClearable: true,
          name: key,
          placeholder: '請選擇',
          options: selectOptions,
          value: selectOptions?.find((item) => item.value === state?.[key]) || null,
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
      placeholder !== undefined && (inputSelProps.selectProps.props!.placeholder = placeholder);
      break;

    case 'date':
      inputSelProps.datePickerProps = {
        props: {
          name: key,
          value: state?.[key] ? moment(state[key]) : null,
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
      placeholder !== undefined && (inputSelProps.datePickerProps.props!.placeholder = placeholder);

    default:
      break;
  }

  return inputSelProps;
};

export { useInputSelProps };

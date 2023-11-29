import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

// ui
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconSearch } from 'public/image/icon/svgComponent/svgIcons';
// css
import scss from './searchBar.module.scss';

// ==================================================================
type TreturnBody = {
  [key: `${number}`]: string;
};

// type TsearchProps = TinputSelProps | { pilarAttr: React.HTMLAttributes<HTMLDivElement> | undefined };
type TinputSelProp_search =
  | Omit<
      TinputSelProps,
      'textareaProps' | 'timePickerProps' | 'timePickerProps_mui' | 'checkBoxProps' | 'inputSelBarProps'
    >
  | { pilarAttr: React.HTMLAttributes<HTMLDivElement> | undefined };

type TsearcbBarProps = {
  className?: string;
  disabled?: boolean;
  onChange?: (v: string[]) => void;
  onClick?: (v: string[]) => void;
  //
  inputSelPropsArr: TinputSelProp_search[];
  //
  caption?: string;
  captionClassName?: string;
  captionStyle?: React.CSSProperties;
  captionSize?: '14' | '16' | '18' | '20';
  captionWeight?: '400' | '500' | '600' | '700';
  captionColor?: 'main' | 'sub' | 'text' | 'active';

  /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
  showBaseline?: 'invisible' | 'always' | 'auto';
  hrClassName?: string;
  hrStyle?: React.CSSProperties;
};

export type { TsearcbBarProps, TinputSelProps, TinputSelProp_search };

// ==================================================================
export default function SearchBar({
  className,
  disabled,
  onChange,
  onClick,
  //
  inputSelPropsArr,
  //
  caption,
  captionClassName,
  captionStyle,
  captionSize = '16',
  captionWeight = '400',
  captionColor = 'sub',
  //
  showBaseline = 'always',
  hrClassName,
  hrStyle,
}: TsearcbBarProps) {
  const captionFontClassName = classNames(
    //
    `f${captionSize}`,
    `f${captionWeight}`,
    `c${captionColor}`
  );

  const hrClasses = (() => {
    const classInvisible = (() => {
      if (showBaseline === 'always') {
        return '';
      }

      if (disabled) {
        return 'invisible';
      }
    })();

    return `${scss.hr}  ${classInvisible} ${hrClassName ?? ''}`;
  })();

  // ------------------------------------------------------------------

  const { getValues, control } = useForm<TreturnBody>();
  const watch = useWatch({ control });

  useEffect(() => {
    onChange?.(Object.values(getValues()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  // ------------------------------------------------------------------
  const theClick = () => {
    onClick?.(Object.values(getValues()));
  };

  // ------------------------------------------------------------------
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        theClick();
      }}
      className={classNames(scss.wrapper, className)}
    >
      {caption && (
        <div className={classNames(captionFontClassName, scss.caption, captionClassName)} style={captionStyle}>
          <span>{caption}</span>
        </div>
      )}

      <div className={scss.inputSelWrapper}>
        {inputSelPropsArr.map((isp, index) => {
          if ('pilarAttr' in isp) {
            return (
              <div
                key={index}
                //
                {...isp.pilarAttr}
                className={classNames(scss.pilar, isp.pilarAttr?.className)}
              />
            );
          }

          //
          const ispC = _.cloneDeep(isp);

          return (
            <Controller
              key={index}
              control={control}
              name={`${index}`}
              //
              render={({ field }) => {
                // ______________________
                if (ispC.inputProps) {
                  if (ispC.inputProps.props?.value && field.value !== ispC.inputProps.props?.value) {
                    field.onChange(ispC.inputProps.props.value);
                  }

                  ispC.inputProps.props = {
                    ...ispC.inputProps.props,
                    value: (ispC.inputProps.props?.value || field.value) ?? ispC.inputProps.props?.defaultValue ?? '',
                    onChange: (e) => {
                      isp.inputProps?.props?.onChange?.(e);
                      field.onChange(e);
                    },
                    defaultValue: undefined,
                  };
                }

                // ______________________
                if (ispC.selectProps) {
                  const sp = ispC.selectProps;
                  ispC.selectProps = {
                    arrowType: 'black',
                    ...sp,
                    easyValue: sp.easyValue || field.value,
                    props: {
                      ...sp.props,
                      onChange: (option, a) => {
                        isp.selectProps?.props?.onChange?.(option, a);
                        field.onChange(option?.value);
                      },
                    },
                  };
                }

                // ______________________

                if (ispC.datePickerProps) {
                  const datePickerProps = ispC.datePickerProps;
                  const props = datePickerProps.props;

                  const preValue = props?.value || field.value;
                  const value = preValue ? moment(preValue) : null;

                  ispC.datePickerProps = {
                    ...datePickerProps,
                    props: {
                      ...props,
                      value,
                      onChange: (m, s) => {
                        const iso = m?.toISOString();
                        isp.datePickerProps?.props?.onChange?.(m, s);
                        field.onChange(iso);
                      },
                    },
                  };
                }

                // ______________________

                return <InputSel key={index} showBaseline="invisible" captionSize="16" fontSize="16" {...ispC} />;
              }}
              //
            />
          );
        })}
      </div>

      {onClick && <IconSearch className={scss.btn} onClick={theClick} />}
      {showBaseline !== 'invisible' && <hr className={classNames(hrClasses)} style={hrStyle} />}
    </form>
  );
}

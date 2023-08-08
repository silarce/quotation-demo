import classNames from 'classnames';

// component
import Input, { TinputProps } from '../cog/input';
import MySelect, { TselectProps } from '../cog/mySelect';
import Textarea, { TtextareaProps } from '../cog/textarea';

// css
import scss from './inputSelBar.module.scss';

type TinputPropsWrapper = {
  type: 'input';
  itemProps?: TinputProps;
};
type TselectPropsWrapper = {
  type: 'select';
  itemProps?: TselectProps;
};
type TtextareaPropsWrapper = {
  type: 'textarea';
  itemProps?: TtextareaProps;
};

export type TselInputPropsArr = (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[];

export type TinputSelBarProps = {
  disabled?: boolean;
  fontClassName?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  propsArr: TselInputPropsArr;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
};

// ===========================================================================
const InputSelBar = ({
  disabled,
  fontClassName,
  wrapperClassName,
  wrapperStyle,
  propsArr,
  onFocus,
  onBlur,
}: TinputSelBarProps) => {
  return (
    <div className={classNames(scss.container, wrapperClassName)} style={wrapperStyle}>
      {propsArr.map((item, index) => {
        const { type, itemProps } = item;

        if (type === 'input') {
          return (
            <Input
              key={index}
              {...itemProps}
              wrapperClassName={classNames(fontClassName, itemProps?.wrapperClassName)}
              inputAttr={{
                disabled,
                ...itemProps?.inputAttr,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.inputAttr?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.inputAttr?.onBlur?.(e);
                },
              }}
            />
          );
        }

        if (type === 'textarea') {
          return (
            <Textarea
              key={index}
              {...itemProps}
              // wrapperClassName={itemProps?.wrapperClassName}
              // allowNewLineByUser={itemProps?.allowNewLineByUser}
              props={{
                disabled,
                ...itemProps?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.props?.onBlur?.(e);
                },
                className: classNames(fontClassName, itemProps?.props?.className),
              }}
            />
          );
        }

        if (type === 'select') {
          return (
            <MySelect
              key={index}
              fontClassName={fontClassName}
              arrowType={'black'}
              //
              {...itemProps}
              //
              wrapperClassName={classNames(itemProps?.wrapperClassName)}
              props={{
                isDisabled: disabled,
                ...itemProps?.props,
                onFocus: (e) => {
                  onFocus && onFocus(e);
                  itemProps?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  onBlur && onBlur(e);
                  itemProps?.props?.onBlur?.(e);
                },
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default InputSelBar;

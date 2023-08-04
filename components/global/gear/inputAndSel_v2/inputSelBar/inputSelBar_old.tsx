import { CSSProperties, useState } from 'react';
import classNames from 'classnames';
// gear
import MustTip_simple from '../../other/mustTip_simple';

// css
import scss from './inputSelBar_old.module.scss';

// component
import Input, { TinputProps } from '../cog/input';
import MySelect, { TselectProps } from '../cog/mySelect';
import Textarea, { TtextareaProps } from '../cog/textarea';

type TinputPropsWrapper = {
  type: 'input';
  props?: TinputProps;
};
type TselectPropsWrapper = {
  type: 'select';
  props?: TselectProps;
};
type TtextareaPropsWrapper = {
  type: 'textarea';
  props?: TtextareaProps;
};

export type TselInputPropsArr = (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[];

// =========================================================================
export default function InputSelBar({
  label,
  propsArr,
  captionWidth,
  width,
  gap,
  padding,
  hrColor,
  showBaseline = 'always',
  disabled,
  className,
  captionClassName,
  hrClassName,
  valueContanierClassName,
  isMust,
  mustTipClassName,
}: {
  label?: string;
  propsArr: (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[];

  width?: CSSProperties['width'];
  gap?: CSSProperties['gap'];
  captionWidth?: CSSProperties['width'];
  padding?: CSSProperties['padding'];
  hrColor?: CSSProperties['borderColor'];

  /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
  showBaseline?: 'invisible' | 'always' | 'auto';
  disabled?: boolean;

  className?: string;
  valueContanierClassName?: string;
  captionClassName?: string;
  hrClassName?: string;
  isMust?: boolean;
  mustTipClassName?: string;
}) {
  const [isFocus, setIsFocus] = useState(false);

  // -----------------------------------------------------------------------
  // 由外部控制的css，會寫在inline

  const lableStyle: CSSProperties = {
    width: width,
    gap: gap,
    gridTemplateColumns: !label ? 'auto' : undefined,
    padding: padding,
  };
  const captionStyle: CSSProperties = {
    width: captionWidth,
  };
  const hrStyle: CSSProperties = {
    borderColor: hrColor,
  };
  // -----------------------------------------------------------------------
  // 根據不同的狀況設定className

  const labelClasses = (() => {
    return `${scss.label} ${className ?? ''}`;
  })();
  const captionClasses = (() => {
    return `${scss.caption} ${captionClassName ?? ''}`;
  })();

  const hrClasses = (() => {
    const classIsFocus = (isFocus || '') && 'isFocus';
    const classInvisible = (() => {
      if (showBaseline === 'always') {
        return '';
      }

      if (disabled) {
        return 'invisible';
      }
    })();

    return `${scss.hr} ${classIsFocus} ${classInvisible} ${hrClassName ?? ''}`;
  })();

  // ------------------------------------------------------------------------
  return (
    // 包裝的元素不可以是label，否則select會壞掉
    <div className={labelClasses} style={lableStyle}>
      {label && (
        <div className={classNames(captionClasses, 'relative')} style={captionStyle}>
          <span>{label}</span>
          {isMust && <MustTip_simple className={mustTipClassName} preStyle="minimal" />}
        </div>
      )}

      <Foo
        disabled={disabled}
        valueContanierClassName={valueContanierClassName}
        propsArr={propsArr}
        setIsFocus={setIsFocus}
      />

      {showBaseline !== 'invisible' && <hr className={hrClasses} style={hrStyle} />}
    </div>
  );
}

// ===================================================================

const Foo = ({
  disabled,
  valueContanierClassName,
  propsArr,
  setIsFocus,
}: {
  disabled?: boolean;
  valueContanierClassName?: string;
  propsArr: TselInputPropsArr;
  setIsFocus: (v: boolean) => void;
}) => {
  return (
    <div className={classNames(scss.valueContanier, valueContanierClassName)}>
      {propsArr.map((item, index) => {
        const { type, props } = item;

        if (type === 'input') {
          return (
            <Input
              key={index}
              wrapperClassName={props?.wrapperClassName}
              inputAttr={{
                disabled,
                ...props?.inputAttr,
                onFocus: (e) => {
                  setIsFocus(true);
                  props?.inputAttr?.onFocus?.(e);
                },
                onBlur: (e) => {
                  setIsFocus(false);
                  props?.inputAttr?.onBlur?.(e);
                },
              }}
            />
          );
        }

        if (type === 'textarea') {
          return (
            <Textarea
              key={index}
              wrapperClassName={props?.wrapperClassName}
              allowNewLineByUser={props?.allowNewLineByUser}
              props={{
                disabled,
                ...props?.props,
                onFocus: (e) => {
                  setIsFocus(true);
                  props?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  setIsFocus(false);
                  props?.props?.onBlur?.(e);
                },
              }}
            />
          );
        }

        if (type === 'select') {
          return (
            <MySelect
              key={index}
              wrapperClassName={props?.wrapperClassName}
              arrowType={props?.arrowType || 'black'}
              fontClassName={props?.fontClassName}
              props={{
                isDisabled: disabled,
                ...props?.props,
                onFocus: (e) => {
                  setIsFocus(true);
                  props?.props?.onFocus?.(e);
                },
                onBlur: (e) => {
                  setIsFocus(false);
                  props?.props?.onBlur?.(e);
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

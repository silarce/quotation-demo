import React, { useState, useEffect } from 'react';

// antd
import { Tooltip, TooltipProps } from 'antd';

// gear
import MyButton_v2 from '../button/myButton_v2';
import InputSel, { TinputSelProps } from '../inputAndSel_v2/inputSel';

// css
import theme from 'styles/_theme01.module.scss';
import scss from './pop_form.module.scss';

// =====================================================================

type Tcontrol = {
  inputSelArr: TinputSelProps[];
  onConfirm?: (list: { [key: string]: string | string[] }) => void;
};

export type { Tcontrol as Tcontrol_pop_form };

// =====================================================================

export default function Pop_form({
  children,
  control,
  confirmText,
  placement,
}: {
  children: React.ReactNode;
  control: Tcontrol;
  confirmText?: string;
  withWrapper?: boolean;
  wrapperClassName?: string;
  // TooltipProps是複合型別，使用時發生型別錯誤
  // props?: TooltipProps;
  placement?: TooltipProps['placement'];
}) {
  const [show, setIsShow] = useState<boolean | undefined>(undefined);

  return (
    <Tooltip
      //
      overlayClassName={scss.antd_tooltip}
      title={<PopContent control={control} setIsShow={setIsShow} confirmText={confirmText} />}
      trigger="click"
      color={theme.colors_bgc02}
      destroyTooltipOnHide={true}
      visible={show}
      placement={placement}
    >
      {children}
    </Tooltip>
  );
}

// ======================================================================

const nameArr: string[] = [];

const PopContent = ({
  control,
  confirmText,
  setIsShow,
}: {
  control: Tcontrol;
  confirmText?: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) => {
  useEffect(() => {
    return () => {
      setIsShow(undefined);
    };
  }, []);

  return (
    <form
      className={scss.container}
      onSubmit={(e) => {
        e.preventDefault();

        const list: { [key: string]: string | string[] } = {};

        // w MyTimePicker_mui、CheckBar、InputSelBar這幾個inputSelProp沒有支援name
        // w 所以會抓不到，要注意
        nameArr.forEach((name) => {
          const target = e.currentTarget[name];

          // 目前已知 text checkbox radio hidden // 可能還有 textarea
          const targetType: 'text' | 'checkbox' | 'radio' | 'hidden' | undefined = target?.type ?? target[0].type;
          const isNodeList = target instanceof NodeList;

          let value: string | string[] = '';

          if (isNodeList) {
            value = [];

            for (const element of target) {
              const ele = element as HTMLInputElement;

              if (ele.checked) {
                value.push(ele.value);
              }
            }
          } else {
            value = target?.value ?? '不正確的name';
          }

          if (targetType === 'radio' && Array.isArray(value) && value.length === 1) {
            value = value[0];
          }

          list[name] = value;
        });

        control.onConfirm?.(list);
        setIsShow(false);
      }}
    >
      {control.inputSelArr.map((inputSelProps, index) => {
        const name = inputSelProps.name || `_${index}`; // 必須要有前綴或後綴，react-select不能收`${number}`
        nameArr[index] = name;

        if (inputSelProps.selectProps) {
          inputSelProps.selectProps.props = inputSelProps.selectProps.props ?? {};
          inputSelProps.selectProps.props.menuPortalTarget = undefined;
        }

        return <InputSel key={index} {...config} {...inputSelProps} name={name} />;
      })}

      <MyButton_v2
        px="px22"
        py="py4"
        buttonProps={{
          htmlType: 'submit',
        }}
        className="block m-auto mt-5"
      >
        {confirmText ?? '確認'}
      </MyButton_v2>
    </form>
  );
};

// ======================================================================

const config: TinputSelProps = {
  captionSize: '16',
  fontSize: '16',
};

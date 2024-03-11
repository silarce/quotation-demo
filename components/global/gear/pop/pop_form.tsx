import React, { useState, useEffect } from 'react';

// antd
import { Tooltip } from 'antd';

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
}: {
  children: React.ReactNode;
  control: Tcontrol;
  confirmText?: string;
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

          if (target.length && target.length > 1) {
            const strArr: string[] = [];

            for (const ele of target) {
              if (ele.checked) {
                strArr.push(ele.value);
              }
            }

            list[name] = strArr;
          } else {
            if (target.type === 'checkbox' && !target.checked) {
              list[name] = [];
            } else {
              list[name] = target?.value ?? '不支援name的inputSel';

              if (target?.value === undefined) {
                console.log(name, '不支援name的inputSel');
              }
            }
          }

          //
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

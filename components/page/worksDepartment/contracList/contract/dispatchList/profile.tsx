import { useState } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar, {
  TinputSelProps_noProps,
  TaddressProps,
} from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

import {
  selectModalCreator_multi,
  TemployeeDto,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// css
import scss from './profile.module.scss';

// ============================================================================
type TcontrolItem = {
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type TcontrolItem_str = {
  value: string;
  disabled?: boolean;
  onChange: (str: string) => void;
};

type TcontrolItem_moment = {
  value: Moment | null;
  disabled?: boolean;
  onChange: (e: Moment | null) => void;
};

type Tcontrol = {
  // 派工日期
  dispatchDate: TcontrolItem_moment;
  // 工務人員
  workerEmployee: {
    value: TemployeeDto[];
    onChange: (arr: TemployeeDto[]) => void;
  };
  projectName: string;
  projectNumber: string;
  // 承包商
  contractor: string;
  // 承包商聯絡人
  contractorContactPerson: TcontrolItem;
  // allAddress: string;
  county: TcontrolItem_str;
  district: TcontrolItem_str;
  address: TcontrolItem;
  // 工地電話
  constructionSiteContactNumber: TcontrolItem;
  // 保固日期
  warrantyDate: string;
  // 完工聯絡人
  finalContactPerson: TcontrolItem;
};

export type { Tcontrol as Tcontrol_profile };

// ============================================================================

const SelectorGroup = selectModalCreator_multi<['employee_worksDepartment']>({
  selectorArr: [
    {
      key: 'employee_worksDepartment',
      caption: '工務人員',
      tip: '只有列出工務部人員。複選',
    },
  ],
});

// ============================================================================
export default function Profile({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  // ------------------------------------------------

  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------

  return (
    <div className={scss.profile}>
      <div className={scss.info}>
        <InputSel
          caption="派工日期"
          disabled={disabled}
          {...config_inputSel}
          datePickerProps={{
            props: {
              value: control.dispatchDate.value,
              onChange: control.dispatchDate.onChange,
            },
          }}
        />
        <InputSel
          caption="工程名稱"
          {...config_inputSel_readOnly}
          disabled={true}
          inputProps={{
            props: {
              placeholder: '工程名稱',
              defaultValue: control.projectName,
            },
          }}
        />
        <InputSel
          caption="工程編號"
          {...config_inputSel_readOnly}
          inputProps={{
            props: {
              placeholder: '工程編號',
              defaultValue: control.projectNumber,
            },
          }}
        />
        <InputSel
          caption="承包商"
          {...config_inputSel_readOnly}
          inputProps={{
            props: {
              placeholder: '承包商',
              defaultValue: control.contractor,
            },
          }}
        />
        <InputSel
          caption="承包商聯絡人"
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.contractorContactPerson.value,
              onChange: control.contractorContactPerson.onChange,
            },
          }}
        />
        {/* <InputSel
          caption="地址"
          {...config_inputSel_readOnly}
          inputProps={{
            props: {
              defaultValue: control.allAddress,
            },
          }}
        /> */}
        <InputSel
          caption="工地電話"
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.constructionSiteContactNumber.value,
              onChange: control.constructionSiteContactNumber.onChange,
            },
          }}
        />
        <InputSel
          caption="保固日期"
          {...config_inputSel_readOnly}
          inputProps={{
            props: {
              placeholder: '建立後系統自動設定',
              defaultValue: control.warrantyDate,
            },
          }}
        />
        <InputSel
          caption="完工聯絡人"
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.finalContactPerson.value,
              onChange: control.finalContactPerson.onChange,
            },
          }}
        />
        {/*  */}
        <AddressBar
          inputSelProps={{
            className: 'col-span-2',
            caption: '地址',
            ...config_inputSel,
          }}
          addressProps={{
            county: {
              props: {
                value: { label: control.county.value, value: control.county.value },
                onChange: (option) => {
                  control.county.onChange(option?.value || '');
                },
              },
            },
            district: {
              props: {
                value: { label: control.district.value, value: control.district.value },
                onChange: (option) => {
                  control.district.onChange(option?.value || '');
                },
              },
            },
            address: {
              props: {
                value: control.address.value,
                onChange: (e) => {
                  control.address.onChange(e);
                },
              },
            },
          }}
        />
        <InputSel
          caption="工務人員"
          {...config_inputSel}
          className="col-span-2"
          disabled={disabled}
          onClick={() => !disabled && setShowSelector(true)}
          textareaProps={{
            props: {
              value: control.workerEmployee.value.map((item) => item.chName || item.enName).join(', '),
            },
          }}
        />
      </div>

      <SelectorGroup
        showModal={showSelector}
        onConfirm={(arr) => {
          const employeeArr = arr[0];
          control.workerEmployee.onChange(employeeArr);
        }}
        onCancel={() => {
          setShowSelector(false);
        }}
        defaultSeletedDataArrArr={[control.workerEmployee.value]}
      />
    </div>
  );
}
// ============================================================

const config_inputSel: TinputSelProps = {
  captionColor: 'main',
  captionStyle: { width: 120 },
  showBaseline: 'auto',
};

const config_inputSel_readOnly: TinputSelProps = {
  captionColor: 'main',
  captionStyle: { width: 120 },
  showBaseline: 'invisible',
  disabled: true,
};

// ==========================================

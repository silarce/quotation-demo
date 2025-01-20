import { useState, Fragment } from 'react';
import classNames from 'classnames';
import { Moment } from 'moment';

// global gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
import Tip from 'components/global/myAntd/popover/tip';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

import {
  selectModalCreator_multi,
  TemployeeDto,
  ToutsourcingDto,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

import type { Toption } from 'js/utils/options/options';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from './profile.module.scss';

import { IconRemoveCircle, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

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

type Toption_pointContactPerson = Toption & { phoneNumber: string | undefined };

type TcontrolItem_option = {
  value: string;
  disabled?: boolean;
  onChange: (e: Toption_pointContactPerson | null) => void;
};

type TpointContact = {
  name: TcontrolItem_option;
  phone: TcontrolItem;
  remove: () => void;
};

type Tcontrol = {
  idNumber: TcontrolItem;
  // 派工日期
  dispatchDate: TcontrolItem_moment;

  // 工務人員
  workerEmployee: {
    value: TemployeeDto[];
    onChange: (arr: TemployeeDto[]) => void;
  };
  workerOutsourcing: {
    value: ToutsourcingDto[];
    onChange: (arr: ToutsourcingDto[]) => void;
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

  pointContactPerson: TcontrolItem_option;
  pointContactNumber: TcontrolItem;
  //
  // pointContractPersonOptions: Toption[];
  pointContractPersonOptions: (Toption & { phoneNumber: string })[];

  projectSiteContactPerson: TcontrolItem_option;
  projectSiteContactPersonNumber: TcontrolItem;
  //
  addPointContact: () => void;
  pointContactArr: TpointContact[];
};

export type { Tcontrol as Tcontrol_profile };

// ============================================================================

const SelectorGroup = selectModalCreator_multi<['employee_worksDepartment', 'outsourcing']>({
  selectorArr: [
    {
      key: 'employee_worksDepartment',
      caption: '工務人員',
      tip: '只有列出工務部人員。複選',
    },
    {
      key: 'outsourcing',
      caption: '工務人員(外包)',
      tip: '外包廠商。複選',
    },
  ],
});

// ============================================================================
export default function Profile({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  const [showSelector, setShowSelector] = useState(false);

  let warrantyDate = control.warrantyDate;
  warrantyDate = (warrantyDate ? getTaiwanDateStr(warrantyDate) : '') || '';

  // ------------------------------------------------

  return (
    <div className={scss.profile}>
      <div className={scss.left}>
        <InputSel
          caption="派工單號"
          disabled={disabled}
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.idNumber.value,
              onChange: control.idNumber.onChange,
            },
          }}
        />
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
        <InputSel caption="工程名稱" {...config_inputSel_readOnly} disabled={true} node={control.projectName} />
        <InputSel
          caption="工程編號"
          {...config_inputSel_readOnly}
          nodeBoxProps={{
            className: 'self-start',
          }}
          node={control.projectNumber}
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
        {/* <InputSel
          caption="承包商聯絡人"
          disabled={disabled}
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.contractorContactPerson.value,
              onChange: control.contractorContactPerson.onChange,
            },
          }}
        /> */}
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
          disabled={disabled}
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
              defaultValue: warrantyDate,
            },
          }}
        />
        {/* <InputSel
          caption="完工聯絡人"
          disabled={disabled}
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.finalContactPerson.value,
              onChange: control.finalContactPerson.onChange,
            },
          }}
        /> */}

        {/* <InputSel
          caption="工地現場聯絡人"
          disabled={disabled}
          {...config_inputSel}
          selectProps={{
            props: {
              isSearchable: true,
              options: control.pointContractPersonOptions,
              value: control.projectSiteContactPerson
                ? { label: control.projectSiteContactPerson.value, value: control.projectSiteContactPerson.value }
                : null,
              onChange: (option) => {
                control.projectSiteContactPerson.onChange(option as Toption_pointContactPerson | null);
              },
            },
          }}
        /> */}

        {/* <InputSel
          caption="工地現場聯絡人電話"
          disabled={disabled}
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.projectSiteContactPersonNumber.value,
              onChange: control.projectSiteContactPersonNumber.onChange,
            },
          }}
        /> */}

        <div />
        {/* <InputSel
          caption="接洽人"
          disabled={disabled}
          {...config_inputSel}
          selectProps={{
            props: {
              isSearchable: true,
              options: control.pointContractPersonOptions,
              value: control.pointContactPerson
                ? { label: control.pointContactPerson.value, value: control.pointContactPerson.value }
                : null,
              onChange: (option) => {
                control.pointContactPerson.onChange(option as Toption_pointContactPerson | null);
              },
            },
          }}
        /> */}

        {/* <InputSel
          caption="接洽人電話"
          disabled={disabled}
          {...config_inputSel}
          inputProps={{
            props: {
              value: control.pointContactNumber.value,
              onChange: control.pointContactNumber.onChange,
            },
          }}
        /> */}

        {/*  */}
        <AddressBar
          inputSelProps={{
            className: 'col-span-2',
            caption: '地址',
            disabled: disabled,
            ...config_inputSel,
          }}
          addressProps={{
            county: {
              props: {
                isDisabled: disabled,
                value: { label: control.county.value, value: control.county.value },
                onChange: (option) => {
                  control.county.onChange(option?.value || '');
                },
              },
            },
            district: {
              props: {
                isDisabled: disabled,
                value: { label: control.district.value, value: control.district.value },
                onChange: (option) => {
                  control.district.onChange(option?.value || '');
                },
              },
            },
            address: {
              props: {
                disabled: disabled,
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
              // value: control.workerEmployee.value.map((item) => item.chName || item.enName).join(', '),
              value: (() => {
                const employeeNames = control.workerEmployee.value.map((item) => item.chName || item.enName).join(', ');
                const outsourcingNames = control.workerOutsourcing.value.map((item) => item.name).join(', ');
                let names = employeeNames;
                outsourcingNames && (names += ', ' + outsourcingNames);

                return names;
              })(),
            },
          }}
        />
      </div>

      <div className={scss.right}>
        <div className={classNames('flex gap-3 items-center mb-2', disabled && 'invisible')}>
          <SquareBtn sharp="long" onClick={control.addPointContact}>
            新增接洽人
          </SquareBtn>
          <Tip content="接洽人可key in" />
        </div>

        <div className={scss.contractPersonList}>
          {control.pointContactArr.map((item, index) => {
            const { name: _name, phone: phoneNumber, remove } = item;

            const name = _name.value ? { label: _name.value, value: _name.value } : null;

            return (
              <Fragment key={index}>
                <IconRemoveCircle className={classNames(scss.iconBtn, disabled && 'invisible')} onClick={remove} />
                <InputSel
                  caption="接洽人"
                  disabled={disabled}
                  {...config_inputSel}
                  captionStyle={{ width: 60 }}
                  selectProps={{
                    props: {
                      placeholder: '',
                      isSearchable: true,
                      options: control.pointContractPersonOptions,
                      value: name,
                      onChange: (option) => {
                        _name.onChange(option as Toption_pointContactPerson | null);
                      },
                    },
                  }}
                />

                <InputSel
                  caption="接洽人電話"
                  disabled={disabled}
                  {...config_inputSel}
                  captionStyle={{ width: 100 }}
                  inputProps={{
                    props: {
                      placeholder: '',
                      value: phoneNumber.value,
                      onChange: phoneNumber.onChange,
                    },
                  }}
                />
              </Fragment>
            );
          })}
        </div>
      </div>

      <SelectorGroup
        showModal={showSelector}
        onConfirm={(arr) => {
          const employeeArr = arr[0];
          const outsourcing = arr[1];
          control.workerEmployee.onChange(employeeArr);
          control.workerOutsourcing.onChange(outsourcing);
        }}
        onCancel={() => {
          setShowSelector(false);
        }}
        defaultSeletedDataArrArr={[control.workerEmployee.value, control.workerOutsourcing.value]}
      />
    </div>
  );
}
// ============================================================

const config_inputSel: TinputSelProps = {
  captionColor: 'main',
  captionStyle: { width: 180 },
  showBaseline: 'auto',
};

const config_inputSel_readOnly: TinputSelProps = {
  captionColor: 'main',
  captionStyle: { width: 180 },
  showBaseline: 'invisible',
  disabled: true,
};

// ==========================================

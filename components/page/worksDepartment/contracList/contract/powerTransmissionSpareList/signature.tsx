import { useState } from 'react';

// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
// import InputSel from 'components/global/gear/inputAndSel/inputSel_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// gear
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// css
import style from './powerTransmissionSpareList.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

type Tcontroll = {
  materialHandler: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
    forbidden?: boolean;
  };
  ingredientTechnician: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
    forbidden?: boolean;
  };
  formCompleter: {
    employee: TemployeeDto | undefined;
    onChange?: (v: TemployeeDto) => void;
    forbidden?: boolean;
  };
};

export type { Tcontroll };

// ===================================================================

export default function Signature({
  controll,
  userEmpId,
  // signature,
  // setSignature,
  disabled,
}: {
  controll: Tcontroll;
  userEmpId: string | undefined;
  // signature: Partial<Tsignature>;
  // setSignature: Dispatch<SetStateAction<Partial<Tsignature>>>;
  disabled?: boolean;
}) {
  const [showMaterialHandler, setShowMaterialHandler] = useState(false);
  const [showiIngredientTechnician, setShowIngredientTechnician] = useState(false);
  const [showFormCompleter, setShowFormCompleter] = useState(false);

  const lookup = {
    materialHandler: setShowMaterialHandler,
    ingredientTechnician: setShowIngredientTechnician,
    formCompleter: setShowFormCompleter,
  } as const;

  const filter = {
    id: { $eq: userEmpId },
  };

  return (
    <div className={style.signature}>
      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key];
        const value = (controll[key].employee?.chName || controll[key].employee?.enName) ?? '';
        const forbidden = controll[key].forbidden;

        const onClick = () => {
          if (disabled || forbidden) {
            return;
          }

          lookup[key](true);
        };

        return (
          <div className={style.cell} key={index} onClick={onClick}>
            <span>{label}</span>
            <InputSel
              className={style.input02}
              inputProps={{
                props: {
                  value,
                  placeholder,
                  onChange: () => {},
                },
              }}
              disabled={forbidden || disabled}
              showBaseline="auto"
              showAddIcon={forbidden || disabled ? false : true}
            />
          </div>
        );
      })}
      <EmployeeSelector
        showModal={showMaterialHandler}
        onConfirm={(arr) => {
          controll.materialHandler.onChange(arr[0]);
        }}
        onCancel={() => setShowMaterialHandler(false)}
        defaultEmpArr={controll.materialHandler.employee ? [controll.materialHandler.employee] : undefined}
        customFilter={filter}
        selLimit={1}
      />
      <EmployeeSelector
        showModal={showiIngredientTechnician}
        onConfirm={(arr) => {
          controll.ingredientTechnician.onChange(arr[0]);
        }}
        onCancel={() => setShowIngredientTechnician(false)}
        defaultEmpArr={controll.ingredientTechnician.employee ? [controll.ingredientTechnician.employee] : undefined}
        customFilter={filter}
        selLimit={1}
      />
      <EmployeeSelector
        showModal={showFormCompleter}
        onConfirm={(arr) => {
          controll.formCompleter.onChange?.(arr[0]);
        }}
        onCancel={() => setShowFormCompleter(false)}
        defaultEmpArr={controll.formCompleter.employee ? [controll.formCompleter.employee] : undefined}
        customFilter={filter}
        selLimit={1}
      />
    </div>
  );
}

// ========================================================

type TindexKeys = keyof Tcontroll;
const indexKeys: TindexKeys[] = ['ingredientTechnician', 'materialHandler', 'formCompleter'];

const config: {
  [key in TindexKeys]: {
    label: string;
    placeholder: string;
  };
} = {
  materialHandler: {
    label: '備料人員',
    placeholder: '請選擇備料人員',
  },
  ingredientTechnician: {
    label: '領料人員',
    placeholder: '請選擇配料人員',
  },
  formCompleter: {
    label: '填表人員',
    placeholder: '請選擇填表人員',
  },
};

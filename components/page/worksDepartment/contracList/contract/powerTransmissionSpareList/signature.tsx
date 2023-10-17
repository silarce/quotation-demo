import { useState } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

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
  };
  ingredientTechnician: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
  formCompleter: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
};

export type { Tcontroll };

// ===================================================================

export default function Signature({
  controll,
  // signature,
  // setSignature,
  editable,
}: {
  controll: Tcontroll;
  // signature: Partial<Tsignature>;
  // setSignature: Dispatch<SetStateAction<Partial<Tsignature>>>;
  editable: boolean;
}) {
  const [showMaterialHandler, setShowMaterialHandler] = useState(false);
  const [showiIngredientTechnician, setShowIngredientTechnician] = useState(false);
  const [showFormCompleter, setShowFormCompleter] = useState(false);

  const lookup = {
    materialHandler: setShowMaterialHandler,
    ingredientTechnician: setShowIngredientTechnician,
    formCompleter: setShowFormCompleter,
  } as const;

  return (
    <div className={style.signature}>
      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key];
        const value = (controll[key].employee?.chName || controll[key].employee?.enName) ?? '';

        const onClick = () => {
          lookup[key](true);
        };

        return (
          <div className={style.cell} key={index} onClick={onClick}>
            <span>{label}</span>
            <InputSel
              className={style.input02}
              inputProps={{
                value,
              }}
              placeholder={placeholder}
              disabled={true}
              showBaseline="auto"
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
      />
      <EmployeeSelector
        showModal={showiIngredientTechnician}
        onConfirm={(arr) => {
          controll.ingredientTechnician.onChange(arr[0]);
        }}
        onCancel={() => setShowIngredientTechnician(false)}
        defaultEmpArr={controll.ingredientTechnician.employee ? [controll.ingredientTechnician.employee] : undefined}
      />
      <EmployeeSelector
        showModal={showFormCompleter}
        onConfirm={(arr) => {
          controll.formCompleter.onChange(arr[0]);
        }}
        onCancel={() => setShowFormCompleter(false)}
        defaultEmpArr={controll.formCompleter.employee ? [controll.formCompleter.employee] : undefined}
      />
    </div>
  );
}

// ========================================================

type TindexKeys = keyof Tcontroll;
const indexKeys: TindexKeys[] = ['materialHandler', 'ingredientTechnician', 'formCompleter'];

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
    label: '配料人員',
    placeholder: '請選擇配料人員',
  },
  formCompleter: {
    label: '填表人員',
    placeholder: '請選擇填表人員',
  },
};

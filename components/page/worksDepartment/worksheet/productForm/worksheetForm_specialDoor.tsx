import {
  Form_specialProd_basic,
  Form_specialProd_location,
  Form_specialProduct_ABCD,
  Form_specialProduct_motor,
  Form_specialProd_headBox,
  Form_specialProd_roller,
} from 'components/page/worksDepartment/worksheet/productForm/productForm';
import {
  Container,
  Section,
  MainFormWrapper,
  FormGrid,
} from 'components/page/worksDepartment/worksheet/productForm/productFormLayout';

import type { Tstate_specialDoor } from './useSpecialDoor';

const WorksheetForm_specialDoor = ({
  //
  disabled,
  state_specialDoor,
  setState_specialDoor,
}: {
  disabled: boolean;
  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
}) => {
  type TsetStateAction = Partial<Tstate_specialDoor> | ((prev: Tstate_specialDoor) => Partial<Tstate_specialDoor>);

  const setState = (action: TsetStateAction) => {
    setState_specialDoor((prev) => ({
      ...prev,
      ...(typeof action === 'function' ? action(prev) : action),
    }));
  };

  const props = {
    state: state_specialDoor,
    setState,
    disabled,
  };

  return (
    <Container>
      <div>
        <Section>位置與編號：</Section>
        <Form_specialProd_location {...props} />
      </div>
      <div>
        <Section>設定產品基本規格：</Section>
        <Form_specialProd_basic {...props} />
      </div>
      <div>
        <Section>設定產品細部規格：</Section>
        <FormGrid>
          <Form_specialProduct_ABCD {...props} />
          <Form_specialProduct_motor {...props} />
          <Form_specialProd_headBox {...props} />
          <Form_specialProd_roller {...props} />
        </FormGrid>
      </div>
    </Container>
  );
};

export default WorksheetForm_specialDoor;

import { ClassProd } from '../class/prod/classProd_remake';

import type { TcreateSetAccessory, TclassAccessoryDict } from '../useQuotationProduct';

import { Class_accessory } from '../class/accessory/classAccessory';

const createAccessoryDict = ({
  activedClassProd,
  createSetAccessory,
}: {
  activedClassProd: ClassProd;
  createSetAccessory: TcreateSetAccessory;
}) => {
  const data_accessoryDict = activedClassProd.state.data_accessoryDict;

  const classAccessoryDict: TclassAccessoryDict = {};
  Object.entries(data_accessoryDict).forEach(([key, acce]) => {
    classAccessoryDict[key] = new Class_accessory({
      state_accessory: acce,
      setState_accessory: createSetAccessory({
        prodKey: activedClassProd.key,
        accessoryKey: key,
      }),
      classProd: activedClassProd,
    });
  });

  return classAccessoryDict;
};

export { createAccessoryDict };

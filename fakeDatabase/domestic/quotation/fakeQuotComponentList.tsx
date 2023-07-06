import { Toption, optionsCreator_material, optionsCreator_surface } from 'js/utils/options/options';

interface Tcomponent {
  id01: string;
  typeName: string;
  id02: string | null;
  material: { value: string; options: Toption[] } | string | null;
  surface: { value: string; options: Toption[] } | string | null;
  basicWeight: string | null;
  unit: string | null;
  qty: string;
  listPrice: string; //牌價
  totalListPrice: string; //牌價複價
  price: string; //單價
  totalPrice: string; //複價
}

type TcomponentList = Tcomponent[];

const materialOptions = optionsCreator_material();
const surfaceOptions = optionsCreator_surface();

const fakeComponentListOri = (): TcomponentList => [
  {
    id01: 'SJ0A',
    typeName: '門片',
    id02: 'SJ3020A0088',
    material: { value: '不鏽鋼304#', options: materialOptions },
    surface: { value: 'BA', options: surfaceOptions },
    basicWeight: '22.00',
    unit: 'm2',
    qty: '14.19',
    listPrice: '6171',
    totalListPrice: '87556.49',
    price: '6171',
    totalPrice: '87566',
  },
  {
    id01: 'SJ0E',
    typeName: '捲軸',
    id02: 'SJIN0E0002',
    material: '捲軸 Ø5”',
    surface: null,
    basicWeight: null,
    unit: 'M',
    qty: '1',
    listPrice: '975.00',
    totalListPrice: '4485',
    price: '453',
    totalPrice: '2084',
  },
  {
    id01: 'SJ0A',
    typeName: '門箱',
    id02: 'SJ3020A0088',
    material: { value: '不鏽鋼316#', options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: '1',
    listPrice: '11286',
    totalListPrice: '11286',
    price: '11286',
    totalPrice: '11286',
  },
  {
    id01: 'SJ0A',
    typeName: '支板',
    id02: 'SJ3020A0088',
    material: { value: '不鏽鋼316#', options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: '1',
    listPrice: '11286',
    totalListPrice: '11286',
    price: '11286',
    totalPrice: '11286',
  },
  {
    id01: 'SJ0A',
    typeName: '底座',
    id02: 'SJ3020A0088',
    material: { value: '不鏽鋼316#', options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: '1',
    listPrice: '1848',
    totalListPrice: '1848',
    price: '1848',
    totalPrice: '1848',
  },
  {
    id01: 'SJ0A',
    typeName: '門軌',
    id02: 'SJ3020A0088',
    material: { value: '不鏽鋼316#', options: materialOptions },
    surface: null,
    basicWeight: null,
    unit: null,
    qty: '1',
    listPrice: '11286',
    totalListPrice: '11286',
    price: '11286',
    totalPrice: '11286',
  },
  {
    id01: 'SJ0E',
    typeName: '馬達機',
    id02: 'SJ3020A0088',
    material: '220V 1HP',
    surface: null,
    basicWeight: null,
    unit: '組',
    qty: '1',
    listPrice: '975.00',
    totalListPrice: '4485',
    price: '453',
    totalPrice: '2084',
  },
  {
    id01: 'SJ0E',
    typeName: '配電箱及按鈕開關',
    id02: null,
    material: null,
    surface: null,
    basicWeight: null,
    unit: '組',
    qty: '1',
    listPrice: '975.00',
    totalListPrice: '4485',
    price: '453',
    totalPrice: '2084',
  },
];

export type { Tcomponent, TcomponentList };

export { fakeComponentListOri };

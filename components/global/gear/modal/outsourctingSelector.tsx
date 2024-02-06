import { selectModalCreator, Tconfig } from './selectorModalCreator';
import { useGetOutsourcing, ToutsourcingDto } from 'js/api/api_outsourcing';

const configArr: readonly Tconfig[] = [
  {
    key: 'name',
    width: '100px',
  },
  {
    key: 'principal',
    width: '100px',
  },
  {
    key: 'taxId',
    width: '100px',
  },
  {
    key: 'note',
    flex: 'auto',
  },
];

// ======================================================================
const OutsourcingSelector = selectModalCreator<ToutsourcingDto>({
  useInfinit: useGetOutsourcing,
  configArr: configArr,
});

export default OutsourcingSelector;

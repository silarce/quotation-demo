import { useReducer, Fragment } from 'react';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import DataEntry from 'components/global/gear/dataEntry';

// css
import scss from './defaultItemSelector.module.scss';

import { Tstate_electronicItem } from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

// ==================================================================

type Taction =
  | {
      type: 'checked';
      payload: {
        index: number;
        checked: boolean;
      };
    }
  | {
      type: 'category';
      payload: {
        index: number;
        category: string;
      };
    }
  | {
      type: 'qty';
      payload: {
        index: number;
        qty: number | `${number}` | '';
      };
    };

// ==================================================================
const reducer = (state: (Tstate_electronicItem & { checked: boolean })[], action: Taction) => {
  const copy = [...state];
  const { type, payload } = action;
  const index = payload.index;

  switch (type) {
    case 'checked':
      copy[index].checked = payload.checked;

      return copy;
    case 'category':
      copy[index].category = payload.category;

      return copy;

    case 'qty':
      copy[index].quantity = payload.qty === '' ? null : Number(payload.qty);

      return copy;

    default:
      return state;
  }
};

// ==================================================================
const DefaultItemSelector = ({
  state_electronicItemArr,
  onConfirm: _onConfirm,
}: {
  state_electronicItemArr: Tstate_electronicItem[];
  onConfirm: (arr: Tstate_electronicItem[]) => void;
}) => {
  const arr = state_electronicItemArr.map((item) => ({ ...item, checked: false }));

  const [stateArr, dispatch] = useReducer(reducer, arr);

  const onConfirm = () => {
    const arr = stateArr
      .filter((state) => state.checked)
      .map((_item) => {
        const { checked, ...item } = _item;

        return {
          ...item,
          category: item.category.trim(),
        };
      });

    _onConfirm(arr);
  };

  return (
    <div className="p-5">
      <div className="text-main text-bold text-xl">建議送電備品</div>
      <br />
      <div className={scss.grid}>
        <br />
        <span className="text-bold text-lg">品名</span>
        <span className="text-bold text-lg">種類</span>
        <span className="text-bold text-lg">數量</span>
        {/*  */}
        {stateArr.map((state, index) => {
          return (
            <Fragment key={index}>
              <DataEntry.Checkbox
                value={state.checked}
                onChange={(e) =>
                  dispatch({
                    type: 'checked',
                    payload: {
                      index,
                      checked: e.target.checked,
                    },
                  })
                }
              />
              <span>{state.itemName}</span>
              <DataEntry.Input
                value={state.category}
                onChange={(e) => dispatch({ type: 'category', payload: { index, category: e.target.value } })}
              />
              <DataEntry.Input
                type="number"
                min={0}
                step={0}
                value={state.quantity ?? ''}
                onChange={(e) => {
                  if (e.target.validity.valid) {
                    dispatch({ type: 'qty', payload: { index, qty: e.target.value as `${number}` } });
                  }
                }}
              />
            </Fragment>
          );
        })}

        {/*  */}
      </div>
      <br />
      <SquareBtn sharp="long" onClick={onConfirm}>
        確認
      </SquareBtn>
    </div>
  );
};

export default DefaultItemSelector;

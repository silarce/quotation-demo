import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import moment, { Moment } from 'moment';

interface Traw {
  deliveryLocation: string;
  deliveryDate: string;
  paymentMethods: {
    milestone: string;
    // totalPaymentRatio: `${number}`;
    totalPaymentRatio: string;
  }[];
}

interface Tstate {
  deliveryLocation: string;
  deliveryDate: Moment | null;
  paymentMethodArr: {
    milestone: string;
    // totalPaymentRatio: `${number}`;
    totalPaymentRatio: string;
  }[];
}

// ===========================================================================

const usePayInfo = ({ disabled, raw }: { disabled: boolean; raw: Traw | undefined | null }) => {
  const defaultState = useDefaultState(raw);
  const [state, setState] = useState<Tstate>(defaultState);

  const kit = useMemo(() => createKit({ state, setState }), [state]);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state,
    setState,
    kit,
  };
};

// ===========================================================================

const useDefaultState = (raw: Traw | undefined | null) => {
  const defaultState: Tstate = useMemo(() => {
    const { deliveryLocation, deliveryDate, paymentMethods: paymentMethod } = raw ?? {};

    return {
      deliveryLocation: deliveryLocation ?? '',
      deliveryDate: deliveryDate ? moment(deliveryDate) : null,
      paymentMethodArr: _.cloneDeep(paymentMethod ?? []),
    };
  }, [raw]);

  return defaultState;
};

const createKit = ({ state, setState }: { state: Tstate; setState: React.Dispatch<React.SetStateAction<Tstate>> }) => {
  const deleteMethod = (index: number) => {
    const newState = _.cloneDeep(state);
    newState.paymentMethodArr.splice(index, 1);
    setState(newState);
  };

  const kit = {
    deliveryLocation: {
      value: state.deliveryLocation,
      onChange: (v: string) => {
        setState((prev) => ({ ...prev, deliveryLocation: v }));
      },
    },
    deliveryDate: {
      value: state.deliveryDate,
      onChange: (v: Moment | null) => {
        setState((prev) => ({ ...prev, deliveryDate: v }));
      },
    },
    paymentMethodArr: state.paymentMethodArr.map((method, index) => {
      return {
        milestone: {
          value: method.milestone,
          onChange: (v: string) => {
            const copy = { ...state };
            copy.paymentMethodArr[index].milestone = v;
            setState(copy);
          },
        },
        totalPaymentRatio: {
          value: method.totalPaymentRatio,
          onChange: (v: string) => {
            const copy = { ...state };
            copy.paymentMethodArr[index].totalPaymentRatio = v;
            setState(copy);
          },
        },
        onDelete: () => {
          deleteMethod(index);
        },
      };
    }),
    addPaymentMethod: () => {
      const copy = _.cloneDeep(state);
      copy.paymentMethodArr.push({ milestone: '', totalPaymentRatio: '' });
      setState(copy);
    },
  };

  return kit;
};

export { usePayInfo };
export type { Tstate as Tstate_payInfo };

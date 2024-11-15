import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import moment, { Moment } from 'moment';

interface Traw {
  deliveryLocation: string;
  deliveryDate: string;
  paymentMethod: {
    milestone: string;
    // totalPaymentRatio: `${number}`;
    totalPaymentRatio: string;
  }[];
}

interface Tstate {
  deliveryLocation: string;
  deliveryDate: Moment | null;
  paymentMethod: {
    milestone: string;
    // totalPaymentRatio: `${number}`;
    totalPaymentRatio: string;
  }[];
}

// ===========================================================================

const usePayInfo = ({ disabled, raw }: { disabled: boolean; raw: Traw }) => {
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

const useDefaultState = (raw: Traw) => {
  const defaultState: Tstate = useMemo(() => {
    const { deliveryLocation, deliveryDate, paymentMethod } = raw;

    return {
      deliveryLocation,
      deliveryDate: deliveryDate ? moment(deliveryDate) : null,
      paymentMethod: _.cloneDeep(paymentMethod),
    };
  }, [raw]);

  return defaultState;
};

const createKit = ({ state, setState }: { state: Tstate; setState: React.Dispatch<React.SetStateAction<Tstate>> }) => {
  const deleteMethod = (index: number) => {
    const newState = _.cloneDeep(state);
    newState.paymentMethod.splice(index, 1);
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
    paymentMethodArr: state.paymentMethod.map((method, index) => {
      return {
        milestone: {
          value: method.milestone,
          onChange: (v: string) => {
            const copy = { ...state };
            copy.paymentMethod[index].milestone = v;

            return copy;
          },
        },
        totalPaymentRatio: {
          value: method.totalPaymentRatio,
          onChange: (v: string) => {
            const copy = { ...state };
            copy.paymentMethod[index].totalPaymentRatio = v;

            return copy;
          },
        },
        onDelete: () => {
          deleteMethod(index);
        },
      };
    }),
    addPaymentMethod: () => {
      const copy = _.cloneDeep(state);
      copy.paymentMethod.push({ milestone: '', totalPaymentRatio: '' });
      setState(copy);
    },
  };

  return kit;
};

export { usePayInfo };

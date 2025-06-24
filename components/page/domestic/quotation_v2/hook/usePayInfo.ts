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
  paymentMethodArr: TpaymentMethod[];
}

interface TpaymentMethod {
  milestone: string;
  totalPaymentRatio: `${number}` | '';
}

// type TexportState = Tstate;
type TexportState = Omit<Tstate, 'deliveryDate'> & {
  deliveryDate: string | null;
};

// ===========================================================================

const usePayInfo = ({ disabled, raw }: { disabled: boolean; raw: Traw | undefined | null }) => {
  const defaultState = useDefaultState(raw);
  const [state, setState] = useState<Tstate>(defaultState);

  const kit = useMemo(() => createKit({ state, setState }), [state]);

  const exportState = ({
    exportCopy = false,
  }: {
    exportCopy?: boolean;
  } = {}) => {
    if (exportCopy) {
      return _.cloneDeep(state);
    }

    return state;
  };

  const restoreState = (backupState: TexportState) => {
    const { deliveryLocation, deliveryDate, paymentMethodArr } = backupState;

    setState({
      deliveryLocation,
      paymentMethodArr,
      deliveryDate: deliveryDate ? moment(backupState.deliveryDate) : null,
    });
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state,
    setState,
    kit,
    exportState,
    restoreState,
  };
};

// ===========================================================================

const useDefaultState = (raw: Traw | undefined | null) => {
  const defaultState: Tstate = useMemo(() => {
    const { deliveryLocation, deliveryDate, paymentMethods } = raw ?? {};

    const paymentMethodArr = raw ? (_.cloneDeep(paymentMethods) as TpaymentMethod[]) : createDefaultPaymentMethod();

    return {
      deliveryLocation: deliveryLocation ?? '',
      deliveryDate: deliveryDate ? moment(deliveryDate) : null,
      paymentMethodArr: paymentMethodArr,
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
          onChange: (v: `${number}` | '') => {
            const copy = { ...state };
            copy.paymentMethodArr[index].totalPaymentRatio = v as `${number}` | '';
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

// ===========================================================================

const createDefaultPaymentMethod = () => {
  const paymentMethodArr: TpaymentMethod[] = [
    {
      milestone: '訂製同時付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '門軌安裝完成付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '門扇安裝完成付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '驗收完成(保留款)付總金額',
      totalPaymentRatio: '',
    },
  ];

  return paymentMethodArr;
};

// ===========================================================================
export { usePayInfo };
export type { TexportState, Tstate as Tstate_payInfo };

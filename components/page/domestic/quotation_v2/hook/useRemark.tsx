import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// gear
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

const AnnoSelectorGroup = selectModalCreator_multi<['annotation']>({
  selectorArr: [
    {
      key: 'annotation',
      caption: '備註',
      // limit: 1,
    },
  ],
});

const RangeSelectorGroup = selectModalCreator_multi<['quotationRange']>({
  selectorArr: [
    {
      key: 'quotationRange',
      caption: '報價範圍',
      // limit: 1,
    },
  ],
});

// ===============================================================================

interface Tprops {
  disabled: boolean;
  raw_remarkArr: string[] | undefined | null;
}

// ===============================================================================

const useRemark = ({ disabled, raw_remarkArr }: Tprops) => {
  const [remarkArr, setRemarkArr] = useState<string[]>(raw_remarkArr || []);

  const editRemark = (index: number, v: string) => {
    const newRemarkList = [...remarkArr];
    newRemarkList[index] = v;
    setRemarkArr(newRemarkList);
  };

  const delRemark = (index: number) => {
    const newRemarkList = [...remarkArr];
    newRemarkList.splice(index, 1);
    setRemarkArr(newRemarkList);
  };

  const addRemark = (newRemarkArr: string[] | string = '') => {
    if (typeof newRemarkArr === 'string') {
      setRemarkArr([...remarkArr, newRemarkArr]);
    } else {
      setRemarkArr([...remarkArr, ...newRemarkArr]);
    }
  };

  const restoreState = (backupState: string[]) => {
    setRemarkArr(backupState);
  };

  useEffect(() => {
    setRemarkArr(raw_remarkArr || []);
  }, [raw_remarkArr, disabled]);

  return { remarkArr, editRemark, delRemark, addRemark, restoreState };
};

const useAnnotations = (props: Tprops) => {
  const { remarkArr, editRemark, delRemark, addRemark, restoreState } = useRemark(props);

  const annoKitArr = remarkArr.map((value, index) => {
    return {
      value,
      onChange: (v: string) => {
        editRemark(index, v);
      },
      onDelete: () => {
        delRemark(index);
      },
    };
  });

  const openSelector = () => {
    const container = document.createElement('div');
    container.className = 'tempDOMContainer';
    document.body.appendChild(container);

    const root = createRoot(container);

    const unmountComponent = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <>
        <AnnoSelector
          onConfirm={(arr) => {
            addRemark(arr);
          }}
          onCancel={unmountComponent}
        />
      </>
    );
  };

  return {
    annoKitArr,
    annoArr: remarkArr,
    addAnno: addRemark,
    openSelector,
    restoreState,
  };
};

const useQuotationRange = (props: Tprops) => {
  const { remarkArr, editRemark, delRemark, addRemark, restoreState } = useRemark(props);

  const quotationRangeKitArr = remarkArr.map((value, index) => {
    return {
      value,
      onChange: (v: string) => {
        editRemark(index, v);
      },
      onDelete: () => {
        delRemark(index);
      },
    };
  });

  const openSelector = () => {
    const container = document.createElement('div');
    container.className = 'tempDOMContainer';
    document.body.appendChild(container);

    const root = createRoot(container);

    const unmountComponent = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <>
        <QuotationRangeSelector
          onConfirm={(arr) => {
            addRemark(arr);
          }}
          onCancel={unmountComponent}
        />
      </>
    );
  };

  return {
    quotationRangeKitArr,
    quotationRangeArr: remarkArr,
    addQuotationRange: addRemark,
    openSelector,
    restoreState,
  };
};

const AnnoSelector = ({ onConfirm, onCancel }: { onConfirm: (arr: string[]) => void; onCancel: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    !show &&
      setTimeout(() => {
        onCancel();
      }, 300);
  }, [show]);

  return (
    <AnnoSelectorGroup
      showModal={show}
      onConfirm={(arr) => {
        const value = (arr[0] ?? []).map((anno) => {
          return anno.description;
        });
        onConfirm(value);
      }}
      onCancel={() => {
        setShow(false);
      }}
    />
  );
};

const QuotationRangeSelector = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: (arr: string[]) => void;
  onCancel: () => void;
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    !show &&
      setTimeout(() => {
        onCancel();
      }, 300);
  }, [show]);

  return (
    <RangeSelectorGroup
      showModal={show}
      onConfirm={(arr) => {
        const value = (arr[0] ?? []).map((anno) => {
          return anno.description;
        });
        onConfirm(value);
      }}
      onCancel={() => {
        setShow(false);
      }}
    />
  );
};

export { useAnnotations, useQuotationRange };

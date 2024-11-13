import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// gear
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  raw_remarkArr: string[] | undefined;
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

  const addRemark = (newRemarkArr: string[] = []) => {
    setRemarkArr([...remarkArr, ...newRemarkArr]);
  };

  useEffect(() => {
    setRemarkArr(raw_remarkArr || []);
  }, [raw_remarkArr, disabled]);

  return { remarkArr, editRemark, delRemark, addRemark };
};

const useAnnotations = (props: Tprops) => {
  const instance = useRemark(props);

  const openSelector = () => {
    const container = document.createElement('div');
    container.className = 'tempDOMContainer';
    document.body.appendChild(container);

    const root = createRoot(container);

    const unmountComponent = () => {
      root.unmount();
    };

    // root.render(
    //   <AnnoSelectorGroup
    //     showModal={true}
    //     onConfirm={() => {}}
    //     onCancel={() => {
    //       unmountComponent();
    //     }}
    //   />
    // );
    root.render(
      <>
        <Foo
          onCancel={unmountComponent}
          onConfirm_anno={(arr) => {
            instance.addRemark(arr);
          }}
        />
      </>
    );

    document.body.removeChild(container);

    // document.body.removeChild(container);

    // const { destroy } = myAlert.clear({
    //   content: (
    //     <AnnoSelectorGroup
    //       showModal={true}
    //       onConfirm={() => {}}
    //       onCancel={() => {
    //         destroy();
    //       }}
    //     />
    //   ),
    // });
  };

  return {
    ...instance,
    openSelector,
  };
};

const Foo = ({
  onConfirm_anno,
  onCancel,
}: {
  onConfirm_anno: (arr: string[]) => void;

  onCancel: () => void;
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    return () => {
      onCancel();
    };
  }, []);

  return (
    <AnnoSelectorGroup
      showModal={show}
      onConfirm={(arr) => {
        const value = (arr[0] ?? []).map((anno) => {
          return anno.description;
        });
        onConfirm_anno(value);
      }}
      onCancel={() => {
        setShow(false);
        // onCancel();
        // unmountComponent();
      }}
      // afterClose={onCancel}
    />
  );
};

export { useAnnotations };

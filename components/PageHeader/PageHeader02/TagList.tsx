import { Dispatch, SetStateAction } from 'react';

// css
import scss from './pageHeader02.module.scss';

export interface Ttag {
  label: string;
  onClick: () => void;
}
export type TtagList = Ttag[];

/**多個tag 附帶onClick */
export default function TagList({
  tagList,
  active,
  setActive,
}: {
  tagList: Ttag[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  if (tagList.length === 0) {
    return null;
  }

  return (
    <>
      {tagList.map((item, index) => {
        const { label, onClick } = item;

        const theOnClick = () => {
          onClick();
          setActive(index);
        };

        const isActive = active === index ? scss.active : '';

        return (
          <button key={index} className={isActive} onClick={theOnClick}>
            <span>{label}</span>
            <hr className={scss.bottomBar} />
          </button>
        );
      })}
    </>
  );
}

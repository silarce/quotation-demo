import { useState } from 'react';
import classNames from 'classnames';

// css
import scss from './pageHeader02.module.scss';

export interface Ttag {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}
export type TtagList = Ttag[];

/**多個tag 附帶onClick */
export default function TagList({ tagList }: { tagList: Ttag[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const isControlled = tagList.some((tag) => {
    return tag.isActive !== undefined;
  });

  return (
    <>
      {tagList.map((item, index) => {
        const { label, onClick } = item;

        const theOnClick = () => {
          onClick?.();
          !isControlled && setActiveIndex(index);
        };

        let isActive = false;

        if (isControlled) {
          isActive = !!item.isActive;
        } else {
          isActive = activeIndex === index;
        }

        return (
          <button
            key={index}
            //
            className={classNames(isActive && scss.active)}
            onClick={theOnClick}
          >
            <span>{label}</span>
            <hr className={scss.bottomBar} />
          </button>
        );
      })}
    </>
  );
}

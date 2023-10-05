import { Fragment } from 'react';
import Link, { LinkProps } from 'next/link';

// css
import style from './listBody01.module.scss';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

type TmemoList = {
  memoId: string;
  memoDate: string;
  memoContent: string;
  href: LinkProps['href'];
};

export type { TmemoList };

export default function ListBody01({ memoList }: { memoList: TmemoList[] }) {
  return (
    <div className={style.container}>
      {memoList.map((item, index) => {
        const { memoId, memoDate, memoContent, href } = item;

        return (
          <Fragment key={index}>
            <span>{memoId}</span>
            <span>{memoDate}</span>
            <span>{memoContent}</span>
            <Link href={href}>
              <IconDetail />
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}

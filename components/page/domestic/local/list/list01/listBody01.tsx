import { Fragment } from 'react';
import Link, { LinkProps } from 'next/link';

// css
import scss from './listBody01.module.scss';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

type TsubContract = {
  contractNumber: string;
  createdAt: string;
  projectName: string;
  verifyForm: React.ReactNode;
  href: LinkProps['href'];
};

export type { TsubContract };

export default function ListBody01({ memoList }: { memoList: TsubContract[] }) {
  return (
    <div className={scss.container}>
      {memoList.map((item, index) => {
        const {
          //
          contractNumber,
          createdAt,
          projectName,
          verifyForm,
          href,
        } = item;

        return (
          <Fragment key={index}>
            <span>{contractNumber}</span>
            <span>{createdAt}</span>
            <span>{projectName}</span>
            {verifyForm}
            <Link href={href} className={scss.link}>
              <IconDetail />
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}

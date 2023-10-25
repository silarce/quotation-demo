import classNames from 'classnames';
import Link from 'next/link';

// css
import scss from './pageHeader02.module.scss';

interface Tlink {
  linkProps?: React.ComponentProps<typeof Link>;
  label: string;
  isActive?: boolean;
  // linkProps: LinkProps;
  // href: React.ComponentProps<typeof Link>['href'];
}

type TlinkArr = (Tlink | null | undefined)[];

export type { Tlink, TlinkArr };

/**
 * 如果linkList的item沒有isActive，會用pathname判斷是否isActive
 */
export default function LinkList({
  linkList,
  pathname,
}: {
  //
  linkList: TlinkArr;
  pathname?: string;
}) {
  return (
    <>
      {linkList.map((config, index) => {
        if (!config) {
          return null;
        }

        const { label, linkProps } = config;
        let { isActive } = config;

        if (isActive === undefined) {
          if (typeof linkProps?.href === 'string') {
            isActive = linkProps?.href === pathname;
          } else {
            isActive = linkProps?.href.pathname === pathname;
          }
        }

        return (
          <Link
            key={index}
            className={classNames(isActive && scss.active, linkProps?.className)}
            {...linkProps}
            href={linkProps?.href || {}}
          >
            <span>{label}</span>
            <hr className={scss.bottomBar} />
          </Link>
        );
      })}
    </>
  );
}

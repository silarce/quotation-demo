import Link from 'next/link';

// global
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './dispatchList.module.scss';

type Tdispatch_simple = {
  dispatchDate: string;
  workerNameArr: string[];
  tasks: string;
  href: Parameters<typeof Link>[0]['href'];
};

export type { Tdispatch_simple };
// ===========================================================

export default function List({ list }: { list: Tdispatch_simple[] }) {
  return (
    <div className={scss.list}>
      <div className={scss.thead}>
        <div>
          <span>{'日期'}</span>
        </div>
        <div>
          <span>{'工務人員'}</span>
        </div>
        <div>
          <span>{'辦理事項'}</span>
        </div>
      </div>
      <div className={scss.tbody}>
        {list.map((item, index) => {
          const { dispatchDate, workerNameArr, tasks, href } = item;

          return (
            <CellWithBar className={scss.row} key={index}>
              <div>
                <span>{dispatchDate}</span>
              </div>
              <div className={scss.workerCell}>
                {workerNameArr.map((name, index) => {
                  return <span key={index}>{name}</span>;
                })}
              </div>
              <div className={scss.task}>{tasks}</div>
              <div>
                <Link href={href}>
                  <IconDetail />
                </Link>
              </div>
            </CellWithBar>
          );
        })}
      </div>
    </div>
  );
}

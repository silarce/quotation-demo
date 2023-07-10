import classNames from 'classnames';

import scss from './tabBar.module.scss';

export default function TabBar({ query, switchTab }: { query: string; switchTab: (query: string) => void }) {
  return (
    <div className={scss.bar}>
      {configArr.map((item, index) => {
        const isActive = query === item.label;
        const label = item.label;

        const onClick = () => switchTab(label);

        return (
          <div key={index} onClick={onClick} className={classNames(scss.tab, { [scss.active]: isActive })}>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ======================================================================
// ======================================================================
// ======================================================================

const configArr = [
  { label: '底座' },
  { label: '捲門片' },
  { label: '門軌' },
  { label: '捲軸' },
  { label: '電動機' },
  { label: '配電箱及按鈕開關' },
];

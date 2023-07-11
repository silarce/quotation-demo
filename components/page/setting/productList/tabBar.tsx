import classNames from 'classnames';

import scss from './tabBar.module.scss';

export default function TabBar({
  query,
  switchTab,
}: {
  query: string;
  switchTab: (
    query: 'base' | 'rollDoorPiece' | 'doorTrack' | 'supportPlate' | 'reel' | 'motor' | 'motorParts' | 'reelBox'
  ) => void;
}) {
  return (
    <div className={scss.bar}>
      {configArr.map((item, index) => {
        const isActive = query === item.value;
        const { value, label } = item;

        const onClick = () => switchTab(value);

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
  { value: 'base', label: '底座' },
  { value: 'rollDoorPiece', label: '捲門片' },
  { value: 'doorTrack', label: '門軌' },
  { value: 'supportPlate', label: '支板' },
  { value: 'reel', label: '捲軸' },
  { value: 'motor', label: '電動機' },
  { value: 'motorParts', label: '馬達配件' },
  { value: 'reelBox', label: '捲箱' },
  // { value: '', label: '配電箱及按鈕開關' },
] as const;

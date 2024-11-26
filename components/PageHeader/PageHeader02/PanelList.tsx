import { Dispatch, SetStateAction, Fragment } from 'react';
import classNames from 'classnames';

// global gear
import MyButton from 'components/global/gear/button/myButton';
import RedButton from 'components/global/gear/button/redButton';
import AddButton from 'components/global/gear/button/addButton';
import ExportButton from 'components/global/gear/button/exportButton';
import InputSearch from 'components/global/gear/input/inputSearch';
import SearchBar from 'components/global/gear/HOC/searchBar/searchBar';

// css
import scss from './pageHeader02.module.scss';

// type
import { TsearchGroup } from 'components/global/gear/HOC/searchBar/searchBar';

// 各種按鈕，可以變更或加上icon
interface Tpanel_btn {
  type: 'myButton' | 'redButton' | 'addButton' | 'exportButton';
  label: string;
  onClick: () => void;
  placeholder?: undefined;
  className?: string;
  img?: string;
  custom?: undefined;
  searchGroup?: undefined;
  defaultValue?: undefined;
}

// 搜尋input
interface Tpanel_inpusearch {
  type: 'inputSearch';
  placeholder: string;
  onClick: (value: string) => void;
  label?: undefined;
  className?: string;
  img?: string;
  custom?: undefined;
  searchGroup?: undefined;
  stateValue?: string;
  setStateValue?: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
}

// 客製化元件
interface Tpanel_custom {
  custom: JSX.Element;
  type?: undefined;
  label?: undefined;
  onClick?: undefined;
  placeholder?: undefined;
  className?: undefined;
  img?: undefined;
  searchGroup?: undefined;
}

// SearchBar 用的
interface TpanelSearchBar {
  searchGroup: TsearchGroup;
  custom?: undefined;
  type?: undefined;
  label?: undefined;
  onClick?: undefined;
  placeholder?: undefined;
  className?: undefined;
  img?: undefined;
}

export type TpanelList = (Tpanel_btn | Tpanel_inpusearch | Tpanel_custom | TpanelSearchBar | null | undefined)[];

export default function PanelList({ panelList }: { panelList: TpanelList }) {
  if (panelList.length === 0) {
    return null;
  }

  return (
    <div className={scss.panelList}>
      {panelList.map((item, index) => {
        if (!item) {
          return null;
        }

        // 客製化panel
        if (item.custom) {
          return <Fragment key={index}>{item.custom}</Fragment>;
        }

        // 搜尋bar
        if (item.searchGroup) {
          const { searchTargetList, doSearch, controlled } = item.searchGroup;

          return (
            <SearchBar key={index} searchTargetList={searchTargetList} controlled={controlled} doSearch={doSearch} />
          );
        }

        // 通常的按鈕bar
        const { label, type, onClick, placeholder, className, img, defaultValue } = item;

        return (
          <Fragment key={index}>
            {type === 'myButton' ? (
              <MyButton label={label} onClick={onClick} className={classNames(scss.btn, className)} img={img} />
            ) : type === 'redButton' ? (
              <RedButton label={label} onClick={onClick} className={classNames(scss.btn, className)} img={img} />
            ) : type === 'addButton' ? (
              <AddButton label={label} onClick={onClick} className={classNames(scss.btn, className)} />
            ) : type === 'exportButton' ? (
              <ExportButton label={label} onClick={onClick} className={classNames(scss.btn, className)} />
            ) : type === 'inputSearch' ? (
              <InputSearch
                placeholder={placeholder}
                onClick={onClick}
                className={classNames(scss.btn, className)}
                defaultValue={defaultValue}
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
} // PanelList

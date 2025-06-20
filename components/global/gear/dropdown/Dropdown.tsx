import { Dropdown as Antd_Dropdown, DropDownProps, Menu as Antd_Menu, MenuProps } from 'antd';
import classNames from 'classnames';

import scss from './dropdown.module.scss';

type Tprops = Omit<DropDownProps, 'overlay'> & {
  // itemArr?: React.ReactNode[];
  // props_menu?: Tprops_menu;
  className_labeWrapper?: string;
};

type Tprops_menu = Omit<MenuProps, 'children'> & { itemArr?: React.ReactNode[] };

export default function Dropdown(props?: Tprops) {
  const {
    //
    className,
    className_labeWrapper,
    children,
    // itemArr,
    // props_menu,
    ...dropdownProps
  } = props ?? {};

  return (
    <Antd_Dropdown
      //
      trigger={['click']}
      {...dropdownProps}
      className={classNames(scss.dropdown, className)}
      // overlay={<Menu itemArr={itemArr} {...props_menu} />}
    >
      <div className={classNames(scss.label, className_labeWrapper)}>{children}</div>
    </Antd_Dropdown>
  );
}

const Menu = ({ itemArr, className, ...menuProps }: Tprops_menu = {}) => {
  return (
    <Antd_Menu className={classNames(scss.menu, className)} {...menuProps}>
      {itemArr?.map((item, index) => {
        return (
          <Antd_Menu.Item key={index} className={scss.item}>
            {item}
          </Antd_Menu.Item>
        );
      })}
    </Antd_Menu>
  );
};

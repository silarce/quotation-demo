import { useState, useContext } from 'react';
import ChangePwPanel from 'components/global/gear/modal/changePwPanel';
import Image from 'next/image';

import Dropdown from 'components/global/gear/dropdown/Dropdown';
import { Switch } from 'antd';

// img
import iconMember from 'public/image/icon/member.svg?url';
import iconGear from 'public/image/icon/gear.svg?url';

// icon
import logout from 'public/image/icon/logout.svg?url';

// css
import scss from './info.module.scss';

// ctx
import { LayerCtx } from 'components/Layer/Layer';

import { useTranslation } from 'react-i18next';

import { useGlobal_OptionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';

// ===================================================================

export default function Info() {
  const { reqLogout, userInfo } = useContext(LayerCtx);
  const [showPwModal, setShowPwModal] = useState(false);

  const { t, i18n } = useTranslation('common');
  const { changeLanguage } = i18n;

  const { isRefactoredQuotaion: isQuotation2, setIsRefactoredQuotaion: setIsQuotation2 } = useGlobal_OptionalConfig();

  // ----------------------------------------------

  const userName = (() => {
    if (userInfo.employee?.chName) {
      return userInfo.employee.chName;
    }

    if (userInfo.employee?.enName) {
      return userInfo.employee.enName;
    }

    return userInfo.username;
  })();
  const departmentName = userInfo.employee?.jobs[0]?.department.name ?? '無部門';

  // ----------------------------------------------
  const openPwModal = () => {
    setShowPwModal(true);
  };

  const onCancel = () => {
    setShowPwModal(false);
  };
  // ----------------------------------------------

  return (
    <div className={scss.container}>
      <div className={scss.left}>
        {/* <Image src={iconMember} alt="頭像" className={scss.avatar} priority={true} /> */}

        <div className={scss.name}>
          <p>{departmentName}</p>
          <p>{userName}</p>
        </div>
      </div>

      <div className={scss.line} />

      <div className={scss.right}>
        <div className={scss.language}>
          <Dropdown
            className={scss.dropdown}
            menu={{
              items: [
                {
                  key: '0',
                  label: (
                    <span onClick={() => changeLanguage('zh-TW')} className={'!w-full'}>
                      繁體中文
                    </span>
                  ),
                },
                {
                  key: '1',
                  label: (
                    <span onClick={() => changeLanguage('en')} className={'!w-full'}>
                      English
                    </span>
                  ),
                },
              ],
            }}
          >
            <span>{t('languageName')}</span>
          </Dropdown>
        </div>

        <div className={scss.changePw} onClick={openPwModal}>
          <span>變更密碼</span>
        </div>

        <div className={scss.logout} onClick={reqLogout}>
          <Image src={logout} alt="登出" />
          <span>登出</span>
        </div>

        <Dropdown
          className={scss.gear}
          menu={{
            items: [
              {
                key: '0',
                label: (
                  <div className="flex gap-2 cursor-auto" onClick={(e) => e.stopPropagation()}>
                    <span>使用新版報價單</span>
                    <Switch
                      onChange={(isChecked) => {
                        setIsQuotation2(isChecked);
                      }}
                      checked={isQuotation2}
                    />
                  </div>
                ),
              },
            ],
          }}
        >
          <Image className="h-5 w-5" src={iconGear} alt="設定" priority={true} />
        </Dropdown>
      </div>

      <ChangePwPanel open={showPwModal} onCancel={onCancel} />
    </div>
  );
}

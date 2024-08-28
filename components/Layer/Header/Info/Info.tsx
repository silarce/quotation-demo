import { useState, useContext } from 'react';
import ChangePwPanel from 'components/global/gear/modal/changePwPanel';
import Image from 'next/image';

import Dropdown from 'components/global/gear/dropdown/Dropdown';

// img
import iconMember from 'public/image/icon/member.svg';

// icon
import logout from 'public/image/icon/logout.svg';

// css
import scss from './info.module.scss';

// ctx
import { LayerCtx } from 'components/Layer/Layer';

import { useTranslation } from 'react-i18next';

// ===================================================================

export default function Info() {
  const { reqLogout, userInfo } = useContext(LayerCtx);
  const [showPwModal, setShowPwModal] = useState(false);

  const { t, i18n } = useTranslation('common');
  const { changeLanguage } = i18n;

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
      <Image src={iconMember} alt="頭像" className={scss.avatar} />

      <div className={scss.name}>
        <p>{departmentName}</p>
        <p>{userName}</p>
      </div>
      <div className={scss.language}>
        <Dropdown
          className={scss.dropdown}
          props_menu={{
            itemArr: [
              //
              <span key="01" onClick={() => changeLanguage('zh-TW')}>
                繁體中文
              </span>,
              <span key="02" onClick={() => changeLanguage('en')}>
                English
              </span>,
            ],
          }}
        >
          <span>{t('languageName')}</span>
        </Dropdown>
      </div>

      <div className={scss.changePw} onClick={openPwModal}>
        <span>變更密碼</span>
      </div>

      <div className={scss.line} />

      <div className={scss.logout} onClick={reqLogout}>
        <Image src={logout} alt="登出" />
        <span>登出</span>
      </div>

      <ChangePwPanel visible={showPwModal} onCancel={onCancel} />
    </div>
  );
}

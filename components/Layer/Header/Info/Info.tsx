import { useState, useContext } from 'react';
import ChangePwPanel from 'components/global/gear/modal/changePwPanel';

// img
import iconMember from 'public/image/icon/member.svg';
// icon
import logout from 'public/image/icon/logout.svg';

// css
import scss from './info.module.scss';

// ctx
import { LayerCtx } from 'components/Layer/Layer';

export default function Info() {
  const { reqLogout, userInfo } = useContext(LayerCtx);
  const [showPwModal, setShowPwModal] = useState(false);

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconMember.src} alt="頭像" className={scss.avatar} />

      <div className={scss.name}>
        <p>{departmentName}</p>
        <p>{userName}</p>
      </div>

      <div className={scss.changePw} onClick={openPwModal}>
        <span>變更密碼</span>
      </div>

      <div className={scss.line} />

      <div className={scss.logout} onClick={reqLogout}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logout.src} alt="登出" />
        <span>登出</span>
      </div>

      <ChangePwPanel visible={showPwModal} onCancel={onCancel} />
    </div>
  );
}

import { useState, ReactElement } from 'react';

import Image from 'next/image';

// antd
import { Button } from 'antd';

// global gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Input_pw from 'components/global/gear/inputAndSel/Input_pw';

// logo
import logo from 'public/image/logo/logoWithYear.svg?url';
import erpLogo from 'public/image/logo/erpLogo.svg?url';
import imgArc from 'public/image/blueArc.svg?url';
// img
import Imgbanner from 'public/image/loginBanner.png';
import Imgbanner_mobile from 'public/image/loginBanner_mobile.png';

// css
import scss from './login.module.scss';

import { apiLogin } from 'js/api/api_auth';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

import { useRwd } from 'hooks/globalState/useRwd';

// ===================================================================================

const devAccount: { name: string; account: string; password: string }[] | undefined =
  process.env.NEXT_PUBLIC_NAV_DEV_DEVACCOUNT && JSON.parse(process.env.NEXT_PUBLIC_NAV_DEV_DEVACCOUNT);

const Login = () => {
  const { update: update_userInfo } = useGlobal_userInfo();

  const { rwd1023 } = useRwd();

  const [isLoading, setIsLoading] = useState(false);
  const [state_account, setState_accont] = useState('');
  const [state_password, setState_password] = useState('');

  const reqLog = async ({ acc, pw }: { acc?: string; pw?: string } = {}) => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const account = acc ?? state_account.trim();
      const password = pw ?? state_password.trim();
      await apiLogin({ account, password });
      await update_userInfo();
    } catch {
      myAlert.err({ title: '帳號或密碼錯誤' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={scss.login}>
      <div className={scss.top}>
        <div>
          <Image src={logo} alt="logo" />
        </div>
        <div>
          <Image src={erpLogo} alt="erpLogo" />
        </div>
        <div>
          <Image src={imgArc} alt="" />
        </div>
      </div>

      <div
        className={scss.banner}
        style={{ backgroundImage: `url(${rwd1023 ? Imgbanner_mobile.src : Imgbanner.src})` }}
      >
        <div>
          <span>登入系統</span>
        </div>
      </div>

      <form
        className={scss.loginPanel}
        onSubmit={(e) => {
          e.preventDefault();
          reqLog();
        }}
      >
        <Input_pw
          value={state_account}
          onChange={setState_accont}
          label={'帳號'}
          inputType={'text'}
          captionWidth="40px"
          firstGap="50px"
        />
        <Input_pw
          className="mt-[23px]"
          value={state_password}
          onChange={setState_password}
          label={'密碼'}
          inputType={'auto'}
          captionWidth="40px"
          firstGap="50px"
        />

        <Button className={scss.btn} htmlType="submit" loading={isLoading}>
          登入
        </Button>
      </form>

      {/* 左下角背景的1/4球 */}
      <div className={scss.xball}>
        <div>
          <div />
          <div />
        </div>
      </div>

      {/* 右下角背景的一條線 */}
      <div className={scss.bgLine} />
      {/*  */}
      {devAccount && (
        <div className={scss.accountList}>
          {devAccount?.map((item, index) => {
            const { name, account, password } = item;

            return (
              <div key={index} onClick={() => reqLog({ acc: account, pw: password })}>
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <div>{page}</div>;
};

export default Login;

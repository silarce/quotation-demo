import { useState, useContext, ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';

import Image from 'next/image';

// antd
import { Button } from 'antd';

// global gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Input_pw from 'components/global/gear/inputAndSel/Input_pw';

// logo
import logo from 'public/image/logo/logoWithYear.svg';
import erpLogo from 'public/image/logo/erpLogo.svg';
import imgArc from 'public/image/blueArc.svg';
// img
import Imgbanner from 'public/image/loginBanner.png';
import Imgbanner_mobile from 'public/image/loginBanner_mobile.png';

// css
import scss from './login.module.scss';

import { AppContext } from 'pages/_app';

const Login: NextPageWithLayout<{
  onLogin: (postBody: { account: string; password: string }) => void;
}> = ({ onLogin }) => {
  const { rwd1023 } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccont] = useState('');
  const [password, setPassword] = useState('');

  const reqLog = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const acc = account.trim();
      const pw = password.trim();
      await onLogin({ account: acc, password: pw });
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
          value={account}
          onChange={setAccont}
          label={'帳號'}
          inputType={'text'}
          captionWidth="40px"
          firstGap="50px"
        />
        <Input_pw
          className="mt-[23px]"
          value={password}
          onChange={setPassword}
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
    </div>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <div>{page}</div>;
};

export default Login;

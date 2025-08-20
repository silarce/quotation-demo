import { useState } from 'react';
import { AxiosError } from 'axios';
// antd
import { Modal, Button } from 'antd';

// gear
import myAlert from './simpleModal/alertModals';
import Input_pw from 'components/global/gear/inputAndSel/Input_pw';
// css
import scss from './changePwPanel.module.scss';

// api
import { apiAuthPassword } from 'js/api/api_auth';

import { DataEntry_fong, Input_Password } from '../dataEntry';
import Btn from '../button/btn_fong';

type TpwPostBody = {
  oldPassword: string;
  newPassword: string;
};

export default function ChangePwPanel({ open: visible, onCancel }: { open: boolean; onCancel: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');

  const theOnConfirm = () => {
    if (!oldPw) {
      return myAlert.warning({ title: '請輸入舊密碼' });
    }

    if (!newPw) {
      return myAlert.warning({ title: '請輸入新密碼' });
    }

    if (!newPw2) {
      return myAlert.warning({ title: '請確認新密碼' });
    }

    if (newPw !== newPw2) {
      return myAlert.warning({ title: '新密碼與確認新密碼不相符' });
    }

    onConfirm({
      oldPassword: oldPw,
      newPassword: newPw,
    });
  };

  const theOnCancel = () => {
    setOldPw('');
    setNewPw('');
    setNewPw2('');
    onCancel();
  };

  // -------------------------------------------------------------------------

  const onConfirm = async (postBody: TpwPostBody) => {
    const { newPassword, oldPassword } = postBody;

    if (newPassword.length < 8 || oldPassword.length < 8) {
      return myAlert.warning({ title: '新舊密碼長度不能小於8碼' });
    }

    try {
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      await apiAuthPassword(postBody);
      theOnCancel();
      myAlert.success({ title: '變更密碼成功' });
    } catch (error) {
      const err = error as AxiosError<{
        error: string;
        message: string;
        statusCode: number;
      }>;
      const { message, statusCode } = err.response?.data ?? {};

      // myAlert.err({ title: statusCode, content: message })
      if (statusCode === 404) {
        myAlert.err({ title: '舊密碼錯誤' });
      } else {
        myAlert.err({ title: '未知錯誤' });
      }

      return err;
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  return (
    <Modal
      width={350}
      className={scss.antdModalChangePw}
      open={visible}
      closable={false}
      centered={true}
      maskClosable={true}
      footer={null}
      onCancel={theOnCancel}
      destroyOnHidden={true}
      afterClose={theOnCancel}
    >
      <div className={scss.header}>
        <div>
          <span className="text-[16px] font-bold">變更密碼</span>
        </div>
      </div>

      <div className={scss.body}>
        <form className={scss.inputContainer} onSubmit={(e) => e.preventDefault}>
          {/* 為了讓瀏覽器不要在控制台跳警告 */}
          <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} />
          <div className="flex flex-col gap-5 mt-6">
            <DataEntry_fong caption="舊密碼" isMust>
              <Input_Password value={oldPw} onChange={(e) => setOldPw(e.target.value)}></Input_Password>
            </DataEntry_fong>
            <DataEntry_fong caption="新密碼" isMust>
              <Input_Password value={newPw} onChange={(e) => setNewPw(e.target.value)}></Input_Password>
            </DataEntry_fong>
            <DataEntry_fong caption="確認新密碼" isMust>
              <Input_Password value={newPw2} onChange={(e) => setNewPw2(e.target.value)}></Input_Password>
            </DataEntry_fong>
          </div>

          {/* <Input_pw
            value={oldPw}
            onChange={setOldPw}
            label="舊密碼"
            inputType="auto"
            captionWidth="100px"
            firstGap="40px"
          />
          <Input_pw
            value={newPw}
            onChange={setNewPw}
            label="新密碼"
            inputType="auto"
            captionWidth="100px"
            firstGap="40px"
          />
          <Input_pw
            value={newPw2}
            onChange={setNewPw2}
            label="確認新密碼"
            inputType="auto"
            captionWidth="100px"
            firstGap="40px"
          /> */}
        </form>

        {/* <Button loading={isLoading} className={scss.confirmBtn} onClick={theOnConfirm}>
          確認
        </Button> */}
        <div className={`${scss.mobileBtn} flex mt-10 gap-4 justify-end`}>
          <Btn onClick={onCancel}>返回</Btn>
          <Btn theme="send" onClick={theOnConfirm}>
            送出
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

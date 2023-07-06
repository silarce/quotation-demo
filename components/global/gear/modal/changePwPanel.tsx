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

type TpwPostBody = {
  oldPassword: string;
  newPassword: string;
};

export default function ChangePwPanel({ visible, onCancel }: { visible: boolean; onCancel: () => void }) {
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
      className={scss.antdModalChangePw}
      visible={visible}
      closable={false}
      centered={true}
      maskClosable={true}
      footer={null}
      onCancel={theOnCancel}
      destroyOnClose={true}
      afterClose={theOnCancel}
    >
      <div className={scss.header}>
        <div>
          <span>變更密碼</span>
        </div>
      </div>

      <div className={scss.body}>
        <form className={scss.inputContainer} onSubmit={(e) => e.preventDefault}>
          {/* 為了讓瀏覽器不要在控制台跳警告 */}
          <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} />
          <Input_pw
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
          />
        </form>

        <Button loading={isLoading} className={scss.confirmBtn} onClick={theOnConfirm}>
          確認
        </Button>
      </div>
    </Modal>
  );
}

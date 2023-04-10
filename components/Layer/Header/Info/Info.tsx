import { useState, useContext } from "react"

// antd
import { Modal } from 'antd';

// gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";

// img
import avatar from "public/image/avatar.png"
// icon
import logout from "public/image/icon/logout.svg"

// api
import { apiAuthPassword } from "js/api/api_auth";

// css
import scss from "./info.module.scss"


// ctx
import { LayerCtx } from "components/Layer/Layer"


export default function Info() {
  const { reqLogout } = useContext(LayerCtx)
  const [showPwModal, setShowPwModal] = useState(false)


  // ----------------------------------------------
  const openPwModal = () => {
    setShowPwModal(true)
  }
  const onConfirm = async (postBody: TpwPostBody) => {
    try {
      const res = await apiAuthPassword(postBody)
      setShowPwModal(false)
      myAlert.success({ title: "變更密碼成功" })
    }
    catch (error) {
      myAlert.err({ title: "變更密碼失敗" })
    }
  }
  const onCancel = () => {
    setShowPwModal(false)
  }
  // ----------------------------------------------



  return (
    <div className={scss.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar.src} alt="頭像" className={scss.avatar}
      />

      <div className={scss.name}>
        <p>管理部</p>
        <p>王小明</p>
      </div>

      <div className={scss.changePw} onClick={openPwModal}>
        <span>變更密碼</span>
      </div>

      <div className={scss.line} />

      <div className={scss.logout}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logout.src} alt="登出"
        />
        <span onClick={reqLogout}>登出</span>
      </div>

      <ModalChangePw
        visible={showPwModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

    </div>
  )
}

// ===================================

type TpwPostBody = {
  oldPassword: string
  newPassword: string
}

const ModalChangePw = (
  { visible, onConfirm, onCancel }:
    {
      visible: boolean
      onConfirm: (posBody: TpwPostBody) => void
      onCancel: () => void
    }
) => {

  const [oldPw, setOldPw] = useState<string>()
  const [newPw, setNewPw] = useState<string>()

  const theOnConfirm = () => {
    if (!oldPw || !newPw) return;
    onConfirm({
      oldPassword: oldPw,
      newPassword: newPw,
    })
  }

  const theOnCancel = () => {
    setOldPw(undefined)
    setNewPw(undefined)
    onCancel()
  }

  return (
    <Modal
      className={scss.antdModalChangePw}
      visible={visible}
      closable={false}
      centered={true}
      maskClosable={true}
      footer={null}
      onCancel={theOnCancel}
    >

      <div className={scss.inputContainer}>
        <label>
          <span>舊密碼</span>
          <input type="password"
            value={oldPw}
            placeholder="請輸入舊密碼"
            onChange={(e) => setOldPw(e.target.value)}
          />
        </label>

        <label className={scss.pwGroup}>
          <span>新密碼</span>
          <input type="password"
            value={newPw}
            placeholder="請輸入新密碼"
            onChange={(e) => setNewPw(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-5">
        <TwoBtnFooter
          onConfirm={theOnConfirm}
          onCancel={theOnCancel} />
      </div>

    </Modal>
  )
}





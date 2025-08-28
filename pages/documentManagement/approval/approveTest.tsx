import { useMessageReceiver } from 'hooks/globalState/useWindowMessage';

export default function ApproveTest() {
  const { message } = useMessageReceiver<string>({ channel: 'approve' });

  return (
    <div>
      <div>嵌入Iframe測試</div>
      <br />
      <div>MESSAGE:</div>
      <div>{message}</div>
    </div>
  );
}

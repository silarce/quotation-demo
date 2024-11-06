import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

interface Tprofile {
  serial_number: React.ReactNode;
  支出單號進貨收票單號: React.ReactNode;
  agentName: React.ReactNode;
}

const Profile = ({ serial_number, 支出單號進貨收票單號, agentName }: Tprofile) => {
  return (
    <div className="global_grid01">
      <InputSel showBaseline="invisible" caption="應付帳款單號" node={serial_number} />
      <InputSel showBaseline="invisible" caption="支出單號/進貨收票單號" node={支出單號進貨收票單號} />
      <InputSel showBaseline="invisible" caption="經辦人員" node={agentName} />
    </div>
  );
};

export default Profile;

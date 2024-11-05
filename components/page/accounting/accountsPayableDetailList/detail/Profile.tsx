import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

const Profile = () => {
  return (
    <div className="global_grid01">
      <InputSel showBaseline="always" caption="應付帳款單號" />
      <InputSel showBaseline="always" caption="支出單號/進會收票單號" />
      <InputSel showBaseline="always" caption="經辦人員" />
    </div>
  );
};

export default Profile;

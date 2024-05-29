import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// region START
export default function Collection() {
  const tagList: TtagList = [
    {
      label: '匯款',
    },
    {
      label: '票據',
    },
    {
      label: '現金',
    },
  ];

  return (
    <SubLayer>
      <PageHeader02
        // tag="收款管理"
        tagList={tagList}
      />
      <div></div>
    </SubLayer>
  );
}
// region END

// =============================================================================

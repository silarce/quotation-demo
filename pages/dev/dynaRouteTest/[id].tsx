import { useRouter } from 'next/router';

export default function DynaRouteTest() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      DynaRouteTest
      <br />
      {id}
    </div>
  );
}

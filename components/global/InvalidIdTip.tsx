import Link from "next/link"

export default function InvalidIdTip(
  { text }:
    { text?: string }
) {

  return (
    <div className="text-center mt-10">
      <span className=" text-6xl">{text ?? "無效ID"}</span>
      <br />
      <Link href="/home" className="inline-block text-2xl mt-5 ">點此返回首頁</Link>
    </div>
  )
}


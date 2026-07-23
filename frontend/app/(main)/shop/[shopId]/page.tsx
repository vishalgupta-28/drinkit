import { ComingSoon } from "@/components/shared/ComingSoon";
export default function Page({ params }: { params: { shopId: string } }) {
  return <ComingSoon title={`Shop ${params.shopId}`} emoji="🏪" note="List this shop's zone-priced catalog." />;
}

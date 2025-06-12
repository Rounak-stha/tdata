import { SearchPage as _SearchPage } from "@/components/pages/search";

type SearchPageProps = {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{ orgKey: string }>;
};

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const awaitedParams = await searchParams;
  const { orgKey } = await params;

  return <_SearchPage searchParams={awaitedParams} orgKey={orgKey} />;
}

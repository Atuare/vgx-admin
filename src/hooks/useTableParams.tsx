import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useTableParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function setParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (!value) params.delete(key);
    router.replace(`${pathname}?${params}`);
  }

  return { setParams };
}

import { BrandStatement } from "@/components/brand-statement";
import { ProductsSection } from "@/components/products-section";
import { Showcase } from "@/components/showcase";
import { getJars } from "@/lib/jars";

export default async function Home() {
  const jars = await getJars();
  return (
    <>
      <Showcase jars={jars} />
      <ProductsSection />
      <BrandStatement />
    </>
  );
}

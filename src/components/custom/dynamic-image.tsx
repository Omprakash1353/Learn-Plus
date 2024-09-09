import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";

import { cn } from "@/lib/utils";

export async function getImage(src: string) {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
}

export default async function DynamicImage({
  src,
  ...props
}: any) {
  const { base64, img } = await getImage(src);

  return (
    <div className={cn("relative")}>
      <Image
        src={img}
        {...props}
        placeholder="blur"
        blurDataURL={base64}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

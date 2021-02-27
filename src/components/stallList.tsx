import Link from "next/link";
import { Image } from "cloudinary-react";
import { StallsQuery_stalls } from "src/generated/StallsQuery";

export {};
interface IProps {
  stalls: StallsQuery_stalls[];
  setHighlightedId: (id: string | null) => void;
}
//TODO make highlighting work in both directions
export default function StallList({ stalls, setHighlightedId }: IProps) {
  return (
    <>
      {stalls.map((stall) => (
        <Link key={stall.id} href={`/stalls/${stall.id}`}>
          <div
            className="px-6 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => setHighlightedId(stall.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={stall.publicId}
                alt={stall.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{stall.address}</h2>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

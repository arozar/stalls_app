import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import StallNav from "src/components/stallNav";
import SingleMap from "src/components/singleMap";
import {
  ShowStallQuery,
  ShowStallQueryVariables,
} from "src/generated/ShowStallQuery";

const SHOW_STALL_QUERY = gql`
  query ShowStallQuery($id: String!) {
    stall(id: $id) {
      id
      userId
      address
      publicId
      latitude
      longitude
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function ShowStall() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <StallData id={id as string} />;
}

function StallData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowStallQuery, ShowStallQueryVariables>(
    SHOW_STALL_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.stall)
    return <Layout main={<div>Unable to load stall {id}</div>} />;

  const { stall } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <StallNav stall={stall} />
            <h1 className="text-3xl my-2">{stall.address}</h1>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={stall.publicId}
              alt={stall.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />
          </div>
          <SingleMap stall={stall} nearby={stall.nearby} />
        </div>
      }
    />
  );
}

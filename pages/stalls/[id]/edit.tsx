import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import StallForm from "src/components/stallForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditStallQuery,
  EditStallQueryVariables,
} from "src/generated/EditStallQuery";

const EDIT_STALL_QUERY = gql`
  query EditStallQuery($id: String!) {
    stall(id: $id) {
      id
      userId
      address
      image
      publicId
      latitude
      longitude
    }
  }
`;

export default function EditStall() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <StallData id={id as string} />;
}

function StallData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<EditStallQuery, EditStallQueryVariables>(
    EDIT_STALL_QUERY,
    { variables: { id } }
  );

  if (!user) return <Layout main={<div>Please login</div>} />;
  if (loading) return <Layout main={<div>loading...</div>} />;
  if (data && !data.stall)
    return <Layout main={<div>Unable to load stall</div>} />;
  if (user.uid !== data?.stall?.userId)
    return <Layout main={<div>You don't have permission</div>} />;

  return <Layout main={<StallForm stall={data.stall} />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};

import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteStall, DeleteStallVariables } from "src/generated/DeleteStall";

const DELETE_MUTATION = gql`
  mutation DeleteStall($id: String!) {
    deleteStall(id: $id)
  }
`;

interface IProps {
  stall: {
    id: string;
    userId: string;
  };
}

export default function StallNav({ stall }: IProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = !!user && user.uid === stall.userId;
  const [deleteStall, { loading }] = useMutation<
    DeleteStall,
    DeleteStallVariables
  >(DELETE_MUTATION);

  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/stalls/${stall.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteStall({ variables: { id: stall.id } });
                router.push("/");
              }
            }}
          >
            delete
          </button>
        </>
      )}
    </>
  );
}

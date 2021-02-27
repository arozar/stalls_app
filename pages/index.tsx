import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import StallList from "src/components/stallList";
import { usePrevIsFalsey } from "src/utils/usePrevIfFalsey";
import { useLocalState } from "src/utils/useLocalState";
import { StallsQuery, StallsQueryVariables } from "src/generated/StallsQuery";

const STALLS_QUERY = gql`
  query StallsQuery($bounds: BoundsInput!) {
    stalls(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Home() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]" //Will default to whatever the initial state of the map is
  );
  //TODO - doc example of hooks
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery<StallsQuery, StallsQueryVariables>(
    STALLS_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );
  //TODO doc example Refs in React
  const lastData = usePrevIsFalsey(data);

  if (error) return <Layout main={<div>Error loading stalls</div>} />;
  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            <StallList
              stalls={lastData ? lastData.stalls : []}
              setHighlightedId={setHighlightedId}
            />
          </div>
          <div className="w-1/2">
            <Map
              setDataBounds={setDataBounds}
              stalls={lastData ? lastData.stalls : []}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      }
    />
  );
}

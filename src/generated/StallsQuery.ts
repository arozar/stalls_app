/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: StallsQuery
// ====================================================

export interface StallsQuery_stalls {
  __typename: "Stall";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
}

export interface StallsQuery {
  stalls: StallsQuery_stalls[];
}

export interface StallsQueryVariables {
  bounds: BoundsInput;
}

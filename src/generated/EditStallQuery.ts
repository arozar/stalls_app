/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditStallQuery
// ====================================================

export interface EditStallQuery_stall {
  __typename: "Stall";
  id: string;
  userId: string;
  address: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
}

export interface EditStallQuery {
  stall: EditStallQuery_stall | null;
}

export interface EditStallQueryVariables {
  id: string;
}

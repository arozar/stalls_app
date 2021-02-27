/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowStallQuery
// ====================================================

export interface ShowStallQuery_stall_nearby {
  __typename: "Stall";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowStallQuery_stall {
  __typename: "Stall";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  latitude: number;
  longitude: number;
  nearby: ShowStallQuery_stall_nearby[];
}

export interface ShowStallQuery {
  stall: ShowStallQuery_stall | null;
}

export interface ShowStallQueryVariables {
  id: string;
}

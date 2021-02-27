/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StallInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateStallMutation
// ====================================================

export interface UpdateStallMutation_updateStall {
  __typename: "Stall";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface UpdateStallMutation {
  updateStall: UpdateStallMutation_updateStall | null;
}

export interface UpdateStallMutationVariables {
  id: string;
  input: StallInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StallInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateStallMutation
// ====================================================

export interface CreateStallMutation_createStall {
  __typename: "Stall";
  id: string;
}

export interface CreateStallMutation {
  createStall: CreateStallMutation_createStall | null;
}

export interface CreateStallMutationVariables {
  input: StallInput;
}

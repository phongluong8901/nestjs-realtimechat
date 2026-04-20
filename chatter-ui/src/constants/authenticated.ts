import { makeVar } from "@apollo/client";

export const authenticatedVar = makeVar<boolean>(false);

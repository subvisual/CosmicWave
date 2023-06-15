import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";

import { getStreamerPrivateKey } from "./config";

export function getPolybaseConnection(namespace?: string) {
  let configOpts: ConstructorParameters<typeof Polybase>[0] = {
    signer: (data) => {
      return {
        h: "eth-personal-sign",
        sig: ethPersonalSign(getStreamerPrivateKey(), data),
      };
    },
  };

  if (namespace) {
    configOpts = {
      ...configOpts,
      defaultNamespace: namespace,
    };
  }

  return new Polybase(configOpts);
}

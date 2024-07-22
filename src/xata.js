import { buildClient } from "@xata.io/client";

/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [
  {
    name: "requests",
    columns: [
      { name: "applicant", type: "json" },
      { name: "contact", type: "string" },
      { name: "reason", type: "string" },
      { name: "time", type: "string" },
      { name: "isApproved", type: "bool" },
      { name: "status", type: "string" },
    ],
  },
  {
    name: "password",
    columns: [
      { name: "name", type: "string" },
      { name: "value", type: "string" },
    ],
  },
];

/** @type { import('@xata.io/client').ClientConstructor<{}> } */
const DatabaseClient = buildClient();
const defaultOptions = {
  databaseURL:
    "https://pr-citrate-s-workspace-piheva.ap-southeast-2.xata.sh/db/sunja-approve",
};

/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
export class XataClient extends DatabaseClient {
  constructor(options) {
    const apiKey = process.env.NEXT_PUBLIC_XATA_API_KEY;
    const branch = process.env.NEXT_PUBLIC_XATA_BRANCH || 'main';

    if (!apiKey) {
      throw new Error('Xata API key is not defined');
    }

    super({ ...defaultOptions, ...options, apiKey, branch }, tables);
  }
}

let instance = undefined;

/** @type { () => XataClient } */
export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};

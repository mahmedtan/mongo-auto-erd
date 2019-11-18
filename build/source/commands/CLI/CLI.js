#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports no-var-requires
require('module-alias/register');
const getERD_1 = require("@commands/getERD");
const yargs = require("yargs");
(async () => {
    const argv = yargs.options({
        db: { type: 'string', demandOption: true },
        outfile: { type: 'string', demandOption: true },
        uri: { type: 'string', demandOption: true }
    }).argv;
    await getERD_1.getERD(argv.uri, argv.db);
})();
//# sourceMappingURL=CLI.js.map
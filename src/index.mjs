#!/usr/bin/env node
import { rewind } from '@turf/turf';
import * as topojson from "topojson-client"
import yargs from 'yargs';
import { readFileSync, writeFileSync } from 'node:fs';

const version = JSON.parse(readFileSync('package.json', 'utf-8')).version;

const args = yargs(process.argv.slice(2))
    .usage('This is my awesome program\n\nUsage: $0 [options]')
    .help('help').alias('help', 'h')
    .version('version', version).alias('version', 'v')
    .options({
        input: {
            alias: 'i',
            description: "<i> String of GeoJSON or TopoJSON to reverse",
            required: true,
            requiresArg: true,
            type: 'string'
        },
        output: {
            alias: 'o',
            description: "<o> Output file. If not supplied, will print to stdout",
            type: 'string'
        },
    })
    .parse();

let json = JSON.parse(args.input);

if (json.type === "Topology") {
    json = topojson.feature(json, json.objects[property]);
}

json.features = json.features.map(feature =>
    rewind(feature, { reverse: true })
);

const output = JSON.stringify(json);

if (args.output) {
    const filename = args.output.split('.').length > 1 ? args.output : `${args.output}.geojson`;

    writeFileSync(filename, output);
} else {
    console.log(output);
}
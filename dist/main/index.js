"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromDirectory = exports.convertSchema = void 0;
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
const convertFilesInDirectory_1 = require("./convertFilesInDirectory");
const writeInterfaceFile_1 = require("./writeInterfaceFile");
const analyseSchemaFile_1 = require("./analyseSchemaFile");
const write_1 = require("./write");
/**
 * Apply defaults to the Partial Settings parameter
 *
 * @param settings Partial Setting object
 * @returns Complete Settings object
 */
function defaultSettings(settings) {
    const appSettings = Object.assign({
        useLabelAsInterfaceName: false,
        defaultToRequired: false,
        schemaFileSuffix: 'Schema',
        interfaceFileSuffix: '',
        debug: false,
        fileHeader: `/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */`,
        sortPropertiesByName: true,
        commentEverything: false,
        ignoreFiles: [],
        indentationChacters: '  ',
        honorCastTo: [],
        treatDefaultedOptionalAsRequired: false,
        supplyDefaultsInType: false,
        inputFileFilter: types_1.InputFileFilter.Default,
        omitIndexFiles: false,
    }, settings);
    return appSettings;
}
function convertSchema(settings, joi, exportedName, root) {
    const appSettings = defaultSettings(settings);
    return (0, analyseSchemaFile_1.convertSchemaInternal)(appSettings, joi, exportedName, root);
}
exports.convertSchema = convertSchema;
/**
 * Create types from schemas from a directory
 *
 * @param settings - Configuration settings
 * @returns The success or failure of this operation
 */
async function convertFromDirectory(settings) {
    const appSettings = defaultSettings(settings);
    const filesInDirectory = await (0, convertFilesInDirectory_1.convertFilesInDirectory)(appSettings, path_1.default.resolve(appSettings.typeOutputDirectory));
    if (!filesInDirectory.types || filesInDirectory.types.length === 0) {
        throw new Error('No schemas found, cannot generate interfaces');
    }
    // TODO: remove fields from derived interfaces here
    for (const exportType of filesInDirectory.types) {
        (0, writeInterfaceFile_1.writeInterfaceFile)(appSettings, exportType.typeFileName, filesInDirectory.types);
    }
    if (appSettings.indexAllToRoot || appSettings.flattenTree) {
        // Write index.ts
        (0, write_1.writeIndexFile)(appSettings, filesInDirectory.typeFileNames);
    }
    return true;
}
exports.convertFromDirectory = convertFromDirectory;

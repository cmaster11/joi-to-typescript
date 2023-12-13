// Functions for converting properties to strings and to file system
// TODO: Move all code here
import { writeFileSync } from 'fs';
import Path from 'path';
/**
 * Write index.ts file
 *
 * @param settings - Settings Object
 * @param fileNamesToExport - List of file names that will be added to the index.ts file
 */
export function writeIndexFile(settings, fileNamesToExport) {
    if (fileNamesToExport.length === 0) {
        // Don't write an index file if its going to export nothing
        return;
    }
    const exportLines = fileNamesToExport.map(fileName => `export * from './${fileName.replace(/\\/g, '/')}';`);
    const fileContent = `${settings.fileHeader}\n\n${exportLines.join('\n').concat('\n')}`;
    writeFileSync(Path.join(settings.typeOutputDirectory, 'index.ts'), fileContent);
}
export function getTypeFileNameFromSchema(schemaFileName, settings) {
    return ((schemaFileName.endsWith(`${settings.schemaFileSuffix}.ts`)
        ? schemaFileName.substring(0, schemaFileName.length - `${settings.schemaFileSuffix}.ts`.length)
        : schemaFileName.replace('.ts', '')) + settings.interfaceFileSuffix);
}
/**
 * Get all indent characters for this indent level
 * @param settings includes what the indent characters are
 * @param indentLevel how many indent levels
 */
export function getIndentStr(settings, indentLevel) {
    return settings.indentationChacters.repeat(indentLevel);
}
/**
 * Get Interface jsDoc
 */
export function getJsDocString(settings, name, jsDoc, indentLevel = 0) {
    var _a, _b, _c, _d, _e;
    if ((jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.disable) == true) {
        return '';
    }
    if (!settings.commentEverything && !(jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.description) && ((_b = (_a = jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.examples) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) == 0) {
        return '';
    }
    const lines = [];
    if (settings.commentEverything || (jsDoc && jsDoc.description)) {
        let description = name;
        if (jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.description) {
            description = jsDoc.description.trim();
        }
        lines.push(...description.split('\n').map(line => ` * ${line}`.trimEnd()));
    }
    // Add a JsDoc divider if needed
    if (((_d = (_c = jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.examples) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0 && lines.length > 0) {
        lines.push(' *');
    }
    for (const example of (_e = jsDoc === null || jsDoc === void 0 ? void 0 : jsDoc.examples) !== null && _e !== void 0 ? _e : []) {
        const trimmed = example.trim();
        if (trimmed.includes('\n')) {
            lines.push(` * @example`);
            lines.push(...trimmed.split('\n').map(line => ` * ${line}`.trimEnd()));
        }
        else {
            lines.push(` * @example ${trimmed}`);
        }
    }
    // Add JsDoc boundaries
    lines.unshift('/**');
    lines.push(' */');
    return lines.map(line => `${getIndentStr(settings, indentLevel)}${line}`).join('\n') + '\n';
}

import {existsSync, readFileSync, rmdirSync} from 'fs';

import {convertFromDirectory} from '../../index';

const typeOutputDirectory = './src/__tests__/dts/interfaces';

describe('Create interfaces from schema files as d.ts files', () => {
  beforeAll(() => {
    if (existsSync(typeOutputDirectory)) {
      rmdirSync(typeOutputDirectory, {recursive: true});
    }
  });

  test('generates interfaces as d.ts files', async () => {
    const result = await convertFromDirectory({
      schemaDirectory: './src/__tests__/dts/schemas',
      generateDTS: true,
      typeOutputDirectory
    });

    expect(result)
      .toBe(true);

    expect(existsSync(`${typeOutputDirectory}/One.d.ts`))
      .toBe(true)
    expect(readFileSync(`${typeOutputDirectory}/One.d.ts`, 'utf8'))
      .not
      .toContain('export')

    expect(existsSync(`${typeOutputDirectory}/FooBar.d.ts`))
      .toBe(true)
    expect(readFileSync(`${typeOutputDirectory}/FooBar.d.ts`, 'utf8'))
      .not
      .toContain('export')

    expect(existsSync(`${typeOutputDirectory}/RawType.d.ts`))
      .toBe(true)
    expect(readFileSync(`${typeOutputDirectory}/RawType.d.ts`, 'utf8'))
      .not
      .toContain('export')

    expect(existsSync(`${typeOutputDirectory}/index.ts`))
      .toBe(false)
  });
});

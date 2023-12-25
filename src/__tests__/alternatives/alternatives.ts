import { existsSync, readFileSync, rmdirSync } from 'fs';
import Joi from 'joi';

import { convertFromDirectory, convertSchema } from '../../index';

describe('alternative types', () => {
  const typeOutputDirectory = './src/__tests__/alternatives/interfaces';

  beforeAll(() => {
    if (existsSync(typeOutputDirectory)) {
      rmdirSync(typeOutputDirectory, { recursive: true });
    }
  });

  test('vaiations of alternatives from file', async () => {
    const result = await convertFromDirectory({
      schemaDirectory: './src/__tests__/alternatives/schemas',
      typeOutputDirectory,
      sortPropertiesByName: false
    });

    expect(result).toBe(true);

    const oneContent = readFileSync(`${typeOutputDirectory}/One.ts`).toString();
    expect(oneContent).toBe(
      `/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface AlternativesObjectNoDesc {
  myVal?: number | string;
}

export type AlternativesRawNoDesc = number | string;

export type AlternativesWithFunctionInterface = ((...args: any[]) => any) | {
    json: any;
  } | {
    raw: string;
  };

/**
 * a description for basic
 */
export type Basic = number | string;

export interface Other {
  other?: string;
}

export interface SomeSchema {
  label?: string;
  someId?: any;
}

/**
 * a test schema definition
 */
export interface Test {
  name?: string;
  value?: Thing | Other;
  /**
   * a description for basic
   */
  basic?: Basic;
}

/**
 * A list of Test object
 */
export type TestList = (boolean | string)[];

export interface Thing {
  thing: string;
}
`
    );
  });

  test('blank alternative throws in joi', () => {
    expect(() => {
      Joi.alternatives().try().meta({ className: 'Basic' }).description('a description for basic');
    }).toThrow();
  });

  test('allowed value in alternatives', () => {
    const schema = Joi.alternatives(Joi.string(), Joi.number())
      .allow(null)
      .meta({ className: 'Test' })
      .description('Test allowed values in alternatives');

    const result = convertSchema({}, schema);
    expect(result).not.toBeUndefined();
    expect(result?.content).toBe(`/**
 * Test allowed values in alternatives
 */
export type Test = string | number | null;`);
  });

  test.skip('blank alternative thrown by joi but extra test if joi changes it', () => {
    expect(() => {
      const invalidSchema = Joi.alternatives()
        .try()
        .meta({ className: 'Basic' })
        .description('a description for basic');

      // the next code will not run as already thrown
      convertSchema({}, invalidSchema);
    }).toThrow();
  });
});

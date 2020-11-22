import { convertFromDirectory } from '../index';
import { readFileSync } from 'fs';

test('02.fromFiles', async () => {
  const TypeOutputDirectory = './src/__tests__/02/models';
  const result = await convertFromDirectory({
    schemaDirectory: './src/__tests__/02/schemas',
    TypeOutputDirectory
  });

  expect(result).toBe(true);

  const indexContent = readFileSync(`${TypeOutputDirectory}/index.ts`).toString();

  expect(indexContent).toBe(
    `/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export * from './FooBar';
export * from './One';
export * from './Readme';
`
  );
  const oneContent = readFileSync(`${TypeOutputDirectory}/One.ts`).toString();

  expect(oneContent).toBe(
    `/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

/**
 * a test schema definition
 */
export interface TestSchema {
  /**
   * name
   */
  name?: string;
  /**
   * propertyName1
   */
  propertyName1: boolean;
}
`
  );

  const fooBarContent = readFileSync(`${TypeOutputDirectory}/FooBar.ts`).toString();

  expect(fooBarContent).toBe(`/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

/**
 * Bar
 */
export interface Bar {
  /**
   * Id
   */
  id: number;
}

/**
 * Foo
 */
export interface Foo {
  /**
   * Bar
   */
  bar: Bar;
  /**
   * Id
   */
  id: number;
}
`);

  const readmeContent = readFileSync(`${TypeOutputDirectory}/Readme.ts`).toString();

  expect(readmeContent).toBe(`/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

/**
 * Job
 */
export interface Job {
  /**
   * businessName
   */
  businessName: string;
  /**
   * jobTitle
   */
  jobTitle: string;
}

/**
 * A list of People
 */
export type People = Person[];

/**
 * Person
 */
export interface Person {
  /**
   * firstName
   */
  firstName: string;
  /**
   * job
   */
  job?: Job;
  /**
   * Last Name
   */
  lastName: string;
}
`);
});

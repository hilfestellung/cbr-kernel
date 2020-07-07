import { ModelClass } from 'model';

export function findClass(
  classes: ModelClass<any>[],
  id: string
): ModelClass<any> {
  return (classes.find((clazz) => clazz.id === id) as unknown) as ModelClass<
    any
  >;
}

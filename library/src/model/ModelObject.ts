import { ModelElement } from './ModelElement';

export abstract class ModelObject<T> extends ModelElement {
  get native(): T {
    return this.id;
  }

  constructor(public id: T) {
    super();
  }

  abstract nativeToString(): string;

  equals(other: ModelObject<any>): boolean {
    if (other == null) {
      return false;
    } else if (this === other) {
      return true;
    }
    if (this.isDate() && other.isDate()) {
      return (
        ((this.native as unknown) as Date).getTime() ===
        (other.native as Date).getTime()
      );
    }
    return this.native === other.native;
  }

  toJSON(_key?: string): any {
    return { id: this.id, properties: this.properties };
  }

  toString(): string {
    let languages: string[];
    let labels: string[] | null = null;
    if (
      this.properties &&
      (languages = Object.keys(this.properties)).length > 0
    ) {
      labels = languages
        .filter((lang) => !!this.properties[lang].label)
        .map((lang) => lang + "=>'" + this.properties[lang].label + "'");
    }
    return (
      '<' +
      this.nativeToString() +
      (labels != null ? '(' + labels.join(', ') + ')' : '') +
      '>'
    );
  }
}

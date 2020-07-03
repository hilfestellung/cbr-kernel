export abstract class ModelElement {
  properties: { [language: string]: any };
  abstract get id(): any;

  getLabel(language: string): string {
    return (
      (this.properties &&
        this.properties[language] &&
        this.properties[language].label) ||
      this.id
    );
  }

  getProperty(language: string, key: string): string {
    return (
      (this.properties &&
        this.properties[language] &&
        this.properties[language][key]) ||
      null
    );
  }

  isAggregate(): boolean {
    return false;
  }
  isSet(): boolean {
    return false;
  }
  isString(): boolean {
    return false;
  }
  isInteger(): boolean {
    return false;
  }
  isFloat(): boolean {
    return false;
  }
  isDate(): boolean {
    return false;
  }

  abstract toJSON(key?: string): any;
}

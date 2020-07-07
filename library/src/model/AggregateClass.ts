import { ModelClass } from './ModelClass';
import { ModelObject } from './ModelObject';
import { AggregateObject } from './AggregateObject';
import { Attribute } from './Attribute';
import { v4 } from 'uuid';

export class AggregateClass extends ModelClass<any> {
  private attributeMap: any = {};
  constructor(public id: string, public attributes: Attribute[]) {
    super(id);
    attributes.forEach(
      (attribute) => (this.attributeMap[attribute.id] = attribute)
    );
  }

  isAggregate(): boolean {
    return true;
  }

  createObject(value: any): ModelObject<any> {
    const aggregate = {};
    const id: string = value._id || v4();
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        const attribute = this.attributeMap[entry.id];
        if (attribute != null) {
          aggregate[entry.id] = attribute.modelClass.readObject(entry.value);
        }
      });
    } else {
      this.attributes.forEach((attribute) => {
        if (value[attribute.id] != null) {
          aggregate[attribute.id] = attribute.modelClass.readObject(
            value[attribute.id]
          );
        }
      });
    }
    return new AggregateObject(id, aggregate);
  }

  getAttribute(id: string): Attribute | undefined {
    return this.attributes.find((attribute) => attribute.id === id);
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.attributes = this.attributes;
    return result;
  }
}

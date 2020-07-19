import { ModelObject } from './ModelObject';
import { ModelClass } from './ModelClass';

export class Attribute extends ModelObject<string> {
  private typeIdHolder: string;
  private modelClassHolder: ModelClass<any>;

  constructor(public id: string, type?: string | ModelClass<any>) {
    super(id);
    if (type instanceof ModelClass) {
      this.modelClass = type;
    } else if (typeof type === 'string') {
      this.typeId = type;
    }
  }

  get typeId(): string {
    return this.typeIdHolder;
  }

  set typeId(typeId: string) {
    this.typeIdHolder = typeId;
  }

  get modelClass(): ModelClass<any> {
    return this.modelClassHolder;
  }

  set modelClass(modelClass: ModelClass<any>) {
    this.modelClassHolder = modelClass;
    this.typeId = modelClass.id;
  }

  nativeToString(): string {
    return this.id;
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.type = this.modelClass != null ? this.modelClass.id : this.typeId;
    return result;
  }
}

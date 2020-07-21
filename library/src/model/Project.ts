import { ModelObject } from './ModelObject';
import { AggregateClass } from './AggregateClass';

export class Project extends ModelObject<string> {
  private queryClassHolder: AggregateClass;
  public languages: string[] = [];
  public queryClassId: string | null;

  constructor(id: string, properties?: any) {
    super(id, properties);
  }

  get queryClass(): AggregateClass {
    return this.queryClassHolder;
  }

  set queryClass(value: AggregateClass) {
    if (value != null) {
      this.queryClassId = value.id;
      this.queryClass = value;
    } else {
      this.queryClassId = null;
      this.queryClass = value;
    }
  }

  nativeToString(): string {
    return this.id;
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.languages = this.languages;
    result.queryClass =
      this.queryClassId != null ? this.queryClassId : undefined;
    return result;
  }
}

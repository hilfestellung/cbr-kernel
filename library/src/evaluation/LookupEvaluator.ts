import { SimilarityEvaluator } from './SimilarityEvaluator';
import { ModelObject } from '../model';
import { Similarity } from './Similarity';

function makeSymmetric(lookup: LookupTable): LookupTable {
  const result = {};
  Object.keys(lookup).forEach((sourceKey) => {
    const target = Object.keys(lookup[sourceKey]);
    target.forEach((targetKey) => {
      if (!result[targetKey]) {
        result[targetKey] = {};
      }
      if (!result[sourceKey]) {
        result[sourceKey] = {};
      }
      result[targetKey][sourceKey] = lookup[sourceKey][targetKey];
      result[sourceKey][targetKey] = lookup[sourceKey][targetKey];
    });
  });
  return result;
}

export enum LookupMode {
  Symmetric,
  Asymmetric,
}

export interface LookupTable {
  [source: string]: { [destination: string]: number };
}

export class LookupEvaluator extends SimilarityEvaluator<any> {
  private lookupOrigin: LookupTable;
  private lookupHolder: LookupTable;
  private modeHolder: LookupMode;

  constructor(
    id: string,
    typeId: string,
    mode?: LookupMode | string,
    lookup?: LookupTable
  ) {
    super(id, typeId);
    if (lookup == null) {
      lookup = {};
    }
    if (mode == null) {
      mode = LookupMode.Asymmetric;
    }
    this.setLookup(lookup, LookupMode[mode]);
  }

  get pattern(): string {
    return 'lookup';
  }

  get mode() {
    return this.modeHolder;
  }

  get lookup(): LookupTable {
    return this.lookupHolder;
  }

  setLookup(lookup: LookupTable, mode: LookupMode) {
    this.lookupOrigin = lookup;
    this.modeHolder = mode;
    if (this.modeHolder === LookupMode.Symmetric) {
      this.lookupHolder = makeSymmetric(lookup);
    } else {
      this.lookupHolder = lookup;
    }
  }

  evaluate(
    queryObject: ModelObject<any>,
    caseObject: ModelObject<any>
  ): Similarity {
    if (
      queryObject == null ||
      caseObject == null ||
      queryObject.native == null ||
      caseObject.native == null
    ) {
      return new Similarity(0, queryObject, caseObject);
    }
    if (queryObject.native === caseObject.native) {
      return new Similarity(1, queryObject, caseObject);
    }
    const sourceLookup = this.lookupHolder[queryObject.native];
    const value = sourceLookup && sourceLookup[caseObject.native];
    return value != null
      ? new Similarity(value, queryObject, caseObject)
      : new Similarity(0, queryObject, caseObject);
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.mode = LookupMode[this.mode];
    result.lookup = this.lookupOrigin;
    return result;
  }
}

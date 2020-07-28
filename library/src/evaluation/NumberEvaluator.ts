import { Similarity } from './Similarity';
import { SimilarityEvaluator } from './SimilarityEvaluator';
import { ModelObject } from '../model/ModelObject';

function toNumber(input: number | Date, defaultValue: number = 0): number {
  if (input instanceof Date) {
    return input.getTime();
  }
  if (input == null || isNaN(input)) {
    return defaultValue;
  }
  return input;
}

function getDistance(
  v1: number,
  v2: number,
  maxDistance: number,
  cyclic: boolean
): number {
  let result = Math.abs(v2 - v1);
  if (cyclic && result > maxDistance) {
    result = 2 * maxDistance - result;
  }
  return result;
}

function getMaxDistance(
  v: number,
  maxDistance: number,
  origin: number,
  useOrigin: boolean
): number {
  if (useOrigin) {
    return Math.abs(v - origin);
  }
  return maxDistance;
}

function isLess(
  v1: number,
  v2: number,
  maxDistance: number,
  cyclic: boolean
): boolean {
  const less = v1 < v2;
  if (cyclic) {
    let leftDistance: number;
    let rightDistance: number;
    if (less) {
      leftDistance = v2 - v1;
    } else {
      leftDistance = 2 * maxDistance - v1 + v2;
    }
    rightDistance = 2 * maxDistance - leftDistance;
    return leftDistance < rightDistance;
  }
  return less;
}

function computePolynom(input: number, linearity: number): number {
  if (linearity === 1) {
    return 1 - input;
  } else if (linearity === 0) {
    return 0;
  } else {
    return Math.pow(1 - input, 1 / linearity);
  }
}

function computeRoot(input: number, linearity: number): number {
  if (linearity === 1) {
    return 1 - input;
  } else if (linearity === 0) {
    return 1;
  } else {
    return Math.pow(1 - input, linearity);
  }
}

function computeSigmoid(input: number, linearity: number): number {
  if (linearity === 1) {
    return 1 - input;
  } else {
    if (input < 0.5) {
      if (linearity === 0) {
        return 1;
      } else {
        return 1 - Math.pow(2 * input, 1 / linearity) / 2;
      }
    } else {
      if (linearity === 0) {
        return 0;
      } else {
        return Math.pow(2 - 2 * input, 1 / linearity) / 2;
      }
    }
  }
}

export enum NumberInterpolation {
  Polynom,
  Sigmoid,
  Root,
}

function getInterpolation(
  interpolation: NumberInterpolation
): (input: number, linearity: number) => number {
  switch (interpolation) {
    case NumberInterpolation.Polynom:
      return computePolynom;
    case NumberInterpolation.Sigmoid:
      return computeSigmoid;
    case NumberInterpolation.Root:
      return computeRoot;
    default:
      throw new Error(
        '"' + interpolation + '" is not a valid interpolation function.'
      );
  }
}

export interface NumberEvaluatorOptions {
  cyclic: boolean;
  origin: number;
  useOrigin: boolean;

  equalIfLess: number;
  toleranceIfLess: number;
  linearityIfLess: number;

  equalIfMore: number;
  toleranceIfMore: number;
  linearityIfMore: number;

  interpolationIfLess: NumberInterpolation;
  interpolationIfMore: NumberInterpolation;
}

const defaultNumberSimilarityOptions = {
  cyclic: false,
  origin: 0,
  useOrigin: false,

  equalIfLess: 0,
  toleranceIfLess: 0.5,
  linearityIfLess: 1,

  equalIfMore: 0,
  toleranceIfMore: 0.5,
  linearityIfMore: 1,

  interpolationIfLess: NumberInterpolation[NumberInterpolation.Polynom],
  interpolationIfMore: NumberInterpolation[NumberInterpolation.Polynom],
};

export class NumberEvaluator extends SimilarityEvaluator<number | Date> {
  private min: number | Date;
  private max: number | Date;

  private cyclic = false;
  private origin = 0;
  private useOrigin = false;

  private equalIfLess = 0;
  private toleranceIfLess = 1;
  private linearityIfLess = 1;

  private equalIfMore = 0;
  private toleranceIfMore = 1;
  private linearityIfMore = 1;

  private interpolationIfLess: NumberInterpolation =
    NumberInterpolation.Polynom;
  private interpolationIfMore: NumberInterpolation =
    NumberInterpolation.Polynom;

  private maxDistance: number;

  constructor(
    public id: string,
    typeId: string,
    min: number,
    max: number,
    options?: NumberEvaluatorOptions
  ) {
    super(id, typeId);
    const configOptions = {
      ...defaultNumberSimilarityOptions,
      ...options,
    };
    this.cyclic = configOptions.cyclic;
    this.origin = configOptions.origin;
    this.useOrigin = configOptions.useOrigin;

    this.equalIfLess = configOptions.equalIfLess;
    this.toleranceIfLess = configOptions.toleranceIfLess;
    this.linearityIfLess = configOptions.linearityIfLess;

    this.equalIfMore = configOptions.equalIfMore;
    this.toleranceIfMore = configOptions.toleranceIfMore;
    this.linearityIfMore = configOptions.linearityIfMore;

    this.interpolationIfLess =
      NumberInterpolation[configOptions.interpolationIfLess];

    this.interpolationIfMore =
      NumberInterpolation[configOptions.interpolationIfMore];
    this.setRange(min, max);
  }

  get pattern(): string {
    return 'number';
  }

  public getMin(): number | Date {
    return this.min;
  }

  public getMax(): number | Date {
    return this.max;
  }

  setRange(min: number | Date, max: number | Date) {
    min = toNumber(min, Number.MIN_SAFE_INTEGER);
    max = toNumber(max, Number.MAX_SAFE_INTEGER);
    if (min > max) {
      this.min = max;
      this.max = min;
    } else {
      this.min = min;
      this.max = max;
    }
    this.maxDistance = this.max - this.min;
    if (this.cyclic) {
      this.maxDistance /= 2;
    }
  }

  evaluate(
    queryObject: ModelObject<number | Date>,
    caseObject: ModelObject<number | Date>
  ): Similarity {
    let q: number;
    let c: number;
    if (
      queryObject == null ||
      caseObject == null ||
      (!queryObject.isInteger() &&
        !caseObject.isInteger() &&
        !queryObject.isFloat() &&
        !caseObject.isFloat() &&
        !queryObject.isDate() &&
        !caseObject.isDate())
    ) {
      return new Similarity(0, queryObject, caseObject);
    }
    if (queryObject.isDate()) {
      q = (queryObject.native as Date).getTime();
      c = (caseObject.native as Date).getTime();
    } else {
      q = queryObject.native as number;
      c = caseObject.native as number;
    }
    if (q === c) {
      return new Similarity(1, queryObject, caseObject);
    }
    const distance: number = getDistance(q, c, this.maxDistance, this.cyclic);
    const relativeDistance: number =
      distance /
      getMaxDistance(q, this.maxDistance, this.origin, this.useOrigin);
    let equal: number;
    let tolerance: number;
    let linearity: number;
    let interpolation: (input: number, linearity: number) => number;
    let stretchedDistance: number;
    if (relativeDistance < 1) {
      if (isLess(c, q, this.maxDistance, this.cyclic)) {
        equal = this.equalIfLess;
        tolerance = this.toleranceIfLess;
        linearity = this.linearityIfLess;
        interpolation = getInterpolation(this.interpolationIfLess);
      } else {
        equal = this.equalIfMore;
        tolerance = this.toleranceIfMore;
        linearity = this.linearityIfMore;
        interpolation = getInterpolation(this.interpolationIfMore);
      }
      if (relativeDistance <= equal) {
        return new Similarity(1, queryObject, caseObject);
      } else if (relativeDistance >= tolerance) {
        return new Similarity(0, queryObject, caseObject);
      } else {
        stretchedDistance = (relativeDistance - equal) / (tolerance - equal);
        return new Similarity(
          interpolation(stretchedDistance, linearity),
          queryObject,
          caseObject
        );
      }
    }
    return new Similarity(0, queryObject, caseObject);
  }

  toJSON(key?: string): any {
    const result = super.toJSON(key);
    result.cyclic = this.cyclic;
    result.origin = this.origin;
    result.useOrigin = this.useOrigin;
    result.equalIfLess = this.equalIfLess;
    result.equalIfMore = this.equalIfMore;
    result.toleranceIfLess = this.toleranceIfLess;
    result.toleranceIfMore = this.toleranceIfMore;
    result.linearityIfLess = this.linearityIfLess;
    result.linearityIfMore = this.linearityIfMore;
    result.interpolationIfLess = NumberInterpolation[this.interpolationIfLess];
    result.interpolationIfMore = NumberInterpolation[this.interpolationIfMore];
    return result;
  }
}

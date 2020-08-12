import { NumberEvaluator, NumberInterpolation } from './NumberEvaluator';
import { IntegerObject } from '../model/IntegerObject';
import { Similarity } from './Similarity';

describe('NumberEvaluator', () => {
  it('should evaluate to 1', () => {
    const evaluator = new NumberEvaluator('TestEval', 'TestClass', 10, 20);
    expect(NumberInterpolation[NumberInterpolation.Polynom]).toEqual('Polynom');
    expect(NumberInterpolation['Polynom']).toEqual(NumberInterpolation.Polynom);
    expect(
      evaluator.evaluate(new IntegerObject(15), new IntegerObject(15))
    ).toEqual(new Similarity(1, new IntegerObject(15), new IntegerObject(15)));
  });
  it('should evaluate to 0.5', () => {
    const evaluator = new NumberEvaluator('TestEval', 'TestClass', 10, 20, {
      cyclic: false,
      origin: 0,
      useOrigin: false,
      equalIfLess: 0,
      equalIfMore: 0,
      toleranceIfLess: 1,
      toleranceIfMore: 1,
      linearityIfLess: 1,
      linearityIfMore: 1,
      interpolationIfLess: NumberInterpolation.Polynom,
      interpolationIfMore: NumberInterpolation.Polynom,
    });
    expect(NumberInterpolation[NumberInterpolation.Polynom]).toEqual('Polynom');
    expect(NumberInterpolation['Polynom']).toEqual(NumberInterpolation.Polynom);
    expect(
      evaluator.evaluate(new IntegerObject(10), new IntegerObject(15))
    ).toEqual(
      new Similarity(0.5, new IntegerObject(10), new IntegerObject(15))
    );
    expect(
      evaluator.evaluate(new IntegerObject(20), new IntegerObject(15))
    ).toEqual(
      new Similarity(0.5, new IntegerObject(20), new IntegerObject(15))
    );
    expect(
      evaluator.evaluate(new IntegerObject(15), new IntegerObject(20))
    ).toEqual(
      new Similarity(0.5, new IntegerObject(15), new IntegerObject(20))
    );
  });
  it('should evaluate to 0', () => {
    const evaluator = new NumberEvaluator('TestEval', 'TestClass', 10, 20);
    expect(
      evaluator.evaluate(new IntegerObject(10), new IntegerObject(20))
    ).toEqual(new Similarity(0, new IntegerObject(10), new IntegerObject(20)));
    expect(
      evaluator.evaluate(new IntegerObject(20), new IntegerObject(10))
    ).toEqual(new Similarity(0, new IntegerObject(20), new IntegerObject(10)));
  });
  it('should serialize correct to JSON', () => {
    const evaluator = new NumberEvaluator('TestEval', 'TestClass', 20, 10);
    expect(evaluator.toJSON()).toEqual({
      id: 'TestEval',
      type: 'TestClass',
      pattern: 'number',
      cyclic: false,
      origin: 0,
      useOrigin: false,
      equalIfLess: 0,
      equalIfMore: 0,
      toleranceIfLess: 0.5,
      toleranceIfMore: 0.5,
      linearityIfLess: 1,
      linearityIfMore: 1,
      interpolationIfLess: 'Polynom',
      interpolationIfMore: 'Polynom',
    });
  });
});

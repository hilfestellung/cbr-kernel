import { SimilarityEvaluator } from './SimilarityEvaluator';
import { IntegerClass } from 'model/IntegerClass';
import { IntegerObject } from 'model/IntegerObject';
import { Similarity } from './Similarity';

describe('SimilarityEvaluator', () => {
  it('should evaluate to 1', () => {
    const evaluator = new SimilarityEvaluator(
      'TestEval',
      new IntegerClass('TestClass')
    );
    expect(
      evaluator.evaluate(new IntegerObject(5), new IntegerObject(5))
    ).toEqual(new Similarity(1, new IntegerObject(5), new IntegerObject(5)));
  });
  it('should evaluate to 0', () => {
    const evaluator = new SimilarityEvaluator(
      'TestEval',
      new IntegerClass('TestClass')
    );
    expect(
      evaluator.evaluate(new IntegerObject(5), new IntegerObject(6))
    ).toEqual(new Similarity(0, new IntegerObject(5), new IntegerObject(6)));
    expect(
      evaluator.evaluate(
        new IntegerObject(5),
        (null as unknown) as IntegerObject
      )
    ).toEqual(
      new Similarity(
        0,
        new IntegerObject(5),
        (null as unknown) as IntegerObject
      )
    );
    expect(
      evaluator.evaluate(
        (null as unknown) as IntegerObject,
        new IntegerObject(5)
      )
    ).toEqual(
      new Similarity(
        0,
        (null as unknown) as IntegerObject,
        new IntegerObject(5)
      )
    );
  });
  it('should serialize to correct JSON', () => {
    const evaluator = new SimilarityEvaluator(
      'TestEval',
      new IntegerClass('TestClass')
    );
    expect(evaluator.toJSON()).toEqual({ id: 'TestEval', type: 'TestClass' });
  });
});

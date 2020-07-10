import { LookupEvaluator, LookupMode } from './LookupEvaluator';
import { StringClass } from 'model/StringClass';
import { StringObject } from 'model/StringObject';
import { Similarity } from './Similarity';
import { ModelObject } from 'model';

describe('LookupEvaluator', () => {
  const red = new StringObject('red');
  const orange = new StringObject('orange');
  const yellow = new StringObject('yellow');
  const blue = new StringObject('blue');
  const violet = new StringObject('violet');
  const green = new StringObject('green');
  it('should create symmetric lookup', () => {
    const evaluator = new LookupEvaluator(
      'TestEval',
      new StringClass('TestClass'),
      LookupMode.Symmetric,
      {
        red: {
          orange: 0.7,
          yellow: 0.4,
        },
        blue: {
          violet: 0.7,
          green: 0.3,
        },
      }
    );

    expect(evaluator.evaluate(red, red)).toEqual(new Similarity(1, red, red));
    expect(evaluator.evaluate(red, orange)).toEqual(
      new Similarity(0.7, red, orange)
    );
    expect(evaluator.evaluate(orange, red)).toEqual(
      new Similarity(0.7, orange, red)
    );
    expect(evaluator.evaluate(red, yellow)).toEqual(
      new Similarity(0.4, red, yellow)
    );
    expect(evaluator.evaluate(yellow, red)).toEqual(
      new Similarity(0.4, yellow, red)
    );
    expect(evaluator.evaluate(blue, violet)).toEqual(
      new Similarity(0.7, blue, violet)
    );
    expect(evaluator.evaluate(violet, blue)).toEqual(
      new Similarity(0.7, violet, blue)
    );
    expect(evaluator.evaluate(blue, green)).toEqual(
      new Similarity(0.3, blue, green)
    );
    expect(evaluator.evaluate(green, blue)).toEqual(
      new Similarity(0.3, green, blue)
    );
  });
  it('should create asymmetric lookup', () => {
    const evaluator = new LookupEvaluator(
      'TestEval',
      new StringClass('TestClass')
    );
    expect(evaluator.lookup).toEqual({});
    expect(evaluator.mode).toEqual(LookupMode.Asymmetric);
    evaluator.setLookup(
      {
        red: {
          orange: 0.7,
          yellow: 0.4,
        },
        blue: {
          violet: 0.7,
          green: 0.3,
        },
      },
      LookupMode.Asymmetric
    );
    expect(
      evaluator.evaluate(
        (null as unknown) as ModelObject<string>,
        (null as unknown) as ModelObject<string>
      )
    ).toEqual(
      new Similarity(
        0,
        (null as unknown) as ModelObject<string>,
        (null as unknown) as ModelObject<string>
      )
    );
    expect(
      evaluator.evaluate(red, (null as unknown) as ModelObject<string>)
    ).toEqual(new Similarity(0, red, (null as unknown) as ModelObject<string>));
    expect(
      evaluator.evaluate((null as unknown) as ModelObject<string>, red)
    ).toEqual(new Similarity(0, (null as unknown) as ModelObject<string>, red));
    expect(evaluator.evaluate(red, red)).toEqual(new Similarity(1, red, red));
    expect(evaluator.evaluate(red, orange)).toEqual(
      new Similarity(0.7, red, orange)
    );
    expect(evaluator.evaluate(orange, red)).toEqual(
      new Similarity(0, orange, red)
    );
    expect(evaluator.evaluate(red, yellow)).toEqual(
      new Similarity(0.4, red, yellow)
    );
    expect(evaluator.evaluate(yellow, red)).toEqual(
      new Similarity(0, yellow, red)
    );
    expect(evaluator.evaluate(blue, violet)).toEqual(
      new Similarity(0.7, blue, violet)
    );
    expect(evaluator.evaluate(violet, blue)).toEqual(
      new Similarity(0, violet, blue)
    );
    expect(evaluator.evaluate(blue, green)).toEqual(
      new Similarity(0.3, blue, green)
    );
    expect(evaluator.evaluate(green, blue)).toEqual(
      new Similarity(0, green, blue)
    );
  });
  it('should serialize correct to JSON', () => {
    const evaluator = new LookupEvaluator(
      'TestEval',
      new StringClass('TestClass')
    );
    expect(evaluator.lookup).toEqual({});
    expect(evaluator.mode).toEqual(LookupMode.Asymmetric);
    evaluator.setLookup(
      {
        red: {
          orange: 0.7,
          yellow: 0.4,
        },
        blue: {
          violet: 0.7,
          green: 0.3,
        },
      },
      LookupMode.Asymmetric
    );
    expect(evaluator.toJSON()).toEqual({
      id: 'TestEval',
      type: 'TestClass',
      mode: 'asymmetric',
      lookup: {
        red: {
          orange: 0.7,
          yellow: 0.4,
        },
        blue: {
          violet: 0.7,
          green: 0.3,
        },
      },
    });
  });
});

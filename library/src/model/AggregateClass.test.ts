import { AggregateClass } from './AggregateClass';
import { Attribute } from './Attribute';
import { IntegerClass } from './IntegerClass';
import { PredicateRange } from './PredicateRange';
import { IntegerObject } from './IntegerObject';

describe('AggregateClass', () => {
  fit('shoudl...', () => {
    const MilesClass = new IntegerClass('Miles');
    MilesClass.predicate = new PredicateRange(
      new IntegerObject(0),
      new IntegerObject(1000000)
    );
    const clazz = new AggregateClass('TestClass', [
      new Attribute('miles', MilesClass),
    ]);
    console.log(JSON.stringify(clazz, null, '  '));
    console.log(JSON.stringify(clazz.readObject({ miles: 7 }), null, '  '));
  });
});

import { Similarity } from './Similarity';
import { IntegerObject } from '../model/IntegerObject';

describe('Similarity', () => {
  it('should serialize correct to JSON', () => {
    const sim = new Similarity(
      0.5,
      new IntegerObject(5),
      new IntegerObject(10)
    );
    expect(sim.value).toBe(0.5);
    expect(sim.toJSON()).toBe(0.5);
  });
});

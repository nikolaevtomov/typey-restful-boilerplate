import { describe, it } from 'mocha';
import { assert } from 'chai';

describe('Basic Mocha String Test', () => {
  it('should return number of characters in a string', () => {
    assert.equal('Hello'.length, 5);
  });

  it('should return first character of the string', () => {
    assert.equal('Hello'.charAt(0), 'H');
  });
});

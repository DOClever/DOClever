import escapeRegexp from '../escapeRegexp';

describe('escapeRegexp', () => {
  it('should escape backslash', () => {
    expect(escapeRegexp('/')).toBe('\/');
  });
});

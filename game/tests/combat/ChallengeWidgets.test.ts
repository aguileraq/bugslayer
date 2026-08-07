import { describe, expect, it } from 'vitest';

import { TextInputModel } from '../../src/combat/TextInputModel';
import { MultipleChoiceModel } from '../../src/combat/MultipleChoiceModel';

describe('TextInputModel', () => {
  it('starts empty with max length 12', () => {
    const model = new TextInputModel();

    expect(model.value).toBe('');
    expect(model.length).toBe(0);
    expect(model.maxLength).toBe(12);
    expect(model.counter).toBe('0/12');
    expect(model.submitted).toBe(false);
  });

  it('accepts printable characters up to 12', () => {
    const model = new TextInputModel();

    expect(model.type(';')).toBe(true);
    expect(model.value).toBe(';');
    expect(model.counter).toBe('1/12');

    model.type('n');
    model.type('u');
    model.type('m');
    model.type('b');
    model.type('e');
    model.type('r');
    expect(model.value).toBe(';number');
    expect(model.length).toBe(7);
  });

  it('silently ignores characters beyond 12 (REQ-CHL-002 §3)', () => {
    const model = new TextInputModel();

    for (let i = 0; i < 12; i++) {
      model.type('a');
    }
    expect(model.length).toBe(12);
    expect(model.counter).toBe('12/12');

    // 13th character silently ignored
    expect(model.type('x')).toBe(false);
    expect(model.length).toBe(12);
  });

  it('ignores non-printable characters', () => {
    const model = new TextInputModel();

    expect(model.type('\x00')).toBe(false);
    expect(model.type('\n')).toBe(false);
    expect(model.type('\t')).toBe(false);
    expect(model.length).toBe(0);
  });

  it('ignores multi-character strings (arrows are handled by movement)', () => {
    const model = new TextInputModel();

    expect(model.type('ArrowUp')).toBe(false);
    expect(model.type('Enter')).toBe(false);
    expect(model.length).toBe(0);
  });

  it('accepts accented characters and symbols', () => {
    const model = new TextInputModel();

    expect(model.type('ñ')).toBe(true);
    expect(model.type('á')).toBe(true);
    expect(model.type('+')).toBe(true);
    expect(model.value).toBe('ñá+');
  });

  it('backspace deletes last character (REQ-CHL-002 §6)', () => {
    const model = new TextInputModel();

    model.type('a');
    model.type('b');
    model.type('c');

    expect(model.backspace()).toBe(true);
    expect(model.value).toBe('ab');

    expect(model.backspace()).toBe(true);
    expect(model.value).toBe('a');
  });

  it('backspace on empty returns false', () => {
    const model = new TextInputModel();

    expect(model.backspace()).toBe(false);
  });

  it('submit returns value and marks as submitted (REQ-CHL-002 §5)', () => {
    const model = new TextInputModel();

    model.type(';');
    const result = model.submit();

    expect(result).toBe(';');
    expect(model.submitted).toBe(true);
  });

  it('cannot type or submit after submission', () => {
    const model = new TextInputModel();

    model.type('a');
    model.submit();

    expect(model.type('b')).toBe(false);
    expect(model.submit()).toBeNull();
    expect(model.backspace()).toBe(false);
  });

  it('reset restores to given value', () => {
    const model = new TextInputModel();

    model.type('a');
    model.type('b');
    model.submit();

    model.reset('num');
    expect(model.value).toBe('num');
    expect(model.submitted).toBe(false);
    expect(model.type('b')).toBe(true);
    expect(model.value).toBe('numb');
  });
});

describe('MultipleChoiceModel', () => {
  it('requires 3 or 4 options', () => {
    expect(() => new MultipleChoiceModel(2)).toThrow();
    expect(() => new MultipleChoiceModel(5)).toThrow();
    expect(() => new MultipleChoiceModel(3)).not.toThrow();
    expect(() => new MultipleChoiceModel(4)).not.toThrow();
  });

  it('starts with no selection', () => {
    const model = new MultipleChoiceModel(3);

    expect(model.selectedIndex).toBeNull();
    expect(model.submitted).toBe(false);
    expect(model.optionCount).toBe(3);
  });

  it('select by index submits immediately (REQ-CHL-003 §2-3)', () => {
    const model = new MultipleChoiceModel(3);

    expect(model.select(1)).toBe(true);
    expect(model.selectedIndex).toBe(1);
    expect(model.submitted).toBe(true);
  });

  it('rejects invalid index (REQ-CHL-003 §4)', () => {
    const model = new MultipleChoiceModel(3);

    expect(model.select(-1)).toBe(false);
    expect(model.select(3)).toBe(false);
    expect(model.select(4)).toBe(false);
    expect(model.submitted).toBe(false);
  });

  it('cannot select after submission', () => {
    const model = new MultipleChoiceModel(3);

    model.select(0);
    expect(model.select(1)).toBe(false);
    expect(model.selectedIndex).toBe(0);
  });

  it('selectByKey converts 1-based keyboard input (REQ-CHL-003 §2)', () => {
    const model = new MultipleChoiceModel(4);

    expect(model.selectByKey('1')).toBe(true);
    expect(model.selectedIndex).toBe(0);
  });

  it('selectByKey ignores numbers without corresponding option (REQ-CHL-003 §4)', () => {
    const model = new MultipleChoiceModel(3);

    expect(model.selectByKey('4')).toBe(false); // only 3 options
    expect(model.selectByKey('0')).toBe(false);
    expect(model.selectByKey('abc')).toBe(false);
    expect(model.submitted).toBe(false);
  });

  it('reset restores selection state', () => {
    const model = new MultipleChoiceModel(3);

    model.select(2);
    model.reset(1);

    expect(model.selectedIndex).toBe(1);
    expect(model.submitted).toBe(false);
    expect(model.select(0)).toBe(true);
  });
});

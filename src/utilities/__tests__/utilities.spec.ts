import { describe, expect, it } from 'vitest';
import { unitParser } from '@/utilities';

describe('unitParser function', () => {
    it('should return "15px" if argument is typeof Number', () => {
        expect(unitParser(15)).toMatchInlineSnapshot('"15px"');
    });

    it('should return "100%" if argument is typeof String', () => {
        expect(unitParser('100%')).toMatchInlineSnapshot('"100%"');
    });
});

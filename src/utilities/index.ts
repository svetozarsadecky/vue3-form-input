/**
 * @return A unit as String type.
 *
 * - If the argument is Number (15), returns String ("15px")
 * - If the argument is String ("10rem"), returns String ("10rem")
 * @param value A number or any string;
 */
export function unitParser(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value;
}

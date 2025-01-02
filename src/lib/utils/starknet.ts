import { shortString } from 'starknet';

const FIELD_SIZE =
  '0x800000000000011000000000000000000000000000000000000000000000001';

export function stringToFelt252(str: string): string {
  try {
    // First validate the string
    if (!validateShortString(str)) {
      throw new Error('Invalid string for felt252 conversion');
    }
    // Convert to hex string
    const felt = shortString.encodeShortString(str);
    // Ensure it's within felt252 range
    if (BigInt(felt) > BigInt(FIELD_SIZE)) {
      throw new Error('String too large for felt252');
    }
    return felt;
  } catch (err) {
    const error = err as Error;
    throw new Error(`Failed to convert string to felt252: ${error.message}`);
  }
}

export function stringsToFelt252Array(strings: string[]): string[] {
  return strings.map(stringToFelt252);
}

export function validateShortString(str: string): boolean {
  if (!str || str.length > 31) {
    return false;
  }

  // Check if string contains only ASCII characters
  if (!/^[\x00-\x7F]*$/.test(str)) {
    return false;
  }

  try {
    const felt = shortString.encodeShortString(str);
    return BigInt(felt) <= BigInt(FIELD_SIZE);
  } catch {
    return false;
  }
}

import { getValue, omit, convertValue } from './properties';

describe('Properties utils', () => {
	describe('#getValue', () => {
		it('should return undefined when key is falsy', () => {
			// given
			const properties = {
				user: {
					firstname: 'toto',
					lastname: 'tata',
				},
			};

			// when
			const value = getValue(properties, null);

			// then
			expect(value).toBeUndefined();
		});

		it('should return the requested value', () => {
			// given
			const properties = {
				user: {
					firstname: 'toto',
					lastname: 'tata',
				},
			};
			const key = ['user', 'firstname'];

			// when
			const value = getValue(properties, key);

			// then
			expect(value).toBe('toto');
		});
	});

	describe('#omit', () => {
		it('should copy all properties except the omitted ones', () => {
			// given
			const properties = {
				toKeep: 'toto',
				toBeOmitted: 'tata',
				other: 'titi',
			};

			// when
			const result = omit(properties, 'toBeOmitted');

			// then
			expect(result).toEqual({
				toKeep: 'toto',
				other: 'titi',
			});
		});
	});

	describe('#convertValue', () => {
		it('should return the original value', () => {
			// given
			const value = '3';

			// when
			const convertedValue = convertValue('unknown', value);

			// then
			expect(convertedValue).toBe(value);
		});

		it('should convert to number value', () => {
			// given
			const value = '3.5';

			// when
			const convertedValue = convertValue('number', value);

			// then
			expect(convertedValue).toBe(3.5);
		});
	});
});

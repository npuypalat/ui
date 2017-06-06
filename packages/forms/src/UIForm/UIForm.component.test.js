import React from 'react';
import { shallow, mount } from 'enzyme';
import { data, mergedSchema, initProps } from '../../__mocks__/data';

import UIForm from './UIForm.component';

describe('UIForm component', () => {
	let props;
	beforeEach(() => {
		props = {
			...initProps(),
			setError: jest.fn(),
			setErrors: jest.fn(),
			updateForm: jest.fn(),
		};
	});

	it('should render form', () => {
		// when
		const wrapper = shallow(<UIForm {...data} {...props} />);

		// then
		expect(wrapper.node).toMatchSnapshot();
	});

	describe('#onChange', () => {
		it('should call onChange callback', () => {
			// given
			const wrapper = mount(<UIForm {...data} {...props} />);
			const newValue = 'toto';
			const event = { target: { value: newValue } };
			const inputValidationError = 'String is too short (4 chars), minimum 10';

			// when
			wrapper.find('input').at(0).simulate('change', event);

			// then
			expect(props.onChange).toBeCalledWith(
				props.formName,
				mergedSchema[0],
				newValue,
				inputValidationError,
			);
			expect(props.onTrigger).not.toBeCalled();
		});

		it('should trigger "after" trigger', () => {
			// given
			const wrapper = mount(<UIForm {...data} {...props} />);
			const newValue = 'toto';
			const event = { target: { value: newValue } };
			props.onTrigger.mockReturnValueOnce(Promise.resolve({}));

			// when
			wrapper.find('input').at(1).simulate('change', event);

			// then
			expect(props.onTrigger).toBeCalledWith(
				'after',
				mergedSchema[1],
				newValue,
				data.properties,
			);
		});
	});

	describe('#onTrigger', () => {
		it('should call trigger callback', () => {
			// given
			const wrapper = mount(<UIForm {...data} {...props} />);
			props.onTrigger.mockReturnValueOnce(Promise.resolve({}));

			// when
			wrapper.find('button').at(0).simulate('click');

			// then
			expect(props.onTrigger).toBeCalledWith(
				'after',
				mergedSchema[2],
				undefined,
				data.properties,
			);
		});

		it('should updateForm on trigger success', (done) => {
			// given
			const wrapper = shallow(<UIForm {...data} {...props} />);
			const nextData = {
				jsonSchema: {
					type: 'object',
					title: 'User',
					properties: {
						name: { type: 'string' },
					},
				},
				uiSchema: ['name'],
				properties: { name: 'toto' },
				errors: { name: 'This field is required' },
			};
			props.onTrigger.mockReturnValueOnce(Promise.resolve(nextData));

			// when
			const trigger = wrapper
				.instance()
				.onTrigger(null, 'after', mergedSchema[2], null);

			// then
			trigger.then(() => {
				expect(props.updateForm).toBeCalledWith(
					props.formName,
					nextData.jsonSchema,
					nextData.uiSchema,
					nextData.properties,
					nextData.errors
				);
				expect(props.setError).not.toBeCalled();
				done();
			});
		});

		it('should setError after trigger failure', (done) => {
			// given
			const wrapper = shallow(<UIForm {...data} {...props} />);
			const triggerErrors = { errors: { check: 'Error while triggeringthe trigger' } };
			props.onTrigger.mockReturnValueOnce(Promise.reject(triggerErrors));

			// when
			const trigger = wrapper
				.instance()
				.onTrigger(null, 'after', mergedSchema[2], null);

			// then
			trigger.then(() => {
				expect(props.updateForm).not.toBeCalled();
				expect(props.setError).toBeCalledWith(
					props.formName,
					triggerErrors.errors
				);
				done();
			});
		});
	});

	describe('#submit', () => {
		it('should prevent event default', () => {
			// given
			const wrapper = shallow(<UIForm {...data} {...props} />);
			const event = { preventDefault: jest.fn() };

			// when
			wrapper.instance().submit(event);

			// then
			expect(event.preventDefault).toBeCalled();
		});

		it('should validate all fields', () => {
			// given
			const wrapper = shallow(<UIForm {...data} {...props} />);
			const event = { preventDefault: jest.fn() };

			// when
			wrapper.instance().submit(event);

			// then
			expect(props.setErrors).toBeCalledWith(
				props.formName,
				{ firstname: 'Missing required property: firstname' }
			);
		});

		it('should not call submit callback when form is invalid', () => {
			// given
			const wrapper = shallow(<UIForm {...data} {...props} />);
			const event = { preventDefault: jest.fn() };

			// when
			wrapper.instance().submit(event);

			// then
			expect(props.onSubmit).not.toBeCalled();
		});

		it('should call submit callback when form is valid', () => {
			// given
			const validProperties = {
				...data.properties,
				lastname: 'This has at least 10 characters',
				firstname: 'This is required',
			};
			const wrapper = shallow(<UIForm {...data} {...props} properties={validProperties} />);
			const event = { preventDefault: jest.fn() };

			// when
			wrapper.instance().submit(event);

			// then
			expect(props.onSubmit).toBeCalled();
		});
	});
});

import {
	TF_CREATE_FORM,
	TF_CHANGE_FORM,
	TF_REMOVE_FORM,
	TF_MUTATE_VALUE,
	TF_VALIDATE_ALL,
	TF_VALIDATE_PARTIAL,
} from '../actions';
import { omit } from '../utils/properties';
import modelReducer from './model.reducer';
import validationsReducer from './validations.reducer';

/**
 * Form reducer, that manage multiple form state.
 * Format : {
 *      [form_name]: {
 *          properties: {},
 *          errors: {},
 *      },
 *      ...
 * }
 */
export default function formReducer(state = {}, action) {
	switch (action.type) {
	case TF_CREATE_FORM: {
		const form = state[action.formName];
		if (form) {
			return state;
		}
		return {
			...state,
			[action.formName]: {
				jsonSchema: action.jsonSchema,
				uiSchema: action.uiSchema,
				properties: action.properties || {},
				errors: action.errors || {},
			},
		};
	}
	case TF_CHANGE_FORM: {
		const form = state[action.formName];
		const { jsonSchema, uiSchema, properties, errors } = action;
		if (!form || (!jsonSchema && !uiSchema && !properties && !errors)) {
			return state;
		}
		return {
			...state,
			[action.formName]: {
				jsonSchema: action.jsonSchema || form.jsonSchema,
				uiSchema: action.uiSchema || form.uiSchema,
				properties: action.properties || form.properties,
				errors: {
					...form.errors,
					...action.errors,
				},
			},
		};
	}
	case TF_REMOVE_FORM:
		return omit(state, action.formName);
	case TF_MUTATE_VALUE:
	case TF_VALIDATE_PARTIAL:
	case TF_VALIDATE_ALL: {
		const form = state[action.formName];
		if (!form) {
			return state;
		}
		return {
			...state,
			[action.formName]: {
				properties: modelReducer(form.properties, action),
				errors: validationsReducer(form.errors, action),
			},
		};
	}
	default:
		return state;
	}
}

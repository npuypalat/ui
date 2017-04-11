import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { Enumeration, IconsProvider } from '../src/index';

const addItemAction = {
	label: 'Add item',
	icon: 'talend-plus',
	id: 'add',
	onClick: action('header.onAdd'),
};

const loadingAction = {
	label: 'loading',
	icon: 'talend-cross',
	inProgress: true,
	id: 'loading',
};

const deleteItemAction = {
	label: 'Remove selected values',
	icon: 'talend-trash',
	id: 'del',
	onClick: action('headerSelected.deleteAll'),
};

const validateAction = {
	disabled: false,
	label: 'Validate',
	icon: 'talend-check',
	id: 'validate',
	onClick: action('headerInput.onValidate'),
};

const abortAction = {
	label: 'Abort',
	icon: 'talend-cross',
	id: 'abort',
	onClick: action('headerInput.onAbort'),
};

const ITEM_DEFAULT_HEIGHT = 33;

const props = {
	required: true,
	displayMode: 'DISPLAY_MODE_DEFAULT',
	headerDefault: [addItemAction, loadingAction],
	headerSelected: [deleteItemAction],
	headerInput: [validateAction, abortAction],
	items: Array(1000).fill('').map((item, index) => ({
		values: [`Lorem ipsum dolor sit amet ${index}`],
	})),
	itemsProp: {
		key: 'values',
		onSubmitItem: action('itemEdit.onSubmit'),
		onItemChange: action('itemEdit.onItemchange'),
		onAbortItem: action('itemEdit.onCancel'),
		onSelectItem: action('itemEdit.onSelect'),
		getItemHeight: (isInEdit) => { return ITEM_DEFAULT_HEIGHT; },
		actionsDefault: [{
			disabled: false,
			label: 'Edit',
			icon: 'talend-pencil',
			id: 'edit',
			onClick: action('item.onEnterEditMode'),
		}, {
			label: 'Remove value',
			icon: 'talend-trash',
			id: 'delete',
			onClick: action('item.onDelete'),
		}],
		actionsEdit: [{
			disabled: false,
			label: 'Validate',
			icon: 'talend-check',
			id: 'validate',
			onClick: action('itemEdit.onSubmit'),
		}, {
			label: 'Abort',
			icon: 'talend-cross',
			id: 'abort',
			onClick: action('itemEdit.onCancel'),
		}],
	},
	onAddChange: action('onAddChange'),
	onAddKeyDown: action('onAddKeyDown'),
};

const addProps = {
	...props,
	displayMode: 'DISPLAY_MODE_ADD',
};
const editItemProps = {
	...props,
	displayMode: 'DISPLAY_MODE_DEFAULT',
	currentEdit: {
		validate: {
			disabled: false,
		},
	},
};
const selectedValuesProps = {
	...props,
	displayMode: 'DISPLAY_MODE_SELECTED',
};
const searchProps = {
	...props,
	displayMode: 'DISPLAY_MODE_SEARCH',
	searchCriteria: 'lorem',
};

// custom edit props
editItemProps.items = Array(100000).fill('').map((item, index) => ({
	values: [`Lorem ipsum dolor sit amet ${index}`],
}));
editItemProps.items[0] = {
	values: ['Lorem ipsum dolor sit amet 0'],
	displayMode: 'DISPLAY_MODE_EDIT',
};

// custom selected props
selectedValuesProps.items = Array(50).fill('').map((item, index) => ({
	values: [`Lorem ipsum dolor sit amet ${index}`],
	isSelected: index % 2 === 0,
}));

const headerErrorProps = {
	...props,
	displayMode: 'DISPLAY_MODE_ADD',
};
headerErrorProps.headerError = 'an error occured';

const editItemPropsWithError = {
	...props,
	displayMode: 'DISPLAY_MODE_DEFAULT',
	currentEdit: {
		validate: {
			disabled: false,
		},
	},
};
// custom edit props
editItemPropsWithError.items = Array(50).fill('').map((item, index) => ({
	values: [`Lorem ipsum dolor sit amet ${index}`],
}));
editItemPropsWithError.items[0] = {
	values: ['Lorem ipsum dolor sit amet 0'],
	displayMode: 'DISPLAY_MODE_EDIT',
	error: 'an error occured',
};

storiesOf('Enumeration', module)
	.addDecorator((story) => (
		<div>
			<IconsProvider />
			<h1>Enumeration</h1>
			{story()}
		</div>
	))
	.addWithInfo('default', () => (
		<Enumeration
			{...props}
		/>
	))
	.addWithInfo('add', () => (
		<Enumeration
			{...addProps}
		/>
	))
	.addWithInfo('edit mode', () => (

		<Enumeration
			{...editItemProps}
		/>
	))
	.addWithInfo('search mode', () => (
		<Enumeration
			{...searchProps}
		/>
	))
	.addWithInfo('selected values', () => (
		<Enumeration
			{...selectedValuesProps}
		/>
	))
	.addWithInfo('with header error', () => (
		<Enumeration
			{...headerErrorProps}
		/>
	))
	.addWithInfo('with item in error', () => (
		<Enumeration
			{...editItemPropsWithError}
		/>
	))
	.addWithInfo('with checkboxes', () => {
		const props = {
			displayMode: 'DISPLAY_MODE_CHECKBOX',
			onToggleAll: action('onToggleAll'),
			items: Array(1000).fill('').map((item, index) => ({
				values: [`Lorem ipsum dolor sit amet ${index}`],
				isSelected: index % 5 === 0,
			})),
			itemsProp: {
				key: 'values',
				onSelectItem: action('itemEdit.onSelect'),
				getItemHeight: (isInEdit) => {
					return ITEM_DEFAULT_HEIGHT;
				},
				actionsDefault: [],
			},
		};
		return (
			<form>
				<Enumeration
					{...props}
				/>
			</form>
		);
	});

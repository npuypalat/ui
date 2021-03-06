import { componentState } from 'react-cmf';

console.warn(`DEPRECATION WARNING: import state, {} from 'react-talend-containers'; is deprecated.
You should import { componentState } from 'react-cmf'`);  // eslint-disable-line no-console

export default componentState;

export const getStateAccessors = componentState.getAccessors;
export const getStateProps = componentState.getProps;
export const initState = componentState.init;
export const stateWillMount = (props) => {
	console.log(  // eslint-disable-line no-console
		`DEPRECATION Warning: you should use initState
		in componentDidMount instead.
		https://github.com/facebook/react/issues/7671`);
	componentState.init(props);
};
export const statePropTypes = componentState.propTypes;

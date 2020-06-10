# Compose

The `compose` package is a collection of handy [Higher Order Components](https://facebook.github.io/react/docs/higher-order-components.html) (HOCs) you can use to wrap your WordPress components and provide some basic features like: state, instance id, pure...

The `compose` function is an alias to [flowRight](https://lodash.com/docs/#flowRight) from Lodash. It comes from functional programming, and allows you to compose any number of functions. You might also think of this as layering functions; `compose` will execute the last function first, then sequentially move back through the previous functions passing the result of each function upward.

An example that illustrates it for two functions:

```js
const compose = ( f, g ) => x
    => f( g( x ) );
```

Here's a simplified example of **compose** in use from Gutenberg's [`PluginSidebar` component](https://github.com/WordPress/gutenberg/blob/master/packages/edit-post/src/components/sidebar/plugin-sidebar/index.js):

Using compose:

```js
const applyWithSelect = withSelect( ( select, ownProps ) => {
	return doSomething( select, ownProps);
} );
const applyWithDispatch = withDispatch( ( dispatch, ownProps ) => {
	return doSomethingElse( dispatch, ownProps );
} );

export default compose(
	withPluginContext,
	applyWithSelect,
	applyWithDispatch,
)( PluginSidebarMoreMenuItem );
```

Without `compose`, the code would look like this:

```js
const applyWithSelect = withSelect( ( select, ownProps ) => {
	return doSomething( select, ownProps);
} );
const applyWithDispatch = withDispatch( ( dispatch, ownProps ) => {
	return doSomethingElse( dispatch, ownProps );
} );

export default withPluginContext(
	applyWithSelect(
		applyWithDispatch(
			PluginSidebarMoreMenuItem
		)
	)
);
```

## Installation

Install the module

```bash
npm install @wordpress/compose --save
```

_This package assumes that your code will run in an **ES2015+** environment. If you're using an environment that has limited or no support for ES2015+ such as lower versions of IE then using [core-js](https://github.com/zloirock/core-js) or [@babel/polyfill](https://babeljs.io/docs/en/next/babel-polyfill) will add support for these methods. Learn more about it in [Babel docs](https://babeljs.io/docs/en/next/caveats)._

## API

For more details, you can refer to each Higher Order Component's README file. [Available components are located here.](https://github.com/WordPress/gutenberg/tree/master/packages/compose/src)

<!-- START TOKEN(Autogenerated API docs) -->

### compose

[src/index.js#L22-L22](src/index.js#L22-L22)

Composes multiple higher-order components into a single higher-order component. Performs right-to-left function
composition, where each successive invocation is supplied the return value of the previous.

**Parameters**

-   **hocs** `...Function`: The HOC functions to invoke.

**Returns**

`Function`: Returns the new composite function.

### createHigherOrderComponent

[src/index.js#L6-L6](src/index.js#L6-L6)

Given a function mapping a component to an enhanced component and modifier
name, returns the enhanced component augmented with a generated displayName.

**Parameters**

-   **mapComponentToEnhancedComponent** `Function`: Function mapping component to enhanced component.
-   **modifierName** `string`: Seed name from which to generated display name.

**Returns**

`WPComponent`: Component class with generated display name assigned.

### ifCondition

[src/index.js#L7-L7](src/index.js#L7-L7)

Higher-order component creator, creating a new component which renders if
the given condition is satisfied or with the given optional prop name.

**Parameters**

-   **predicate** `Function`: Function to test condition.

**Returns**

`Function`: Higher-order component.

### pure

[src/index.js#L8-L8](src/index.js#L8-L8)

Given a component returns the enhanced component augmented with a component
only rerendering when its props/state change

**Parameters**

-   **mapComponentToEnhancedComponent** `Function`: Function mapping component to enhanced component.
-   **modifierName** `string`: Seed name from which to generated display name.

**Returns**

`WPComponent`: Component class with generated display name assigned.

### withGlobalEvents

[src/index.js#L9-L9](src/index.js#L9-L9)

Undocumented declaration.

### withInstanceId

[src/index.js#L10-L10](src/index.js#L10-L10)

A Higher Order Component used to be provide a unique instance ID by
component.

**Parameters**

-   **WrappedComponent** `WPElement`: The wrapped component.

**Returns**

`Component`: Component with an instanceId prop.

### withSafeTimeout

[src/index.js#L11-L11](src/index.js#L11-L11)

A higher-order component used to provide and manage delayed function calls
that ought to be bound to a component's lifecycle.

**Parameters**

-   **OriginalComponent** `Component`: Component requiring setTimeout

**Returns**

`Component`: Wrapped component.

### withState

[src/index.js#L12-L12](src/index.js#L12-L12)

A Higher Order Component used to provide and manage internal component state
via props.

**Parameters**

-   **initialState** `?Object`: Optional initial state of the component.

**Returns**

`Component`: Wrapped component.


<!-- END TOKEN(Autogenerated API docs) -->

<br/><br/><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
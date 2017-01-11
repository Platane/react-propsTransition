react-propsTransition
===

[![wercker status](https://app.wercker.com/status/390b3b425f0799a5084092760048901a/s/master "wercker status")](https://app.wercker.com/project/byKey/390b3b425f0799a5084092760048901a)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm](https://img.shields.io/npm/v/react-propstransition.svg)](https://www.npmjs.com/package/react-propstransition)

Declare a property to transition. Whenever this props change, the component render is called with ( previous, next ) so you can hook whatever animation.

```
  Flow diagram :

    k = 'a'             k change to 'b'
                             |
                             |<------------delay---------------->|
    . . . -------------------|-----------------------------------|---------------------->
        next     : a         |       next     : b                |   next     : b
        previous : null              previous : a                    previous : null

        transition : false           transition : true               transition : false
```

# Usage

```javascript

import {Transition} from 'react-propsTransition'

const Component = ({ value }) =>
  <Transition toTransition={value} delay={300}>
    {
      ({ next, previous, transition }) =>
        <span>{
          transition
            ? `The value was ${previous}, it will be ${next}`
            : `The value is ${next}`
        }</span>
    }
  </Transition>

```

## Options

- _toTransition_    the value to transition, can be a primitive or an object
- _delay_           delay of the transition, in ms 
- _equal_           check for value change, ( default is == )

## IndirectTransition

The indirect transition have the same api, but transition only from a value to null and from null to a value.

When the direct transition goes A -> B, the indirect goes A -> null -> B ( with A != null and B != null )

```
  Flow diagram :

  k = 'a'             k change to 'b'
                               |
                               |<------------delay---------------->|<------------delay---------------->|
      . . . -------------------|-----------------------------------|-----------------------------------|-------------------------->
          next     : a         |       next     : null             |        next     : b               |      next     : b
          previous : null              previous : a                         previous : null                   previous : null
  
         transition : false            transition : true                    transition : true                 transition : false
  
                                       indirectNext: b                      indirectNext: null
                                       transitionIndirect: true             transitionIndirect: false
```

# Example

Animate the fadeIn, fadeOff of a drawer

```javascript

const Drawer = ({ opened }) =>
  <Transition toTransition={opened} delay={300}>
    {
      ({ next, previous, transition }) =>
        (next || previous) &&
          <div className={'drawer' + (transition ? (next ? 'drawer--fadeIn' : 'drawer--fadeOut') : '')}>
            <Content />
          </div>
    }
  </Transition>

```
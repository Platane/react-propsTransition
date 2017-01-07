import React from 'react'

/**
 * Transitioned,
 *  wrapper component, used to transition a prop from a previous state to a next,
 *    which is useful to use combined to css transition/animation
 *
 *  usage is similar to react-motion
 *
 *  use as :
 *
 *  ...<div>
 *       <Transitioned toTransition={ this.props.a } delay={ delay }  >
 *         {
 *           ({ next, previous }) =>  <div> was { previous } will be { next } </div>
 *         }
 *       </Transitioned>
 *    <div>
 *
 *  Transitioned children should be a unique function. This function receive in argument next and previous, which are the value to transition
 *
 *  Flow diagram :
 *
 *    k = 'a'             k change to 'b'
 *                             |
 *                             |<------------delay---------------->|
 *    . . . ------------------------------------------------------------------------------>
 *        next     : a                 next     : b                    next     : b
 *        previous : null              previous : a                    previous : null
 *
 *        transition : false           transition : true               transition : false
 *
 *
 *
 */

class Transitioned extends React.Component {

  constructor (props) {
    super(props)

    this.state = { transition: false, next: this.props.toTransition }
    this.cancel = null

    this.fadeOff = this.fadeOff.bind(this)
  }

  fadeOff () {
    clearTimeout(this.cancel)

    this.setState({ previous: null, transition: false })
  }

  _equal (a, b) {
    return this.props.equal
      ? !a === !b && (!a || this.props.equal(a, b))
      : a === b
  }
  _delay () {
    return this.props.delay || 5000
  }

  componentWillReceiveProps (nextProps) {
    clearTimeout(this.cancel)

    const next = nextProps.toTransition
    const previous = this.state.next

    if (!this._equal(previous, next)) {
      this.setState({ next, previous, transition: true, transitionIndirect: false, indirectNext: null })

      this.cancel = setTimeout(this.fadeOff, this._delay())
    }
  }

  componentWillUnmount () {
    clearTimeout(this.cancel)
  }

  render () {
    const renderedChildren = this.props.children(this.state)
    return renderedChildren && React.Children.only(renderedChildren) || null
  }
}

const {PropTypes} = React

Transitioned.propTypes = {
  toTransition: PropTypes.any,
  equal: PropTypes.func,
  delay: PropTypes.number
}

export default Transitioned

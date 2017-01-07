/**
 * same as transition, expect
 * with the option indirect, the Flow diagram looks like
 * ( insteand of doing a -> b, it goes a -> null -> b )
 *
 *
 * k = 'a'             k change to 'b'
 *                             |
 *                             |<------------delay---------------->|<------------delay---------------->|
 *    . . . ---------------------------------------------------------------------------------------------------------------------->
 *        next     : a                 next     : null                      next     : b                      next     : b
 *        previous : null              previous : a                         previous : null                   previous : null
 *
 *       transition : false            transition : true                    transition : true                 transition : false
 *
 *                                     indirectNext: b                      indirectNext: null
 *                                     transitionIndirect: true             transitionIndirect: false
 *
 */

import Transitioned from './transitioned'

class IndirectTransitioned extends Transitioned {

  fadeOff () {
    clearTimeout(this.cancel)

    if (this.state.indirectNext) {
      this.setState({ previous: null, next: this.state.indirectNext, indirectNext: null, transitionIndirect: false })

      this.cancel = setTimeout(this.fadeOff, this._delay())
    } else {
      this.setState({ previous: null, transition: false, indirectNext: null, transitionIndirect: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    clearTimeout(this.cancel)

    const next = nextProps.toTransition
    const previous = this.state.next

    if (!this._equal(previous, next) && (!this.state.transitionIndirect || !this._equal(this.state.indirectNext, next))) {
      if (!previous || !next) {
        this.setState({ next, previous, transition: true, transitionIndirect: false, indirectNext: null })
      } else {
        this.setState({ next: null, previous, transition: true, transitionIndirect: true, indirectNext: next })
      }

      this.cancel = setTimeout(this.fadeOff, this._delay())
    }
  }

}

IndirectTransitioned.propTypes = {
  ...Transitioned.propTypes
}

export default IndirectTransitioned

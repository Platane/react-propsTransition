/* global jest */
import React from 'react'
import {IndirectTransition} from '../index'
import renderer from 'react-test-renderer'

const DumbComponent = props =>
  <IndirectTransition toTransition={props.a} delay={500} equal={(u, v) => u[1] === v[1]}>
    {
      ({ next, previous, transition }) =>
        <div {...props}>{`b is ${props.b}; ` + (!transition ? `a is ${next}` : `a transition from ${previous} to ${next}`)}</div>
    }
  </IndirectTransition>

class Component extends React.Component {

  constructor (props) {
    super(props)
    this.state = { a: props.a, b: props.b }
  }

  render () {
    return <DumbComponent {...this.state} setA={a => this.setState({a})} setB={b => this.setState({b})} />
  }
}

describe('indirectTransitioned component', () => {
  describe('iitial render', () => {
    it('should render without transition', () => {
      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A1')
    })
  })

  describe('set props not marked as "to transition"', () => {
    it('should render without transition', () => {
      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set b
      tree.props.setB('B2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B2; a is A1')
    })
  })

  describe('set props marked as "to transition"', () => {
    it('should render with transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')
      expect(setTimeout.mock.calls.length).toBe(1)
      expect(setTimeout.mock.calls[0][1]).toBe(500)

      // after a delay
      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A2')
      expect(setTimeout.mock.calls.length).toBe(2)
      expect(setTimeout.mock.calls[1][1]).toBe(500)

      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A2')
      expect(setTimeout.mock.calls.length).toBe(2)
    })
  })

  describe('set props marked as "to transition" to the same value', () => {
    it('should render without transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A1')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A1')
      expect(setTimeout.mock.calls.length).toBe(0)
    })
  })

  describe('set props marked as "to transition" to a value equal to previous', () => {
    it('should render without transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A1_')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A1_')
      expect(setTimeout.mock.calls.length).toBe(0)
    })
  })

  describe('set props marked as "to transition", set again during the transition to null', () => {
    it('should render with transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')

      tree.props.setA('A3')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A3')

      // after a delay
      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A3')
    })
  })

  describe('set props marked as "to transition", set again during the transition from null', () => {
    it('should render with transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')

      jest.runOnlyPendingTimers()

      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A2')

      tree.props.setA('A3')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A2 to null')

      jest.runOnlyPendingTimers()

      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A3')

      // after a delay
      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A3')
    })
  })

  describe('set props marked as to transition, set again to an equal value during the transition to null', () => {
    it('should render with transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')

      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')

      // after a delay
      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A2')

      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A2')
    })
  })

  describe('set props marked as to transition, set again to an equal value during the transition from null', () => {
    it('should render with transition', () => {
      jest.useFakeTimers()

      const component = renderer.create(<Component a={'A1'} b={'B1'} />)
      let tree = component.toJSON()

      // set a
      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from A1 to null')

      // after a delay
      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A2')

      tree.props.setA('A2')
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a transition from null to A2')

      jest.runOnlyPendingTimers()
      tree = component.toJSON()
      expect(tree.children[0]).toEqual('b is B1; a is A2')
    })
  })
})

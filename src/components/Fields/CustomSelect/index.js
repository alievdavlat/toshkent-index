import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@/services/i18n'

class CustomSelect extends React.Component {
  makeOption = option => (
    <option key={option.id} value={option.id}>
      {option.label[`label_${i18n.language}`]}
    </option>
  )

  handleChange = event => {
    this.props.onChange(event.target.id, event.target.value)
    event.preventDefault()
  }

  handleBlur = event => {
    this.props.onBlur(this.props.id, true)
    event.preventDefault()
  }

  render() {
    const { id, name, options, onBlur } = this.props
    return (
      <div>
        <select
          id={id}
          name={name}
          component='select'
          onChange={this.handleChange}
          onBlur={onBlur && this.handleBlur}
          value={this.props.value}
        >
          {options.map(this.makeOption)}
        </select>
      </div>
    )
  }
}

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(String)
}

CustomSelect.defaultValue = {
  options: []
}

export default CustomSelect

import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import styled, { css } from 'styled-components'

const Row = ({children, className, gutter, wrap}) => {

  const classNames = cx(
    'grid-column',
    wrap && 'flex-wrap',
    className,
  );
  return (
    <GridRow className={classNames} {...{gutter}}>
      {children}
    </GridRow>
  );
};

Row.propTypes = {
  gutter: PropTypes.number,
  className: PropTypes.string
};
Row.defaultProps = {
  gutter: 15,
  className: ""
};


const GridRow = styled.div`
  display: flex;
  ${props => css`
     margin: 0 -${props.gutter}px
  `}
`;



export default Row;
import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import styled, { css } from 'styled-components'

const Column = ({children, xs, sm, md, lg, xl, rest, calc, customSize, gutter, customSizeMode, className}) => {

  const classNames = cx(
    'grid-column',
    !customSize && !calc && xs && `col-${xs}`,
    !customSize && !calc && sm && `col-sm-${sm}`,
    !customSize && !calc && md && `col-md-${md}`,
    !customSize && !calc && lg && `col-lg-${lg}`,
    !customSize && !calc && xl && `col-xl-${xl}`,
    className,
  );
  return (
    <GridColumn className={classNames} {...{xs, sm, md, lg, xl, rest, calc, customSize, customSizeMode, gutter}}>
      {children}
    </GridColumn>
  );
};

Column.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  customSize: PropTypes.bool,
  calc: PropTypes.bool,
  customSizeMode: PropTypes.string,
  className: PropTypes.string,
  gutter: PropTypes.number,
};
Column.defaultProps = {
  customSizeMode: 'px',
  className: "",
  gutter: 15,
  calc: false,
};


const GridColumn = styled.div`
  ${props => props.rest && css`
    flex: 1;
  `}
  ${props => props.gutter && css`
    padding: 0 ${props.gutter}px;
  `}
  ${props => props.customSize && props.xs && css`
     width: ${props.xs}${props.customSizeMode};
  `}
  ${props => props.customSize && props.sm && css`
    @media(min-width: 576px){
      width: ${props.sm}${props.customSizeMode};
    }
  `}
  ${props => props.customSize && props.md && css`
    @media(min-width: 768px){
      width: ${props.md}${props.customSizeMode};
    }
  `}
  ${props => props.customSize && props.lg && css`
    @media(min-width: 992px){
      width: ${props.lg}${props.customSizeMode};
    }
  `}
  ${props => props.customSize && props.xl && css`
    @media(min-width: 1200px){
      width: ${props.xl}${props.customSizeMode};
    }
  `}
  ${props => props.calc && props.xs && css`
     width: calc(100% - ${props.xs}${props.customSizeMode});
  `}
  ${props => props.calc && props.sm && css`
    @media(min-width: 576px){
      width: calc(100% - ${props.sm}${props.customSizeMode});
    }
  `}
  ${props => props.calc && props.md && css`
    @media(min-width: 768px){
      width: calc(100% - ${props.md}${props.customSizeMode});
    }
  `}
  ${props => props.calc && props.lg && css`
    @media(min-width: 992px){
      width: calc(100% - ${props.lg}${props.customSizeMode});
    }
  `}
  ${props => props.calc && props.xl && css`
    @media(min-width: 1200px){
      width: calc(100% - ${props.xl}${props.customSizeMode});
    }
  `}
`;



export default Column;
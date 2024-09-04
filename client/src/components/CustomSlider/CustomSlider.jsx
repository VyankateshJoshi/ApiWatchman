import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import * as React from 'react';

function ValueLabelComponent(props) {
  const { children, value } = props;

  const labels = {
    1: '5 min',
    2: '15 min',
    3: '30 min',
    4: '1 hr',
    5: '4 hr',
    6: '6 hr',
    7: '12 hr',
    8: '24 hr',
  };

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={labels[value]}>
      {labels[value]}
    </Tooltip>
  );
}

const marks = [
  { value: 1, label: '5 min' },
  { value: 2, label: '15 min' },
  { value: 3, label: '30 min' },
  { value: 4, label: '1 hr' },
  { value: 5, label: '4 hr' },
  { value: 6, label: '6 hr' },
  { value: 7, label: '12 hr' },
  { value: 8, label: '24 hr' },
];

function valuetext(value) {
  const labels = {
    1: '5 min',
    2: '15 min',
    3: '30 min',
    4: '1 hr',
    5: '4 hr',
    6: '6 hr',
    7: '12 hr',
    8: '24 hr',
  };

  return labels[value];
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

export default function CustomizedSlider({handleOnChange,value}) {
  return (
    <PrettoSlider
      valueLabelDisplay="auto"
      aria-label="pretto slider"
      defaultValue={1}
      min={1}
      max={8}
      value={value}
      onChange={handleOnChange}
      getAriaValueText={valuetext}
      step={1}
      marks={marks}
      // sx={{ width: "90%" }}
    />
  );
}

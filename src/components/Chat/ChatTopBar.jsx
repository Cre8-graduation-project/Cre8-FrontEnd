import { IconButton } from '@mui/material';
import { RiArrowLeftSLine } from '@remixicon/react';
import classes from './ChatComponent.module.css';

export default function ChatTopBar({ name, backBtn = false, onBackClick = () => {} }) {
  return <div className={classes.chatTopBar}>
    {backBtn && <IconButton size='small' onClick={onBackClick}>
      <RiArrowLeftSLine color='black' />
    </IconButton>}
    <h3>{name}</h3>
  </div>
}
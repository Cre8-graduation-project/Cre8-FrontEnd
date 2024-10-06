import { IconButton, Avatar } from '@mui/material';
import { RiArrowLeftSLine } from '@remixicon/react';
import classes from './ChatComponent.module.css';

export default function ChatTopBar({ name, accessUrl, backBtn = false, onBackClick = () => {} }) {
  return <div className={classes.chatTopBar}>
    {backBtn && <IconButton size='small' onClick={onBackClick}>
      <RiArrowLeftSLine color='black' />
    </IconButton>}
    <Avatar src={accessUrl} sx={{ width: 36, height: 36, marginRight: '0.5rem', border: '1px solid #8a8784' }} />
    <h3>{name}</h3>
  </div>
}
import { Backdrop, Fab } from "@mui/material";
import { RiCloseLargeLine } from "@remixicon/react";

import classes from "./ImagePopUp.module.css";

export default function ImagePopUp({ imgPopUpData, closeImgPopUp }) {
  return (
    <Backdrop
      open={imgPopUpData !== null}
      aria-hidden={false}
      className={classes.ptfImgPopup}
      sx={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <img src={imgPopUpData} alt="IMG_POPUP" />
      <Fab onClick={closeImgPopUp}>
        <RiCloseLargeLine />
      </Fab>
    </Backdrop>
  );
}

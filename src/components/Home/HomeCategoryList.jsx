import { Card, Grid } from "@mui/material";
import {
  homeIcon_2d,
  homeIcon_3d,
  homeIcon_audio,
  homeIcon_illust,
  homeIcon_transcript,
  homeIcon_video,
} from "../../assets/images/imageProvider";
import classes from "./HomeComponent.module.css";
import { useNavigate } from "react-router-dom";

export default function HomeCategoryList() {
  const navigate = useNavigate();

  const handleCardClick = (tagID) => {
    navigate("/recruit", { state: { tagID: tagID } });
  };

  return (
    <div className={classes.homeCategoryArea}>
      <h3>카테고리로 보는 구인 공고</h3>
      <Grid container columns={{ xs: 4, sm: 6, md: 12 }} spacing={{ xs: 2 }}>
        {categoryData.map((item, index) => (
          <Grid item key={index} xs={2} md={2}>
            <Card
              elevation={2}
              className={classes.homeCategoryCard}
              onClick={() => {
                handleCardClick(item.tagID);
              }}
            >
              <img src={item.image} alt={item.alt} />
              <p>{item.title}</p>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const categoryData = [
  {
    title: "영상 편집",
    image: homeIcon_video,
    tagID: 18,
    alt: "Video Editing",
  },
  {
    title: "2D 그래픽",
    image: homeIcon_2d,
    tagID: 19,
    alt: "2D Graphic Design",
  },
  {
    title: "3D 그래픽",
    image: homeIcon_3d,
    tagID: 20,
    alt: "3D Graphic Design",
  },
  {
    title: "일러스트",
    image: homeIcon_illust,
    tagID: 22,
    alt: "Illustration",
  },
  {
    title: "영상 자막",
    image: homeIcon_transcript,
    tagID: 21,
    alt: "Transcript",
  },
  {
    title: "음성 / 오디오",
    image: homeIcon_audio,
    tagID: 23,
    alt: "Audio / Voice",
  },
];

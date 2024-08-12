import { Card, Link } from "@mui/material";
import classes from "./HomeComponent.module.css";

export default function HomePostCard() {
  const data = dummyData;

  return (
    <div className={classes.homePostCardArea}>
      <h3>최신 글</h3>
      <Card
        elevation={3} 
        className={classes.homePostCard}
      >  
        {data.map((item, index) => (
          <Link key={index} color="inherit" underline="none" className={classes.homePostLink}>
            <span className={classes.titleCategory}>[{item.type}] </span>
            <span className={classes.titleName}>{item.title} </span>
            <span className={classes.titleComment}>[{item.comment}]</span>
          </Link>
        ))}
      </Card>
    </div>
  );
}

const dummyData = [
  {
    type: "공모전",
    title: "오늘의 공모전 소식",
    comment: 2
  },
  {
    type: "asdf",
    title: "gawehgarg",
    comment: 3
  },
  {
    type: "waerfaew",
    title: "hjkdaskjbgaasdfasdfasdfkre",
    comment: 1
  },
  {
    type: "asdf",
    title: "gawehgarg",
    comment: 3
  },
  {
    type: "공모전",
    title: "오늘의 공모전 소식",
    comment: 2
  },
]